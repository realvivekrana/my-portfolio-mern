import axios from 'axios';

/*
|--------------------------------------------------------------------------
| API BASE URL
|--------------------------------------------------------------------------
|
| Priority order:
| 1. VITE_API_URL environment variable (set in .env.production for Vercel)
| 2. localhost:5000 for development
|
| HOW TO SET FOR PRODUCTION (Vercel):
| ─────────────────────────────────────────────────────────────
| Option A — .env.production file (recommended):
|   VITE_API_URL=https://YOUR-SERVICE.onrender.com/api
|
| Option B — Vercel Dashboard:
|   Project → Settings → Environment Variables
|   Key:   VITE_API_URL
|   Value: https://YOUR-SERVICE.onrender.com/api
|   Env:   Production
| ─────────────────────────────────────────────────────────────
|--------------------------------------------------------------------------
*/

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

/*
|--------------------------------------------------------------------------
| SEPARATE "BARE" CLIENT FOR TOKEN REFRESH
|--------------------------------------------------------------------------
|
| Yeh `API` instance jaisa hi hai, lekin isme interceptors NAHI lage —
| jaanbujh kar. Agar hum refresh call ke liye bhi `API` use karte,
| aur refresh call khud 401 return karta (e.g. refresh cookie bhi expire
| ho chuki ho), toh response interceptor dubara khud ko trigger karne
| ki koshish karta — ek infinite loop. Isliye refresh sirf isi alag,
| "bare" client se hota hai.
|
|--------------------------------------------------------------------------
*/

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

/*
|--------------------------------------------------------------------------
| REQUEST INTERCEPTOR
|--------------------------------------------------------------------------
| Automatically attaches JWT token for protected admin routes.
| Removes Content-Type for FormData (browser sets boundary automatically).
|--------------------------------------------------------------------------
*/

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Let browser set multipart boundary for file uploads
    if (config.data instanceof FormData) {
      if (config.headers) {
        delete config.headers['Content-Type'];
        delete config.headers['content-type'];
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/*
|--------------------------------------------------------------------------
| AUTOMATIC ACCESS-TOKEN REFRESH
|--------------------------------------------------------------------------
|
| CONTEXT — why this exists:
| Backend ka access token sirf 15 minute ka hota hai (short-lived, by
| design — see Backend/utils/generateToken.js). Ek 30-din wala refresh
| token httpOnly cookie me store hota hai, jisse naya access token liya
| ja sakta hai bina dubara login kiye — `POST /api/auth/refresh-token`.
|
| Pehle frontend isse kabhi call hi nahi karta tha, isliye 15 min baad
| har protected request "Not authorized, token failed" (401) deta tha
| aur admin ko dubara login karna padta tha beech kaam me.
|
| Ab yeh interceptor har 401 par automatically ek baar refresh try
| karta hai, naya access token localStorage me save karta hai, aur
| WAHI original request dubara (retry) bhejta hai — admin ko kuch pata
| bhi nahi chalta, kaam chalta rehta hai.
|
| CONCURRENT REQUESTS:
| Agar ek hi waqt par kai requests 401 paati hain (e.g. dashboard load
| par 3-4 API calls ek saath), sirf PEHLI request refresh call karti
| hai — baaki sab `pendingQueue` me wait karti hain aur naya token
| milte hi retry hoti hain. Isse backend par refresh-token endpoint
| baar-baar (aur unnecessarily) hit nahi hota.
|
|--------------------------------------------------------------------------
*/

let isRefreshing = false;
let pendingQueue = [];

const resolvePendingQueue = (error, newToken = null) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(newToken);
    }
  });

  pendingQueue = [];
};

/*
|--------------------------------------------------------------------------
| ENDPOINTS THAT SHOULD **NEVER** TRIGGER A REFRESH ATTEMPT
|--------------------------------------------------------------------------
|
| - /auth/login          -> wrong password 401 is a normal login failure,
|                           not an expired session.
| - /auth/refresh-token  -> if the refresh call ITSELF 401s (refresh
|                           cookie expired / invalid), retrying it would
|                           loop forever.
| - /auth/verify-pin     -> wrong PIN 401 is a normal PIN failure.
|
|--------------------------------------------------------------------------
*/

const isAuthEndpoint = (url = '') =>
  url.includes('/auth/login') ||
  url.includes('/auth/refresh-token') ||
  url.includes('/auth/verify-pin');

/*
|--------------------------------------------------------------------------
| RESPONSE INTERCEPTOR
|--------------------------------------------------------------------------
*/

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    const shouldAttemptRefresh =
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint(originalRequest.url || '');

    if (shouldAttemptRefresh) {
      // -----------------------------------------------------
      // A refresh is already in progress — queue this request
      // and retry it once the in-flight refresh resolves.
      // -----------------------------------------------------

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return API(originalRequest);
          })
          .catch((queueError) => Promise.reject(queueError));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Refresh token httpOnly cookie ke through jaata hai —
        // koi body/header nahi bhejna padta, sirf withCredentials.
        const refreshResponse = await refreshClient.post(
          '/auth/refresh-token'
        );

        const newAccessToken = refreshResponse.data?.data?.token;

        if (!newAccessToken) {
          throw new Error('Refresh endpoint did not return a token');
        }

        localStorage.setItem('adminToken', newAccessToken);

        resolvePendingQueue(null, newAccessToken);

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return API(originalRequest);
      } catch (refreshError) {
        resolvePendingQueue(refreshError, null);

        // Refresh bhi fail ho gaya (refresh cookie expire/invalid) —
        // session sach me khatam ho chuki hai, session data saaf karke
        // login page par bhej do.
        localStorage.removeItem('adminToken');
        sessionStorage.removeItem('adminPinVerified');

        const isAlreadyOnLoginPage =
          typeof window !== 'undefined' &&
          window.location.pathname.startsWith('/admin/login');

        if (typeof window !== 'undefined' && !isAlreadyOnLoginPage) {
          window.location.href = '/admin/login';
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Log API errors in development only
    if (import.meta.env.DEV) {
      console.error('[API Error]', {
        url: error.config?.url,
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
      });
    }

    return Promise.reject(error);
  }
);

export default API;
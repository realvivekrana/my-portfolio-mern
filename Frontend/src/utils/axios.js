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
| RESPONSE INTERCEPTOR
|--------------------------------------------------------------------------
*/

API.interceptors.response.use(
  (response) => response,
  (error) => {
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
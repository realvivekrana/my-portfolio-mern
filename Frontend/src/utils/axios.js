import axios from 'axios';

/*
|--------------------------------------------------------------------------
| API BASE URL
|--------------------------------------------------------------------------
|
| Development:
|   VITE_API_URL normally:
|   http://localhost:5000/api
|
| Production:
|   VITE_API_URL will be your deployed backend URL.
|
| Example:
|   https://your-backend.onrender.com/api
|
|--------------------------------------------------------------------------
*/

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api';

/*
|--------------------------------------------------------------------------
| Axios Instance
|--------------------------------------------------------------------------
*/

const API = axios.create({
  baseURL: API_BASE_URL,

  /*
  |--------------------------------------------------------------------------
  | IMPORTANT
  |--------------------------------------------------------------------------
  |
  | Content-Type ko globally force nahi karenge.
  |
  | JSON requests ke liye Axios automatically appropriate headers
  | handle karega.
  |
  | FormData requests ke liye browser ko multipart/form-data ka
  | boundary automatically generate karne denge.
  |
  |--------------------------------------------------------------------------
  */

  withCredentials: true,
});

/*
|--------------------------------------------------------------------------
| REQUEST INTERCEPTOR
|--------------------------------------------------------------------------
|
| Admin login ke baad stored JWT token automatically
| har protected API request ke saath send hoga.
|
|--------------------------------------------------------------------------
*/

API.interceptors.request.use(
  (config) => {
    /*
    |--------------------------------------------------------------------------
    | JWT TOKEN
    |--------------------------------------------------------------------------
    */

    const token =
      localStorage.getItem(
        'adminToken'
      );

    if (token) {
      config.headers =
        config.headers || {};

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    /*
    |--------------------------------------------------------------------------
    | FORM DATA HANDLING
    |--------------------------------------------------------------------------
    |
    | Resume / profile image / certificate image upload ke time
    | FormData use hota hai.
    |
    | Browser ko:
    |
    | multipart/form-data; boundary=...
    |
    | khud generate karne dena zaroori hai.
    |
    | Isliye FormData request mein manually Content-Type remove kar rahe hain.
    |
    |--------------------------------------------------------------------------
    */

    if (
      config.data instanceof FormData
    ) {
      if (config.headers) {
        delete config.headers[
          'Content-Type'
        ];

        delete config.headers[
          'content-type'
        ];
      }
    }

    /*
    |--------------------------------------------------------------------------
    | NORMAL JSON REQUESTS
    |--------------------------------------------------------------------------
    |
    | POST / PUT / PATCH mein agar normal JavaScript object bheja ja raha hai,
    | Axios automatically JSON handle karega.
    |
    |--------------------------------------------------------------------------
    */

    return config;
  },

  (error) => {
    return Promise.reject(
      error
    );
  }
);

/*
|--------------------------------------------------------------------------
| RESPONSE INTERCEPTOR
|--------------------------------------------------------------------------
|
| Abhi automatically logout nahi kar rahe hain.
| Existing authentication flow ko change nahi karna hai.
|
|--------------------------------------------------------------------------
*/

API.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    return Promise.reject(
      error
    );
  }
);

/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
*/

export default API;
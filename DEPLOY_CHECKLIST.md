# Deploy Checklist (for the recurring backend failures)

## 1. Render (Backend): Environment Variables

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `MONGO_URI` | Atlas connection string (URL-encode the password if it has special characters) |
| `JWT_SECRET` | A long random string |
| `JWT_REFRESH_SECRET` | A **different** long random string |
| `ADMIN_PIN` | Your admin PIN |
| `FRONTEND_URL` | `https://my-portfolio-mern-mauve.vercel.app` (no trailing `/`) |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | From your Cloudinary dashboard |
| `GROQ_API_KEY` | From https://console.groq.com/keys (needed for the chatbot; `GEMINI_API_KEY` will not work) |
| `RESEND_API_KEY`, `EMAIL_FROM`, `ADMIN_NOTIFY_EMAIL` | For contact-form emails (Render's free tier blocks Gmail SMTP) |

In MongoDB Atlas, go to Network Access and allow `0.0.0.0/0`.

## 2. Vercel (Frontend)

Go to Settings → Environment Variables and set:

`VITE_API_URL = https://<YOUR-RENDER-SERVICE>.onrender.com/api`

`Frontend/.env.production` currently contains the placeholder `my-portfolio-backend.onrender.com`. Replace it with your real backend URL, then redeploy.

## 3. Quick test

1. Open `https://<render-url>/api/health` in your browser. It should return `"database": "connected"`.
2. To create the first admin, call `POST /api/auth/register` once. Registration is disabled after that.
3. Do **not** keep a free Render service awake 24/7 (no keep-alive pings, no UptimeRobot). See the section below.

## 4. "This service has been suspended" on Render

Render's free plan gives the whole workspace only 750 free instance hours per month. A free web service uses those hours whenever it is running (a sleeping service uses none). If the hours run out, Render suspends **all** free web services until the 1st of the next month. A service can also be suspended for unusually high outbound traffic.

While suspended, every request returns 503/429 without CORS headers, so the browser shows CORS errors. That is why the live site breaks even though localhost works.

How to get it back:
1. Render Dashboard -> your workspace -> Billing/Usage: check how many free hours are used, and which services are consuming them.
2. Wait for the reset on the 1st of the next month, **or** change the backend service to a paid instance type (restores it immediately), **or** move the backend to another host.
3. Keep fewer free services running, and leave `KEEP_ALIVE` unset (it is off by default).
4. The free plan spins a service down after 15 minutes without traffic. The first request after that takes about 30-60 seconds. The frontend retries automatically, so this is expected behaviour, not a bug.
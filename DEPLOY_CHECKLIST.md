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
3. To keep the free tier from sleeping, set up https://uptimerobot.com to ping `/api/health` every 5 minutes.
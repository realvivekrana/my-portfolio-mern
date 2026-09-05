<div align="center">

# 💼 Vivek Rana — MERN Stack Developer Portfolio

**A modern, full-stack developer portfolio with a dynamic CMS-style Admin Dashboard and an AI chatbot.**

React&nbsp;•&nbsp;Node.js&nbsp;•&nbsp;Express.js&nbsp;•&nbsp;MongoDB&nbsp;•&nbsp;Tailwind&nbsp;CSS&nbsp;•&nbsp;Cloudinary&nbsp;•&nbsp;JWT&nbsp;•&nbsp;AI Chatbot

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-Build-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-Personal_Project-lightgrey)](#-license)

[Live Demo](https://my-portfolio-mern-mauve.vercel.app) · [Report a Bug](https://github.com/realvivekrana/my-portfolio-mern/issues) · [Request a Feature](https://github.com/realvivekrana/my-portfolio-mern/issues)

</div>

---

## 📌 Overview

This is a full-stack personal portfolio website built to showcase a professional profile, technical skills, experience, education, certifications, projects, and contact information.

The project goes beyond a static portfolio by providing:

- 🧑‍💻 A **CMS-style Admin Dashboard** backed by MongoDB, so content can be updated dynamically without touching React code.
- 🤖 An **AI Chatbot** that answers visitor questions using live portfolio data, built **mobile-first and fully responsive** across phones, tablets, and desktops.

### Project Structure

```text
my-portfolio-mern/
├── Frontend/     # React + Vite frontend (Tailwind CSS v4)
├── Backend/      # Node.js + Express REST API
└── README.md
```

---

## 📚 Table of Contents

- [Features](#-features)
- [AI Chatbot](#-ai-chatbot)
- [Tech Stack](#️-tech-stack)
- [Architecture](#️-architecture)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Resume Upload Flow](#-resume-upload-flow)
- [Dynamic Content Flow](#-dynamic-content-flow)
- [Deployment](#-deployment)
- [Security Considerations](#-security-considerations)
- [Future Improvements](#-future-improvements)
- [Troubleshooting](#-troubleshooting)
- [About Me](#-about-me)
- [License](#-license)

---

## ✨ Features

### 🌐 Public Portfolio

- Hero, About, Skills, Experience, Education, Certifications, Projects, and Contact sections
- Social links & availability badge
- **Mobile-first responsive layout** — works cleanly on small phones, tablets, and large desktops
- Light/dark themed UI with persisted theme preference
- Modern animations, floating tech badges, and interactive elements
- Embedded **AI chatbot** for instant visitor Q&A

### 🧑‍💻 Admin Dashboard

Authenticated admins can manage:

- Profile, Hero & About content
- Contact info & social links
- Experience & Education
- Skills
- Projects
- Certificates
- Resume (upload / replace / delete)
- Profile image
- SEO metadata
- Portfolio visibility & site settings
- Admin PIN & password management

### 📄 Resume Management

Resume handling is integrated with the backend instead of depending on a hard-coded frontend PDF:

```text
Admin Dashboard → PDF Upload → Multer Validation → Cloudinary (RAW storage)
       → MongoDB Resume Metadata → Public Resume Endpoint → View / Download
```

### ☁️ Cloudinary

Used for all uploaded media: resume PDFs, profile images, certificate images, and other supported uploads.

### 🔐 Authentication

Protected admin APIs use JWT authentication. The frontend Axios instance automatically attaches the stored token:

```http
Authorization: Bearer <token>
```

### 🗄️ MongoDB

MongoDB + Mongoose stores all dynamic portfolio content: Hero, About, Contact, Social Links, Resume, Experience, Education, Skills, SEO, and Settings.

---

## 🤖 AI Chatbot

A floating assistant widget lets visitors ask natural-language questions about skills, projects, experience, and education — answered using **live data pulled from MongoDB**, not hard-coded text.

```text
Chatbot.jsx (Frontend)
      │  fetch() POST /api/chatbot  { message, history }
      ▼
chatbotRoutes.js  ── express-rate-limit (15 msgs / 10 min / IP)
      ▼
chatbotController.js
      │  1. builds a portfolio context from MongoDB
      │     (Hero, About, Skills, Experience, Education,
      │      Projects, Certificates, Contact)
      │  2. PASS 1 (non-streaming, tools enabled) → checks whether
      │     the model wants to call get_resume_link / get_project_link
      │  3. PASS 2 (streaming) → the actual visible reply
      ▼
Groq Chat Completions API (OpenAI-compatible)
      ▼
Server-Sent Events → chunk / action / error / done
      ▼
Chat window (typewriter effect + real action buttons)
```

If a question isn't covered by the stored portfolio data, the bot politely says so and points the visitor to the Contact section instead of making things up.

### 💡 Smart chatbot features

- **Streaming replies** — the reply types out token-by-token (ChatGPT-style) over Server-Sent Events instead of arriving all at once, with an animated cursor while streaming.
- **Quick-reply chips** — the first time the chat opens, suggested questions ("What are his skills?", "Show me his projects", "Download his resume", "Tell me about his experience") appear as tappable chips.
- **Function calling for real actions** — when a visitor asks for the resume or a specific project's link, the model calls a backend tool (`get_resume_link` / `get_project_link`) that looks the real link up in MongoDB/Cloudinary and sends it back as a distinct `action` event. The UI renders it as an actual **Download Resume** button or **Live Demo / GitHub** buttons — the model never has to (or is allowed to) hallucinate a URL.
- **Per-IP rate limiting** — `express-rate-limit` caps each visitor to 15 messages per 10 minutes, so a script (or an over-eager visitor) can't burn through the Groq API quota. `app.set('trust proxy', 1)` in `server.js` makes sure this reads the visitor's real IP behind Render/Railway/Vercel's proxy.
- **Persisted chat history** — conversations are saved to `localStorage`, so refreshing the page doesn't lose the thread. A trash-icon button in the header clears the history and starts fresh.

### 📱 Mobile-first & fully responsive

The chatbot UI is built mobile-first, then progressively enhanced for larger screens:

| Breakpoint | Behavior |
|---|---|
| **Base (< 640px)** | Opens as a full-width **bottom sheet** sized with `dvh` units (so mobile browser address bars never clip it), with a tap-outside backdrop to dismiss, safe-area-aware spacing for notches/home indicators, and a 16px input font so iOS Safari doesn't auto-zoom on focus. |
| **`sm:` (≥ 640px)** | Switches to a **floating card** docked above the toggle button, fixed width/height. |
| **`md:` and up** | Slightly wider floating card with extra breathing room from the viewport edge. |

Other responsive/UX details:

- Body scroll is locked behind the chat only while it's open **on mobile**, so the page underneath doesn't scroll along with it.
- An explicit in-header close button is always reachable, even on very small screens.
- The input auto-focuses when the chat opens, and message bubbles wrap and resize their max-width per breakpoint so long replies never overflow the screen.
- Fully supports light/dark mode.

---

## 🛠️ Tech Stack

### Frontend
- React 19 + Vite
- Tailwind CSS v4
- React Router DOM
- Axios
- React Icons
- React Toastify

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- Multer + Multer Storage Cloudinary
- Cloudinary SDK
- bcryptjs
- CORS
- dotenv

### AI Chatbot
- Groq Chat Completions API (OpenAI-compatible endpoint)
- Portfolio context built dynamically from MongoDB on every request

### Tools
- Git & GitHub
- VS Code
- Postman
- MongoDB Atlas
- Cloudinary

---

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │   Public Visitors   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ React + Vite        │
                    │ Frontend            │
                    └──────────┬──────────┘
                               │ Axios
                               ▼
                    ┌─────────────────────┐
                    │ Express REST API    │
                    │ Backend             │
                    └───────┬───────┬─────┘
                            │       │
                ┌───────────┘       └───────────┐
                ▼                               ▼
       ┌─────────────────┐             ┌─────────────────┐
       │ MongoDB Atlas   │             │ Cloudinary      │
       │ Portfolio Data  │             │ Uploaded Media  │
       └─────────────────┘             └─────────────────┘

                    ┌─────────────────────┐
                    │ Admin Dashboard     │
                    │ JWT Protected APIs  │
                    └─────────────────────┘

                    ┌─────────────────────┐
                    │ AI Chatbot          │
                    │ Groq Chat API       │
                    └─────────────────────┘
```

---

## 📂 Project Structure

```text
my-portfolio-mern/
│
├── Frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── admin/        # Admin dashboard panels
│   │   │   ├── layout/       # Navbar, Footer
│   │   │   ├── sections/     # Hero, About, Skills, Projects, etc.
│   │   │   └── ui/           # Chatbot, Loader, backgrounds, shared UI
│   │   ├── context/          # Auth & Theme context
│   │   ├── pages/            # Home, Admin routes, NotFound
│   │   ├── utils/            # Axios instance, media URL helpers
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── .env.example
│   └── package.json
│
├── Backend/
│   ├── config/                # DB connection
│   ├── controllers/           # Route handlers (incl. chatbotController.js)
│   ├── middleware/             # Auth, error handling, upload
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # Express routers
│   ├── uploads/                 # Local upload scratch space
│   ├── .env.example
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## 🔌 API Reference

Base URL (local): `http://localhost:5000/api`

### Portfolio
```text
GET    /api/portfolio
PUT    /api/portfolio

PUT    /api/portfolio/hero
PUT    /api/portfolio/about
PUT    /api/portfolio/contact
PUT    /api/portfolio/social-links
PUT    /api/portfolio/experience
PUT    /api/portfolio/education
PUT    /api/portfolio/seo
PUT    /api/portfolio/settings
```

### Resume & Profile Image
```text
POST   /api/portfolio/upload/resume
GET    /api/portfolio/upload/resume
GET    /api/portfolio/upload/resume/info
GET    /api/portfolio/upload/public-resume
GET    /api/portfolio/resume/public         (legacy → redirects to the route above)

POST   /api/portfolio/upload/profile-image
POST   /api/portfolio/profile-image
DELETE /api/portfolio/profile-image
```

### Projects
```text
GET    /api/projects
GET    /api/projects/featured
GET    /api/projects/:id
POST   /api/projects        (protected)
PUT    /api/projects/:id    (protected)
DELETE /api/projects/:id    (protected)
```

### Certificates
```text
GET    /api/certificates
POST   /api/certificates    (protected)
PUT    /api/certificates/:id    (protected)
DELETE /api/certificates/:id    (protected)
```

### Contact
```text
POST   /api/contact
GET    /api/contact         (protected)
PUT    /api/contact/:id     (protected)
DELETE /api/contact/:id     (protected)
```

### Auth
```text
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/verify-pin     (protected)
GET    /api/auth/me             (protected)
PUT    /api/auth/change-password (protected)
```

### Settings
```text
GET    /api/settings            (protected)
PUT    /api/settings            (protected)
PUT    /api/settings/reset      (protected)
```

### AI Chatbot
```text
POST   /api/chatbot   { message: string, history?: [{ role, text }] }

Response: text/event-stream (Server-Sent Events)
  event: chunk   { token: string }
  event: action  { type: 'resume'|'project', ... }   resume/project link to render
  event: error   { message: string }
  event: done    {}

Rate limit: 15 requests / 10 minutes / IP (429 on excess)
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended) & npm
- MongoDB Atlas or another accessible MongoDB database
- A Cloudinary account
- A free [Groq API key](https://console.groq.com/keys) for the chatbot
- Git

### 1. Clone the repository

```bash
git clone https://github.com/realvivekrana/my-portfolio-mern.git
cd my-portfolio-mern
```

> If your GitHub repository name is different, replace the URL with the correct one.

### 2. Backend setup

```bash
cd Backend
npm install
cp .env.example .env   # then fill in real values
npm run dev
```

The backend runs at:
```text
http://localhost:5000
```

### 3. Frontend setup

Open a second terminal:

```bash
cd Frontend
npm install
cp .env.example .env   # then fill in real values
npm run dev
```

The Vite frontend runs at:
```text
http://localhost:5173
```

---

## 🔐 Environment Variables

### Backend — `Backend/.env`

```env
NODE_ENV=development
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d

ADMIN_PIN=your_admin_pin

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# AI Chatbot — free key from https://console.groq.com/keys
GROQ_API_KEY=your_groq_api_key

FRONTEND_URL=http://localhost:5173
```

### Frontend — `Frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

### ⚠️ Security

Never commit real credentials to GitHub. Keep these private:

- MongoDB credentials
- JWT secret
- Admin PIN / credentials
- Cloudinary API secret
- Groq API key
- Production environment variables

Use the provided `.env.example` files to document required variables without exposing real values.

---

## 📄 Resume Upload Flow

```text
1. Admin selects a PDF
        ↓
2. Frontend sends multipart/form-data
        ↓
3. JWT authenticates the admin
        ↓
4. Multer validates the file
        ↓
5. Backend uploads the PDF to Cloudinary
        ↓
6. Cloudinary returns the uploaded resource
        ↓
7. MongoDB stores the resume metadata
        ↓
8. The public endpoint generates a delivery URL
        ↓
9. Visitors can view/download the resume
```

The project is designed so the deployed application does not depend on the server's local filesystem for persistent resume storage.

---

## 🔄 Dynamic Content Flow

```text
Admin Dashboard → JWT Protected API → Express Controller
     → Mongoose Model → MongoDB → GET /api/portfolio → Public Portfolio
```

This allows portfolio content to be updated through the Admin Dashboard without manually editing React components for every content change.

### Dynamic Sections

| Section | Dynamic |
|---|---|
| Hero | ✅ |
| About | ✅ |
| Contact | ✅ |
| Social Links | ✅ |
| Resume | ✅ |
| Experience | ✅ |
| Education | ✅ |
| Skills | ✅ |
| Projects | ✅ |
| Certifications | ✅ |
| SEO | ✅ |
| Settings | ✅ |

---

## 🌍 Deployment

The project is structured for separate frontend and backend deployment.

```text
Frontend → Vercel
Backend  → Render / Railway / any Node host
              ├── MongoDB Atlas
              └── Cloudinary
```

### Frontend production env

```env
VITE_API_URL=https://your-backend-domain.com/api
```

### Backend production env

```env
NODE_ENV=production

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_production_jwt_secret
JWT_EXPIRE=30d

ADMIN_PIN=your_admin_pin

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

GROQ_API_KEY=your_groq_api_key

FRONTEND_URL=https://your-frontend-domain.vercel.app
```

> Never use `localhost` as a production API URL. The backend also auto-allows any `*.vercel.app` origin, in addition to the explicit list above.

---

## 🔒 Security Considerations

- JWT-protected admin APIs
- Strict, allow-listed CORS configuration
- Environment-based secrets (nothing hard-coded)
- Direct PDF access blocked at the static file layer; resumes are only served through the controlled public endpoint
- PDF upload validation via Multer
- Request body size limits
- Separate frontend/backend deployment
- No production credentials ever committed to the repo

---

## 🚀 Future Improvements

- Automated CI/CD pipeline
- Automated unit/integration tests
- Visitor & portfolio analytics
- Blog/CMS module
- Project filtering & search
- Email notifications on new contact messages
- Rate limiting on public endpoints (chatbot, contact form)
- Refresh-token authentication
- Automated database backups
- Advanced image optimization

---

## 🧯 Troubleshooting

**Chatbot replies with a "not configured" or model error**
Make sure `GROQ_API_KEY` is set in `Backend/.env` and that the model name in `chatbotController.js` matches a model your Groq account currently has access to — Groq periodically retires older model names.

**Chatbot says "sending messages too quickly"**
That's the built-in rate limiter (15 messages / 10 minutes / IP). Wait a few minutes, or adjust the `windowMs` / `limit` values in `Backend/routes/chatbotRoutes.js` if you need a different threshold.

**Chatbot streaming works locally but not in production**
Check that your hosting provider doesn't buffer `text/event-stream` responses. `chatbotController.js` already sends `X-Accel-Buffering: no`, but some platforms need streaming explicitly enabled in their dashboard/config.

**`npm run dev` fails after pulling these chatbot changes**
Run `npm install` inside `Backend/` — the new rate limiter added `express-rate-limit` as a dependency.

**`git commit` fails with `error: unknown switch`**
Use the `-m` flag with quotes around the message, e.g. `git commit -m "your message"` (not `git commit -"your message"`).

**`git push` says `Everything up-to-date` but nothing changed on GitHub**
This usually means the previous commit never actually succeeded (see above) — run `git status` to confirm there's a new commit ready, then push again.

**CORS errors in the browser console**
Add your frontend's exact origin to the `allowedOrigins` array in `Backend/server.js`, or set `FRONTEND_URL` in the backend environment.

---

## 👨‍💻 About Me

### Vivek Kumar Rana

MERN Stack Developer focused on building responsive, scalable, and user-friendly web applications with modern JavaScript technologies.

**Core Technologies:** HTML5 · CSS3 · JavaScript · React.js · Tailwind CSS · Node.js · Express.js · MongoDB · REST APIs · Git · GitHub · Postman

### 🔗 Connect With Me

- **GitHub:** [github.com/realvivekrana](https://github.com/realvivekrana)
- **LinkedIn:** [linkedin.com/in/mrvivekrana](https://www.linkedin.com/in/mrvivekrana/)

---

## 📜 License

This is a personal portfolio project. If you reuse significant parts of the project structure or implementation, please provide appropriate credit.

<div align="center">

Built with ❤️ using React, Node.js, Express.js, MongoDB, and Cloudinary.

</div>
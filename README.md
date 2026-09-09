<div align="center">

# 💼 Vivek Rana — MERN Stack Developer Portfolio

**A modern, full-stack developer portfolio with a dynamic CMS-style Admin Dashboard, an AI chatbot, a blog, and an installable, bilingual, animated front-end.**

React&nbsp;•&nbsp;Node.js&nbsp;•&nbsp;Express.js&nbsp;•&nbsp;MongoDB&nbsp;•&nbsp;Tailwind&nbsp;CSS&nbsp;•&nbsp;Framer&nbsp;Motion&nbsp;•&nbsp;Cloudinary&nbsp;•&nbsp;JWT&nbsp;•&nbsp;AI&nbsp;Chatbot&nbsp;•&nbsp;PWA

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-Build-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![PWA](https://img.shields.io/badge/PWA-Installable-5A0FC8?logo=pwa&logoColor=white)](#-pwa-support)
[![License](https://img.shields.io/badge/License-Personal_Project-lightgrey)](#-license)

[Live Demo](https://my-portfolio-mern-mauve.vercel.app) · [Report a Bug](https://github.com/realvivekrana/my-portfolio-mern/issues) · [Request a Feature](https://github.com/realvivekrana/my-portfolio-mern/issues)

</div>

---

## 📌 Overview

This is a full-stack personal portfolio website built to showcase a professional profile, technical skills, experience, education, certifications, projects, testimonials, a blog, and contact information.

The project goes beyond a static portfolio by providing:

- 🧑‍💻 A **CMS-style Admin Dashboard** backed by MongoDB, so content can be updated dynamically without touching React code.
- 🤖 An **AI Chatbot** that answers visitor questions using live portfolio data.
- 📱 An **installable PWA** with offline support.
- 🌐 Full **English / Hindi** localization.
- 🎬 **Framer Motion** page transitions and a **Cmd/Ctrl+K command palette**.
- Built **mobile-first and fully responsive** across phones, tablets, and desktops.

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
- [Page Transitions & Command Palette](#-page-transitions--command-palette)
- [PWA Support](#-pwa-support)
- [Internationalization (English / Hindi)](#-internationalization-english--hindi)
- [Tech Stack](#️-tech-stack)
- [Architecture](#️-architecture)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Resume Upload Flow](#-resume-upload-flow)
- [Dynamic Content Flow](#-dynamic-content-flow)
- [Automated Database Backups](#-automated-database-backups)
- [Rate Limiting](#-rate-limiting)
- [Deployment](#-deployment)
- [Security Considerations](#-security-considerations)
- [Future Improvements](#-future-improvements)
- [Troubleshooting](#-troubleshooting)
- [About Me](#-about-me)
- [License](#-license)

---

## ✨ Features

### 🌐 Public Portfolio

- Hero, About, Skills, Experience, Education, Certifications, Projects, Testimonials, Blog, and Contact sections
- Social links & availability badge
- **Mobile-first responsive layout** — works cleanly on small phones, tablets, and large desktops
- Light/dark themed UI with persisted theme preference
- **English / Hindi language toggle**, persisted across visits
- **Framer Motion page transitions** between routes
- **Cmd/Ctrl + K command palette** for instant navigation
- **Installable PWA** with an offline fallback page
- Modern animations, floating tech badges, and interactive elements
- Embedded **AI chatbot** for instant visitor Q&A
- Full **Markdown-rendered blog** with tags and a dedicated archive
- Dedicated, shareable **project case-study** pages

### 🧑‍💻 Admin Dashboard

Authenticated admins can manage:

- Profile, Hero & About content
- Contact info & social links
- Experience & Education
- Skills
- Projects (with drag-and-drop reordering)
- Certificates (with drag-and-drop reordering)
- Blog posts
- Testimonials
- Resume (upload / replace / delete)
- Profile image (with in-browser crop)
- SEO metadata
- Portfolio visibility & site settings
- Admin PIN & password management
- Visitor analytics dashboard
- Audit log of every admin action

### 📄 Resume Management

Resume handling is integrated with the backend instead of depending on a hard-coded frontend PDF:

```text
Admin Dashboard → PDF Upload → Multer Validation → Cloudinary (RAW storage)
       → MongoDB Resume Metadata → Public Resume Endpoint → View / Download
```

### ☁️ Cloudinary

Used for all uploaded media: resume PDFs, profile images, certificate images, and other supported uploads.

### 🔐 Authentication

Protected admin APIs use **JWT access + refresh token** authentication:

- A short-lived **access token** is attached automatically by the frontend Axios instance:
  ```http
  Authorization: Bearer <accessToken>
  ```
- A long-lived **refresh token** is stored in an httpOnly cookie and silently exchanged for a new access token via `POST /api/auth/refresh-token`, so admins aren't forced to re-login every 15 minutes.
- Dashboard access additionally requires a separate numeric **PIN** (`POST /api/auth/verify-pin`) after password login — a lightweight second factor.

### 🗄️ MongoDB

MongoDB + Mongoose stores all dynamic portfolio content: Hero, About, Contact, Social Links, Resume, Experience, Education, Skills, Projects, Certificates, Blog Posts, Testimonials, SEO, Settings, Analytics Events, and Audit Logs.

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

## 🎬 Page Transitions & Command Palette

### Framer Motion page transitions

Every route transition fades and slightly slides the incoming page into view via `components/ui/PageTransition.jsx`, driven by `<AnimatePresence>` in `App.jsx`. Routes that nest a `position: fixed` element (Home's Navbar, the Admin Dashboard's sidebar) use an **opacity-only** variant instead — a `transform`-based slide would otherwise briefly break fixed positioning on those pages during the animation.

### Command Palette (Cmd/Ctrl + K)

A Linear/Vercel-style quick-navigation overlay (`components/ui/CommandPalette.jsx`):

- **Cmd+K** (Mac) / **Ctrl+K** (Windows/Linux) opens it from anywhere in the app
- Type to fuzzy-filter, **↑ / ↓** to move, **Enter** to select, **Esc** to close
- Jump straight to any section ("Go to Projects", "Contact me", etc.) — works even from a different route, by navigating home with a URL hash and letting `Home.jsx`'s hash-scroll effect finish the job once the (lazy-loaded) section has mounted
- Also toggles theme and language, opens the blog, opens the resume, and jumps to admin login

---

## 📲 PWA Support

The site is a fully installable Progressive Web App:

- `public/manifest.webmanifest` — app name, icons, theme color, and shortcuts to Projects/Contact/Blog
- `public/sw.js` — service worker with **network-first** navigation caching, **stale-while-revalidate** for static assets, and an explicit bypass for `/api`, `/uploads`, and Cloudinary requests (so portfolio content is never served stale)
- `public/offline.html` — a friendly fallback page shown when fully offline, with a live online/offline status indicator
- `src/components/ui/PWAInstallPrompt.jsx` — a non-intrusive install banner that listens for the browser's `beforeinstallprompt` event (Chrome/Edge/Android) and respects a 7-day dismiss cooldown
- `src/utils/registerServiceWorker.js` — registers the service worker in production only (skipped in dev to avoid HMR conflicts)

> iOS Safari doesn't fire `beforeinstallprompt`, so the install banner won't appear there — iOS users install via the native **Share → Add to Home Screen** flow instead, which still works fine thanks to the manifest + apple-touch-icon.

---

## 🌐 Internationalization (English / Hindi)

- `src/context/LanguageContext.jsx` — a React context exposing `t()`, `language`, and `toggleLanguage()`, persisted to `localStorage`
- `src/i18n/translations.js` — the full English/Hindi dictionary (navigation, footer, every section's eyebrow/heading/subtitle, command palette, PWA prompts)
- Toggle available in both the desktop and mobile navbar, and via the Cmd+K command palette

> Static UI chrome (labels, headings, navigation) is translated. Dynamic content authored through the admin dashboard (project descriptions, blog posts, testimonials) is stored and displayed exactly as written by the admin.

---

## 🛠️ Tech Stack

### Frontend
- React 19 + Vite
- Tailwind CSS v4
- React Router DOM
- Framer Motion — page transitions & micro-animations
- Axios
- React Icons + Lucide React
- React Toastify
- React Markdown + remark-gfm — blog rendering
- Recharts — analytics charts
- @dnd-kit (core, sortable, utilities) — drag-and-drop reordering

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken) — access + refresh tokens
- Multer + Multer Storage Cloudinary
- Cloudinary SDK
- bcryptjs
- express-rate-limit — contact form, chatbot, and login throttling
- node-cron + archiver — scheduled MongoDB backups
- Nodemailer — contact-form email notifications
- cookie-parser
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
                    │ Frontend (PWA)      │
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
│   │   │   ├── sections/     # Hero, About, Skills, Projects, Blog, etc.
│   │   │   ├── seo/          # Structured data component
│   │   │   └── ui/           # Chatbot, CommandPalette, PageTransition,
│   │   │                     # PWAInstallPrompt, Loader, backgrounds
│   │   ├── context/          # Auth, Theme & Language context
│   │   ├── i18n/              # translations.js (English/Hindi dictionary)
│   │   ├── pages/             # Home, Blog, Admin routes, NotFound
│   │   ├── utils/              # Axios instance, media URL helpers,
│   │   │                       # analytics, service worker registration
│   │   └── main.jsx
│   │
│   ├── public/                 # manifest, service worker, offline.html, icons
│   ├── .env.example
│   └── package.json
│
├── Backend/
│   ├── config/                # DB connection
│   ├── controllers/           # Route handlers (incl. chatbotController.js)
│   ├── middleware/             # Auth, error handling, rate limiter, upload
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # Express routers
│   ├── scripts/                 # backupDatabase.js
│   ├── utils/                    # generateToken, sendEmail, auditLogger,
│   │                              # cronJobs, mediaUrl
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

### Auth
```text
POST   /api/auth/register
POST   /api/auth/login              → issues access token + httpOnly refresh cookie
POST   /api/auth/refresh-token      → silently exchanges refresh cookie for a new access token
POST   /api/auth/logout             → invalidates the refresh token
POST   /api/auth/verify-pin         (protected) — second-factor dashboard PIN check
GET    /api/auth/me                 (protected)
PUT    /api/auth/change-password    (protected)
```

### Portfolio
```text
GET    /api/portfolio
GET    /api/portfolio/og-image
PUT    /api/portfolio
PUT    /api/portfolio/hero
PUT    /api/portfolio/about
PUT    /api/portfolio/contact
PUT    /api/portfolio/social-links
PUT    /api/portfolio/experience
PUT    /api/portfolio/education
PUT    /api/portfolio/seo
PUT    /api/portfolio/settings
POST   /api/portfolio/profile-image
DELETE /api/portfolio/profile-image
POST   /api/portfolio/reset
DELETE /api/portfolio
```

### Resume & Profile Image Upload
```text
POST   /api/portfolio/upload/resume
POST   /api/portfolio/upload/profile-image
GET    /api/portfolio/upload/resume
GET    /api/portfolio/upload/resume/info
GET    /api/portfolio/upload/public-resume
GET    /api/portfolio/resume/public         (legacy → 308 redirect to the route above)
```

### Projects
```text
GET    /api/projects
GET    /api/projects/featured
GET    /api/projects/admin              (protected)
GET    /api/projects/case-study/:slug
GET    /api/projects/:id
POST   /api/projects                    (protected)
PUT    /api/projects/:id                (protected)
PATCH  /api/projects/reorder            (protected) — drag-and-drop ordering
DELETE /api/projects/:id                (protected)
```

### Certificates
```text
GET    /api/certificates
GET    /api/certificates/featured
GET    /api/certificates/admin          (protected)
GET    /api/certificates/:id
POST   /api/certificates                (protected)
POST   /api/certificates/upload-image   (protected)
PATCH  /api/certificates/reorder        (protected) — drag-and-drop ordering
PUT    /api/certificates/:id            (protected)
DELETE /api/certificates/:id            (protected)
```

### Blog
```text
GET    /api/blog
GET    /api/blog/featured
GET    /api/blog/tags
GET    /api/blog/:slug
GET    /api/blog/admin                  (protected)
GET    /api/blog/admin/:id              (protected)
POST   /api/blog                        (protected, handles cover-image upload)
PUT    /api/blog/:id                    (protected)
DELETE /api/blog/:id                    (protected)
```

### Testimonials
```text
GET    /api/testimonials
GET    /api/testimonials/featured
GET    /api/testimonials/admin          (protected)
GET    /api/testimonials/:id
POST   /api/testimonials                (protected, handles avatar upload)
PUT    /api/testimonials/:id            (protected)
DELETE /api/testimonials/:id            (protected)
```

### Contact
```text
POST   /api/contact
GET    /api/contact                     (protected)
GET    /api/contact/:id                 (protected)
PUT    /api/contact/:id/read            (protected) — mark as read
DELETE /api/contact/:id                 (protected)
```

### Settings
```text
GET    /api/settings                    (protected)
PUT    /api/settings                    (protected)
PUT    /api/settings/reset              (protected)
```

### Analytics
```text
POST   /api/analytics/track             — fire-and-forget visitor event tracking
GET    /api/analytics/summary           (protected)
```

### Audit Logs
```text
GET    /api/audit-logs                  (protected)
DELETE /api/audit-logs/cleanup          (protected) — prune old entries
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
- *(Optional)* An SMTP account (e.g. Gmail with an App Password) for contact-form email notifications
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
# ── Server ─────────────────────────────────────────────
NODE_ENV=development
PORT=5000

# ── Database ───────────────────────────────────────────
MONGO_URI=your_mongodb_connection_string

# ── Auth ───────────────────────────────────────────────
# Generate strong, DIFFERENT random values for each, e.g.:
#   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your_access_token_secret
JWT_EXPIRE=15m
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRE=30d

ADMIN_PIN=your_admin_pin

# ── CORS ───────────────────────────────────────────────
FRONTEND_URL=http://localhost:5173

# ── Cloudinary ─────────────────────────────────────────
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# ── AI Chatbot — free key from https://console.groq.com/keys
GROQ_API_KEY=your_groq_api_key

# ── Email notifications (contact form) ─────────────────
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM=your_email@gmail.com
ADMIN_NOTIFY_EMAIL=your_email@gmail.com

# ── Automated MongoDB backups (optional) ───────────────
ENABLE_AUTO_BACKUP=false
BACKUP_CRON_SCHEDULE=0 2 * * *
BACKUP_RETENTION_COUNT=7
```

### Frontend — `Frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

> ℹ️ `Backend/.env.example` in this repo currently lists `GEMINI_API_KEY` —
> that's a leftover from an earlier provider. The chatbot code actually
> reads **`GROQ_API_KEY`** (see `chatbotController.js`), so use the variable
> name shown above and update `.env.example` to match.

### ⚠️ Security

Never commit real credentials to GitHub. Keep these private:

- MongoDB credentials
- JWT access **and** refresh secrets
- Admin PIN / credentials
- Cloudinary API secret
- Groq API key
- SMTP credentials
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
| Blog Posts | ✅ |
| Testimonials | ✅ |
| SEO | ✅ |
| Settings | ✅ |
| Site Visibility | ✅ |

---

## 💾 Automated Database Backups

`Backend/scripts/backupDatabase.js` exports every MongoDB collection straight
to JSON via Mongoose (no dependency on the `mongodump` binary, which isn't
available on most free hosting tiers) and bundles the result into a single
`.zip` under `Backend/backups/`.

**Manual run:**

```bash
npm run backup
```

**Automated (while the server is running):** controlled by
`Backend/utils/cronJobs.js` via `.env`:

```env
ENABLE_AUTO_BACKUP=true
BACKUP_CRON_SCHEDULE=0 2 * * *    # daily at 2:00 AM, standard cron syntax
BACKUP_RETENTION_COUNT=7          # older backups beyond this count are pruned
```

> ⚠️ On free-tier hosts (Render/Railway) that "spin down" idle instances,
> a scheduled backup can be missed if the server happens to be asleep at
> the scheduled time. For guaranteed daily backups, either keep an
> always-on instance or trigger an external cron (e.g. cron-job.org or a
> scheduled GitHub Action) against a protected endpoint that calls
> `runBackup()`.

---

## 🚦 Rate Limiting

All public (unauthenticated) endpoints are protected by centralized limiters
in `Backend/middleware/rateLimiter.js`:

| Limiter | Endpoint | Limit |
|---|---|---|
| `contactLimiter` | `POST /api/contact` | 5 submissions / 15 minutes / IP |
| `chatbotLimiter` | `POST /api/chatbot` | 15 messages / 10 minutes / IP |
| `authLimiter` | `POST /api/auth/login` | 10 attempts / 15 minutes / IP |

`app.set('trust proxy', 1)` in `server.js` ensures the real visitor IP is
read correctly behind Render/Railway/Vercel's reverse proxy, so the limits
apply per actual visitor rather than per proxy hop.

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
JWT_EXPIRE=15m
JWT_REFRESH_SECRET=your_production_refresh_secret
JWT_REFRESH_EXPIRE=30d

ADMIN_PIN=your_admin_pin

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

GROQ_API_KEY=your_groq_api_key

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM=your_email@gmail.com
ADMIN_NOTIFY_EMAIL=your_email@gmail.com

FRONTEND_URL=https://your-frontend-domain.vercel.app
```

> Never use `localhost` as a production API URL. The backend also
> auto-allows any `*.vercel.app` origin, in addition to the explicit list
> above.

---

## 🔒 Security Considerations

- JWT **access + refresh** token authentication; refresh tokens live in an
  httpOnly cookie and are never exposed to frontend JavaScript
- `JWT_SECRET` and `JWT_REFRESH_SECRET` must be distinct, high-entropy values
- Second-factor **admin PIN** required to reach the dashboard, beyond the
  password login
- Strict, allow-listed CORS configuration
- Environment-based secrets (nothing hard-coded)
- Rate limiting on login, contact form, and chatbot endpoints (see
  [Rate Limiting](#-rate-limiting))
- Every admin mutation (create/update/delete/login) is written to an
  **audit log**, viewable from the dashboard
- Direct PDF access blocked at the static file layer; resumes are only
  served through the controlled public endpoint
- PDF/image upload validation via Multer
- Request body size limits
- Separate frontend/backend deployment
- No production credentials ever committed to the repo

---

## 🚀 Future Improvements

- Automated CI/CD pipeline
- Automated unit/integration tests
- Multi-language support for admin-authored content (blog/projects)
- Project filtering & search
- Two-factor authentication via authenticator app (TOTP)
- Advanced image optimization
- Automated Lighthouse/CI checks on every deploy

---

## 🧯 Troubleshooting

**Chatbot replies with a "not configured" or model error**
Make sure `GROQ_API_KEY` is set in `Backend/.env` and that the model name in `chatbotController.js` matches a model your Groq account currently has access to — Groq periodically retires older model names.

**Chatbot says "sending messages too quickly"**
That's the built-in rate limiter (15 messages / 10 minutes / IP). Wait a few minutes, or adjust the values in `Backend/middleware/rateLimiter.js` if you need a different threshold.

**Chatbot streaming works locally but not in production**
Check that your hosting provider doesn't buffer `text/event-stream` responses. `chatbotController.js` already sends `X-Accel-Buffering: no`, but some platforms need streaming explicitly enabled in their dashboard/config.

**Admin login fails with `Error: secretOrPrivateKey must have a value`**
`JWT_REFRESH_SECRET` (or `JWT_SECRET`) is missing from `Backend/.env`. Add both — see [Environment Variables](#-environment-variables) — and **fully restart** the dev server (`Ctrl+C` then `npm run dev`); `.env` is only read on process start, so nodemon won't auto-pick up edits to it.

**`Failed to resolve import "framer-motion"` in the browser**
The package is listed in `package.json` but hasn't actually been installed yet. Run, inside `Frontend/`:
```bash
npm install framer-motion
```
If the error persists after that, do a clean reinstall:
```bash
rmdir /s /q node_modules   # macOS/Linux: rm -rf node_modules
del package-lock.json      # macOS/Linux: rm package-lock.json
npm install
```

**`npm run dev` fails after pulling new backend changes**
Run `npm install` inside `Backend/` — new features (rate limiting, backups, etc.) add new dependencies over time.

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
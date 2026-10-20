const express = require('express');
const dotenv = require('dotenv');

// ======================================================
// LOAD ENVIRONMENT VARIABLES — MUST BE FIRST
// ======================================================

dotenv.config();

// ======================================================
// CRASH GUARDS
// ======================================================
//
// Node 15+ me koi bhi unhandled promise rejection poora process kill kar
// deta hai — Render par yeh "backend baar-baar band ho jata hai" jaisa
// dikhta hai. Ab error log hoga aur server chalta rehega.
// ======================================================

process.on('unhandledRejection', (reason) => {
  console.error('⚠️  Unhandled promise rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('⚠️  Uncaught exception:', error);
});

const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const connectDB = require('./config/db');

const projectRoutes = require('./routes/projectRoutes');
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const portfolioUploadRoutes = require('./routes/portfolioUploadRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const blogRoutes = require('./routes/blogRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const auditLogRoutes = require('./routes/auditLogRoutes');

const {
  notFound,
  errorHandler,
} = require('./middleware/errorMiddleware');

const { initCronJobs } = require('./utils/cronJobs');

// ======================================================
// CONNECT TO MONGODB
// ======================================================

// Zaroori env variables missing ho to startup par hi saaf warning
['MONGO_URI', 'JWT_SECRET', 'JWT_REFRESH_SECRET'].forEach((key) => {
  if (!process.env[key]) {
    console.error(`❌ Missing env variable: ${key}`);
  }
});

['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET', 'GROQ_API_KEY', 'ADMIN_PIN'].forEach((key) => {
  if (!process.env[key]) {
    console.warn(`⚠️  Optional env variable not set: ${key}`);
  }
});

connectDB();

// ======================================================
// EXPRESS APP
// ======================================================

const app = express();

// ======================================================
// TRUST PROXY
// ======================================================
//
// Render / Railway / Vercel jaise hosts ke peeche app ek reverse
// proxy ke pichhe chalti hai. Isko trust kiye bina, express-rate-limit
// (contact + chatbot routes par) har request ko proxy ki IP se aata hua samjhega,
// jisse sab visitors ek hi rate-limit bucket share karenge.
//
// `1` matlab: sirf pehle proxy hop ko trust karo (X-Forwarded-For ka
// sabse right-most entry) — safe default jab app ek single trusted
// proxy (host provider) ke peeche hai.
// ======================================================

app.set('trust proxy', 1);

// ======================================================
// CORS CONFIGURATION
// ======================================================

const allowedOrigins = [
  // ----------------------------------------------------
  // LOCAL DEVELOPMENT
  // ----------------------------------------------------

  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',

  // ----------------------------------------------------
  // PRODUCTION — VERCEL (hardcoded known URLs)
  // ----------------------------------------------------

  'https://my-portfolio-mern-mauve.vercel.app',
  'https://portfolio-vivek-blue.vercel.app',
].filter(Boolean);

// ------------------------------------------------------
// ADD FRONTEND_URL FROM RENDER ENVIRONMENT
// ------------------------------------------------------

if (process.env.FRONTEND_URL) {
  const frontendUrl = process.env.FRONTEND_URL
    .trim()
    .replace(/\/$/, '');

  if (!allowedOrigins.includes(frontendUrl)) {
    allowedOrigins.push(frontendUrl);
  }
}

// ------------------------------------------------------
// CORS MIDDLEWARE
// ------------------------------------------------------
//
// `credentials: true` yahan already tha, aur ab refresh-token cookie
// ke liye bhi zaroori hai — cross-site cookie sirf tabhi bhejta/padhta
// hai browser jab dono taraf (server CORS + frontend fetch/axios call)
// credentials enabled hon.
// ------------------------------------------------------

app.use(
  cors({
    origin: (origin, callback) => {
      // ------------------------------------------------
      // Requests without Origin
      // Useful for Postman / health checks
      // ------------------------------------------------

      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = origin
        .trim()
        .replace(/\/$/, '');

      // ------------------------------------------------
      // ALLOW KNOWN ORIGINS
      // ------------------------------------------------

      if (
        allowedOrigins.includes(normalizedOrigin)
      ) {
        return callback(null, true);
      }

      // ------------------------------------------------
      // ALLOW ALL VERCEL PREVIEW + PRODUCTION DEPLOYMENTS
      // ------------------------------------------------

      // SECURITY: pehle koi bhi *.vercel.app (kisi ki bhi site) credentials ke
      // saath API access kar sakti thi. Ab sirf tab jab Render env me
      // ALLOW_VERCEL_PREVIEWS=true set ho (preview deployments test karne ke liye).
      if (
        process.env.ALLOW_VERCEL_PREVIEWS === 'true' &&
        /^https:\/\/[a-z0-9-]+(\.vercel\.app)$/.test(normalizedOrigin)
      ) {
        return callback(null, true);
      }

      // ------------------------------------------------
      // REJECT UNKNOWN ORIGINS
      // ------------------------------------------------

      console.log(
        '❌ CORS blocked origin:',
        normalizedOrigin
      );

      console.log(
        '✅ Allowed origins:',
        allowedOrigins
      );

      return callback(
        new Error(
          'CORS policy: Origin not allowed.'
        )
      );
    },

    credentials: true,

    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS',
    ],

    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
    ],
  })
);

// ======================================================
// RESPONSE COMPRESSION (JSON 70-80% chhota => site tez)
// `npm install compression` karna hai. Na ho to bhi server chalega.
// ======================================================

try {
  const compression = require('compression');
  app.use(compression());
} catch (err) {
  console.warn('compression package not installed - run: npm install compression');
}

// ======================================================
// JSON BODY PARSER
// ======================================================

app.use(
  express.json({
    limit: '10mb',
  })
);

// ======================================================
// URL ENCODED BODY PARSER
// ======================================================

app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb',
  })
);

// ======================================================
// COOKIE PARSER
// ======================================================
//
// Refresh token httpOnly cookie ke through aata hai
// (`/api/auth/refresh-token`, `/api/auth/logout`) — `req.cookies`
// tabhi populate hota hai jab yeh middleware laga ho.
// ======================================================

app.use(cookieParser());

// ======================================================
// STATIC UPLOADS
// ======================================================

const uploadsDirectory = path.join(
  __dirname,
  'uploads'
);

// ------------------------------------------------------
// PUBLIC UPLOAD MIDDLEWARE
// ------------------------------------------------------

app.use(
  '/uploads',
  (req, res, next) => {
    const requestedFile = path.basename(
      req.path
    );

    const isPdf = requestedFile
      .toLowerCase()
      .endsWith('.pdf');

    // --------------------------------------------------
    // BLOCK DIRECT PDF ACCESS
    // --------------------------------------------------

    if (isPdf) {
      return res.status(403).json({
        success: false,
        message:
          'Direct access to resume files is not allowed.',
      });
    }

    next();
  },

  express.static(
    uploadsDirectory
  )
);

// ======================================================
// HEALTH CHECK
// ======================================================

const healthHandler = (req, res) => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const dbState = states[mongoose.connection.readyState] || 'unknown';

  res.status(200).json({
    success: true,
    message:
      '🚀 Portfolio API is running...',
    environment:
      process.env.NODE_ENV ||
      'development',
    database: dbState,
  });
};

app.get('/', healthHandler);
app.get('/api/health', healthHandler);

// ======================================================
// PROJECT ROUTES
// ======================================================

app.use(
  '/api/projects',
  projectRoutes
);

// ======================================================
// CONTACT ROUTES
// ======================================================

app.use(
  '/api/contact',
  contactRoutes
);

// ======================================================
// AUTH ROUTES
// ======================================================

app.use(
  '/api/auth',
  authRoutes
);

// ======================================================
// PORTFOLIO CONTENT ROUTES
// ======================================================

app.use(
  '/api/portfolio',
  portfolioRoutes
);

// ======================================================
// PORTFOLIO UPLOAD ROUTES
// ======================================================

app.use(
  '/api/portfolio/upload',
  portfolioUploadRoutes
);

// ======================================================
// LEGACY RESUME PATH — SAFETY NET
// ======================================================

app.get(
  '/api/portfolio/resume/public',
  (req, res) => {
    return res.redirect(
      308,
      '/api/portfolio/upload/public-resume'
    );
  }
);

// ======================================================
// CERTIFICATE ROUTES
// ======================================================

app.use(
  '/api/certificates',
  certificateRoutes
);

// ======================================================
// SETTINGS ROUTES
// ======================================================

app.use(
  '/api/settings',
  settingsRoutes
);

// ======================================================
// AI CHATBOT ROUTES
// ======================================================

app.use(
  '/api/chatbot',
  chatbotRoutes
);

// ======================================================
// ANALYTICS & VISITOR INSIGHTS ROUTES
// ======================================================

app.use(
  '/api/analytics',
  analyticsRoutes
);

// ======================================================
// BLOG ROUTES
// ======================================================

app.use(
  '/api/blog',
  blogRoutes
);

// ======================================================
// TESTIMONIAL ROUTES
// ======================================================

app.use(
  '/api/testimonials',
  testimonialRoutes
);

// ======================================================
// AUDIT LOG ROUTES
// ======================================================

app.use(
  '/api/audit-logs',
  auditLogRoutes
);

// ======================================================
// 404 NOT FOUND
// ======================================================

app.use(
  notFound
);

// ======================================================
// GLOBAL ERROR HANDLER
// ======================================================

app.use(
  errorHandler
);

// ======================================================
// SERVER
// ======================================================

const PORT =
  process.env.PORT || 5000;

// ======================================================
// START SERVER
// ======================================================

const server = app.listen(
  PORT,
  () => {
    console.log(
      `✅ Server running on port ${PORT}`
    );

    console.log(
      `🌍 Environment: ${
        process.env.NODE_ENV ||
        'development'
      }`
    );

    console.log(
      '🌐 Allowed CORS origins:'
    );

    allowedOrigins.forEach(
      (origin) => {
        console.log(
          `   ✅ ${origin}`
        );
      }
    );

    if (
      process.env.FRONTEND_URL
    ) {
      console.log(
        `🔗 Frontend URL: ${process.env.FRONTEND_URL}`
      );
    }

    // ==================================================
    // START CRON JOBS (automated DB backup, if enabled)
    // ==================================================

    initCronJobs();

    // ==================================================
    // RENDER KEEP-ALIVE (free tier cold-start se bachne ke liye)
    // ==================================================
    //
    // Render free tier 15 min inactivity ke baad service so jaati hai aur
    // agli request ~30-60 sec leti hai — frontend ko "backend kaam nahi
    // kar raha" jaisa lagta hai. Server jab tak jaag raha hai, apne hi
    // public /api/health ko har 10 min me ping karta hai taaki sota nahi.
    //
    // Band karna ho to env me KEEP_ALIVE=false. (Zyada reliable: UptimeRobot
    // se bhi is URL ko 5 min me ping karwa do.)
    // ==================================================

    const keepAliveUrl = (
      process.env.RENDER_EXTERNAL_URL || ''
    ).replace(/\/$/, '');

    if (keepAliveUrl && process.env.KEEP_ALIVE !== 'false') {
      const KEEP_ALIVE_MS = 10 * 60 * 1000;

      setInterval(() => {
        fetch(`${keepAliveUrl}/api/health`).catch((error) => {
          console.warn('Keep-alive ping failed:', error.message);
        });
      }, KEEP_ALIVE_MS).unref();

      console.log(`💓 Keep-alive ping enabled -> ${keepAliveUrl}/api/health`);
    }
  }
);

// Port pehle se use me ho (e.g. purana node process chal raha hai) to
// saaf message do, silent crash nahi.
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(
      `❌ Port ${PORT} already in use. Purana server band karo ya .env me PORT badlo.`
    );
  } else {
    console.error('❌ Server error:', error);
  }

  process.exit(1);
});

// Render redeploy / restart par graceful shutdown (in-flight requests complete)
const shutdown = (signal) => {
  console.log(`🛑 ${signal} received, shutting down gracefully...`);

  server.close(() => {
    mongoose.connection.close(false).finally(() => process.exit(0));
  });

  setTimeout(() => process.exit(1), 10000).unref();
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
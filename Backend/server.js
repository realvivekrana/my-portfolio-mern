const express = require('express');
const dotenv = require('dotenv');

// ======================================================
// LOAD ENVIRONMENT VARIABLES — MUST BE FIRST
// ======================================================

dotenv.config();

const cors = require('cors');
const path = require('path');

const connectDB = require('./config/db');

const projectRoutes = require('./routes/projectRoutes');
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const portfolioUploadRoutes = require('./routes/portfolioUploadRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');

const {
  notFound,
  errorHandler,
} = require('./middleware/errorMiddleware');

// ======================================================
// CONNECT TO MONGODB
// ======================================================

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
// (chatbot route par) har request ko proxy ki IP se aata hua samjhega,
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

      if (
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

app.get(
  '/',
  (req, res) => {
    res.status(200).json({
      success: true,
      message:
        '🚀 Portfolio API is running...',
      environment:
        process.env.NODE_ENV ||
        'development',
    });
  }
);

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

app.listen(
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
  }
);
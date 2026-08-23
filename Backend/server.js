const express = require('express');
const dotenv = require('dotenv');

/*
|--------------------------------------------------------------------------
| Load Environment Variables — MUST BE FIRST
|--------------------------------------------------------------------------
|
| ✅ FIX (critical): This used to run AFTER the require() calls below.
| Node executes require() synchronously as soon as it's called, so
| config/cloudinary.js (pulled in indirectly via portfolioUploadRoutes)
| was reading process.env.CLOUDINARY_CLOUD_NAME etc. BEFORE dotenv had
| ever loaded the .env file — meaning those values were always
| `undefined`, no matter what was actually in .env.
|
| That is why resume upload/view/download failed with:
| "Must supply cloud_name in tag or in configuration"
|
| dotenv.config() must run before ANY other local module is required,
| so every downstream file sees the real environment variables.
|
|--------------------------------------------------------------------------
*/

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

const {
  notFound,
  errorHandler,
} = require('./middleware/errorMiddleware');

/*
|--------------------------------------------------------------------------
| Connect To MongoDB
|--------------------------------------------------------------------------
*/

connectDB();

/*
|--------------------------------------------------------------------------
| Express App
|--------------------------------------------------------------------------
*/

const app = express();

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
|
| Development:
|
|   http://localhost:5173
|   http://localhost:5174
|
| Production:
|
|   FRONTEND_URL from .env
|
| Example:
|
|   FRONTEND_URL=https://your-portfolio.vercel.app
|
|--------------------------------------------------------------------------
*/

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
].filter(Boolean);

/*
|--------------------------------------------------------------------------
| Add Production Frontend URL
|--------------------------------------------------------------------------
*/

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(
    process.env.FRONTEND_URL.replace(
      /\/$/,
      ''
    )
  );
}

/*
|--------------------------------------------------------------------------
| CORS Configuration
|--------------------------------------------------------------------------
*/

app.use(
  cors({
    origin: (origin, callback) => {
      /*
      |--------------------------------------------------------------------------
      | Allow requests without an Origin
      |--------------------------------------------------------------------------
      |
      | Useful for:
      | - Postman
      | - Server-to-server requests
      | - Health checks
      |--------------------------------------------------------------------------
      */

      if (!origin) {
        return callback(
          null,
          true
        );
      }

      const normalizedOrigin =
        origin.replace(
          /\/$/,
          ''
        );

      /*
      |--------------------------------------------------------------------------
      | Allow Known Origins
      |--------------------------------------------------------------------------
      */

      if (
        allowedOrigins.includes(
          normalizedOrigin
        )
      ) {
        return callback(
          null,
          true
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Reject Unknown Origins
      |--------------------------------------------------------------------------
      */

      return callback(
        new Error(
          'CORS policy: Origin not allowed.'
        )
      );
    },

    credentials: true,
  })
);

/*
|--------------------------------------------------------------------------
| JSON Body Parser
|--------------------------------------------------------------------------
*/

app.use(
  express.json({
    limit: '10mb',
  })
);

/*
|--------------------------------------------------------------------------
| URL Encoded Body Parser
|--------------------------------------------------------------------------
*/

app.use(
  express.urlencoded({
    extended: true,
    limit: '10mb',
  })
);

/*
|--------------------------------------------------------------------------
| STATIC UPLOADS
|--------------------------------------------------------------------------
|
| IMPORTANT:
|
| Resume PDFs must NOT be directly publicly accessible.
|
| Public uploaded assets:
|
|   - Profile images
|   - Certificate images
|   - Other non-PDF uploads
|
| Protected:
|
|   - Resume PDF
|
| Resume is served through:
|
|   GET /api/portfolio/upload/resume
|
| according to the authentication/public-resume logic.
|
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Upload Directory
|--------------------------------------------------------------------------
*/

const uploadsDirectory =
  path.join(
    __dirname,
    'uploads'
  );

/*
|--------------------------------------------------------------------------
| Public Upload Middleware
|--------------------------------------------------------------------------
*/

app.use(
  '/uploads',
  (req, res, next) => {
    /*
    |--------------------------------------------------------------------------
    | Get Requested Filename
    |--------------------------------------------------------------------------
    */

    const requestedFile =
      path.basename(
        req.path
      );

    /*
    |--------------------------------------------------------------------------
    | Detect PDF
    |--------------------------------------------------------------------------
    */

    const isPdf =
      requestedFile
        .toLowerCase()
        .endsWith('.pdf');

    /*
    |--------------------------------------------------------------------------
    | Block Direct PDF Access
    |--------------------------------------------------------------------------
    */

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

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| PROJECT ROUTES
|--------------------------------------------------------------------------
*/

app.use(
  '/api/projects',
  projectRoutes
);

/*
|--------------------------------------------------------------------------
| CONTACT ROUTES
|--------------------------------------------------------------------------
*/

app.use(
  '/api/contact',
  contactRoutes
);

/*
|--------------------------------------------------------------------------
| AUTH ROUTES
|--------------------------------------------------------------------------
*/

app.use(
  '/api/auth',
  authRoutes
);

/*
|--------------------------------------------------------------------------
| PORTFOLIO CONTENT ROUTES
|--------------------------------------------------------------------------
*/

app.use(
  '/api/portfolio',
  portfolioRoutes
);

/*
|--------------------------------------------------------------------------
| PORTFOLIO UPLOAD ROUTES
|--------------------------------------------------------------------------
*/

app.use(
  '/api/portfolio/upload',
  portfolioUploadRoutes
);

/*
|--------------------------------------------------------------------------
| LEGACY RESUME PATH — SAFETY NET (DO NOT REMOVE)
|--------------------------------------------------------------------------
|
| An earlier version of this codebase stored the resume URL as
| /api/portfolio/resume/public, which never matched an actual
| route (the real one is /api/portfolio/upload/public-resume).
|
| That wrong string can still be sitting around in old browser
| caches, old MongoDB documents, or an old frontend build that
| hasn't been redeployed yet.
|
| Instead of 404ing on that path forever, we permanently redirect
| it to the correct endpoint, so resume view/download self-heals
| no matter where the stale reference is coming from.
|
|--------------------------------------------------------------------------
*/

app.get(
  '/api/portfolio/resume/public',
  (req, res) => {
    return res.redirect(
      308,
      '/api/portfolio/upload/public-resume'
    );
  }
);

/*
|--------------------------------------------------------------------------
| CERTIFICATE ROUTES
|--------------------------------------------------------------------------
*/

app.use(
  '/api/certificates',
  certificateRoutes
);

/*
|--------------------------------------------------------------------------
| SETTINGS ROUTES
|--------------------------------------------------------------------------
*/

app.use(
  '/api/settings',
  settingsRoutes
);

/*
|--------------------------------------------------------------------------
| 404 NOT FOUND
|--------------------------------------------------------------------------
|
| Must remain AFTER all API routes.
|--------------------------------------------------------------------------
*/

app.use(
  notFound
);

/*
|--------------------------------------------------------------------------
| GLOBAL ERROR HANDLER
|--------------------------------------------------------------------------
*/

app.use(
  errorHandler
);

/*
|--------------------------------------------------------------------------
| SERVER
|--------------------------------------------------------------------------
*/

const PORT =
  process.env.PORT || 5000;

/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
*/

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

    if (
      process.env.FRONTEND_URL
    ) {
      console.log(
        `🔗 Frontend URL: ${process.env.FRONTEND_URL}`
      );
    }
  }
);
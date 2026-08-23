/*
|--------------------------------------------------------------------------
| LOAD ENVIRONMENT VARIABLES FIRST
|--------------------------------------------------------------------------
|
| IMPORTANT:
| dotenv.config() ko sabhi routes/controllers import karne se
| pehle run karna zaroori hai.
|
| Cloudinary configuration process.env se values read karti hai.
|
|--------------------------------------------------------------------------
*/

const dotenv = require('dotenv');

dotenv.config();

/*
|--------------------------------------------------------------------------
| CORE IMPORTS
|--------------------------------------------------------------------------
*/

const express = require('express');
const cors = require('cors');
const path = require('path');

/*
|--------------------------------------------------------------------------
| DATABASE
|--------------------------------------------------------------------------
*/

const connectDB = require('./config/db');

/*
|--------------------------------------------------------------------------
| ROUTES
|--------------------------------------------------------------------------
*/

const projectRoutes = require('./routes/projectRoutes');
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const portfolioUploadRoutes = require('./routes/portfolioUploadRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

/*
|--------------------------------------------------------------------------
| ERROR MIDDLEWARE
|--------------------------------------------------------------------------
*/

const {
  notFound,
  errorHandler,
} = require('./middleware/errorMiddleware');

/*
|--------------------------------------------------------------------------
| CONNECT TO MONGODB
|--------------------------------------------------------------------------
*/

connectDB();

/*
|--------------------------------------------------------------------------
| EXPRESS APP
|--------------------------------------------------------------------------
*/

const app = express();

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
|
| Development:
|   http://localhost:5173
|   http://localhost:5174
|
| Production:
|   FRONTEND_URL from .env
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
| ADD PRODUCTION FRONTEND URL
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
| CORS CONFIGURATION
|--------------------------------------------------------------------------
*/

app.use(
  cors({
    origin: (origin, callback) => {
      /*
      |--------------------------------------------------------------------------
      | Allow Requests Without Origin
      |--------------------------------------------------------------------------
      |
      | Useful for:
      | - Postman
      | - Server-to-server requests
      | - Health checks
      |
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
| JSON BODY PARSER
|--------------------------------------------------------------------------
*/

app.use(
  express.json({
    limit: '10mb',
  })
);

/*
|--------------------------------------------------------------------------
| URL ENCODED BODY PARSER
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
|   - Profile images
|   - Certificate images
|   - Other non-PDF uploads
|
| Resume:
|   - Protected through API routes
|   - Cloudinary is used for the actual resume storage
|
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| UPLOAD DIRECTORY
|--------------------------------------------------------------------------
*/

const uploadsDirectory =
  path.join(
    __dirname,
    'uploads'
  );

/*
|--------------------------------------------------------------------------
| PUBLIC UPLOAD MIDDLEWARE
|--------------------------------------------------------------------------
*/

app.use(
  '/uploads',
  (req, res, next) => {
    /*
    |--------------------------------------------------------------------------
    | GET REQUESTED FILENAME
    |--------------------------------------------------------------------------
    */

    const requestedFile =
      path.basename(
        req.path
      );

    /*
    |--------------------------------------------------------------------------
    | DETECT PDF
    |--------------------------------------------------------------------------
    */

    const isPdf =
      requestedFile
        .toLowerCase()
        .endsWith('.pdf');

    /*
    |--------------------------------------------------------------------------
    | BLOCK DIRECT PDF ACCESS
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
| HEALTH CHECK
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
|
| Includes:
|   GET  /api/portfolio
|   GET  /api/portfolio/resume/public
|   PUT  /api/portfolio
|   PUT  /api/portfolio/experience
|   PUT  /api/portfolio/education
|   etc.
|
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
|
| Includes:
|   POST /api/portfolio/upload/resume
|   GET  /api/portfolio/upload/resume
|   GET  /api/portfolio/upload/resume/info
|   GET  /api/portfolio/upload/public-resume
|   POST /api/portfolio/upload/profile-image
|
|--------------------------------------------------------------------------
*/

app.use(
  '/api/portfolio/upload',
  portfolioUploadRoutes
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
|
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
| START SERVER
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

    /*
    |--------------------------------------------------------------------------
    | Cloudinary Configuration Check
    |--------------------------------------------------------------------------
    |
    | Secret ko console mein kabhi print nahi karna.
    |
    |--------------------------------------------------------------------------
    */

    console.log(
      `☁️ Cloudinary Cloud Name: ${
        process.env.CLOUDINARY_CLOUD_NAME
          ? 'Loaded'
          : 'MISSING'
      }`
    );

    console.log(
      `☁️ Cloudinary API Key: ${
        process.env.CLOUDINARY_API_KEY
          ? 'Loaded'
          : 'MISSING'
      }`
    );

    console.log(
      `☁️ Cloudinary API Secret: ${
        process.env.CLOUDINARY_API_SECRET
          ? 'Loaded'
          : 'MISSING'
      }`
    );
  }
);
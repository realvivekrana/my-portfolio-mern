const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

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
| Load Environment Variables
|--------------------------------------------------------------------------
*/

dotenv.config();

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
| Global Middleware
|--------------------------------------------------------------------------
*/

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

/*
|--------------------------------------------------------------------------
| STATIC UPLOADS
|--------------------------------------------------------------------------
|
| IMPORTANT:
|
| Resume files must NOT be publicly accessible.
|
| Public:
|
|   Profile images
|   Certificate images
|   Other public uploaded assets
|
| Protected:
|
|   Resume PDF
|
| Resume will be served through:
|
| GET /api/portfolio/upload/resume
|
| which is protected by JWT authentication.
|
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Public Uploads
|--------------------------------------------------------------------------
*/

const uploadsDirectory = path.join(
  __dirname,
  'uploads'
);

app.use(
  '/uploads',
  (req, res, next) => {
    /*
    |--------------------------------------------------------------------------
    | Block Direct Resume Access
    |--------------------------------------------------------------------------
    |
    | Example blocked URL:
    |
    | /uploads/resume-example-123456.pdf
    |
    |--------------------------------------------------------------------------
    */

    const requestedFile =
      path.basename(req.path);

    const isResume =
      requestedFile
        .toLowerCase()
        .endsWith('.pdf');

    if (isResume) {
      return res.status(403).json({
        success: false,
        message:
          'Direct access to resume files is not allowed.',
      });
    }

    next();
  },
  express.static(uploadsDirectory)
);

/*
|--------------------------------------------------------------------------
| Test / Health Route
|--------------------------------------------------------------------------
*/

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 Portfolio API is running...',
  });
});

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
|
| Contact form:
|
| POST /api/contact
|
| Admin:
|
| GET    /api/contact
| GET    /api/contact/:id
| PUT    /api/contact/:id/read
| DELETE /api/contact/:id
|
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
|
| POST /api/auth/register
| POST /api/auth/login
| POST /api/auth/verify-pin
| GET  /api/auth/me
| PUT  /api/auth/change-password
|
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
| GET  /api/portfolio
| PUT  /api/portfolio
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
| GET  /api/portfolio/upload/resume
| GET  /api/portfolio/upload/resume/info
|
| POST /api/portfolio/upload/resume
| POST /api/portfolio/upload/profile-image
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
|
| GET    /api/certificates
| GET    /api/certificates/featured
| GET    /api/certificates/admin
| GET    /api/certificates/:id
|
| POST   /api/certificates
| PUT    /api/certificates/:id
| DELETE /api/certificates/:id
|
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
|
| All settings routes are protected by the authentication
| middleware inside settingsRoutes.js.
|
| GET    /api/settings
| PUT    /api/settings
| PUT    /api/settings/reset
|
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
| IMPORTANT:
| This middleware must stay AFTER all API routes.
|
|--------------------------------------------------------------------------
*/

app.use(notFound);

/*
|--------------------------------------------------------------------------
| GLOBAL ERROR HANDLER
|--------------------------------------------------------------------------
*/

app.use(errorHandler);

/*
|--------------------------------------------------------------------------
| SERVER
|--------------------------------------------------------------------------
*/

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `✅ Server running on port ${PORT}`
  );
});
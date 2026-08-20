const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const connectDB = require('./config/db');

const projectRoutes = require('./routes/projectRoutes');
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const portfolioUploadRoutes = require('./routes/portfolioUploadRoutes');
const certificateRoutes = require('./routes/certificateRoutes');

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
| Static Uploads
|--------------------------------------------------------------------------
|
| Uploaded files:
|
| /uploads/resume-xxxx.pdf
| /uploads/profile-image-xxxx.png
| /uploads/certificate-xxxx.png
|
| Public URL example:
|
| http://localhost:5000/uploads/file-name.pdf
|
|--------------------------------------------------------------------------
*/

app.use(
  '/uploads',
  express.static('uploads')
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
| POST /api/portfolio/upload/resume
|
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
| 404 NOT FOUND
|--------------------------------------------------------------------------
|
| IMPORTANT:
| This must stay after all API routes.
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
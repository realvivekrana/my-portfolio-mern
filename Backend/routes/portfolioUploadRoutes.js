const express = require('express');

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Controllers
|--------------------------------------------------------------------------
*/

const {
  uploadResume,
  getPublicResume,
  getProtectedResume,
  getResumeInfo,
  uploadProfileImage,
} = require('../controllers/portfolioUploadController');

/*
|--------------------------------------------------------------------------
| Upload Middleware
|--------------------------------------------------------------------------
*/

const {
  uploadResume: resumeUpload,
  uploadProfileImage: profileImageUpload,
} = require('../middleware/uploadMiddleware');

/*
|--------------------------------------------------------------------------
| Authentication Middleware
|--------------------------------------------------------------------------
*/

const {
  protect,
} = require('../middleware/authMiddleware');

/*
|--------------------------------------------------------------------------
| PUBLIC RESUME
|--------------------------------------------------------------------------
|
| GET /api/portfolio/upload/public-resume
|
| Public portfolio:
|   → Resume available
|
| Private portfolio:
|   → Resume blocked
|
| Authentication is intentionally NOT required here.
|
|--------------------------------------------------------------------------
*/

router.get(
  '/public-resume',
  getPublicResume
);

/*
|--------------------------------------------------------------------------
| PROTECTED ADMIN RESUME
|--------------------------------------------------------------------------
|
| GET /api/portfolio/upload/resume
|
| Only authenticated admin can access this endpoint.
|
|--------------------------------------------------------------------------
*/

router.get(
  '/resume',
  protect,
  getProtectedResume
);

/*
|--------------------------------------------------------------------------
| RESUME INFORMATION
|--------------------------------------------------------------------------
|
| GET /api/portfolio/upload/resume/info
|
| Only authenticated admin can access resume metadata.
|
|--------------------------------------------------------------------------
*/

router.get(
  '/resume/info',
  protect,
  getResumeInfo
);

/*
|--------------------------------------------------------------------------
| UPLOAD RESUME
|--------------------------------------------------------------------------
|
| POST /api/portfolio/upload/resume
|
| Protected admin endpoint.
|
| Cloudinary:
|   PDF → RAW resource
|
|--------------------------------------------------------------------------
*/

router.post(
  '/resume',
  protect,
  resumeUpload.single('resume'),
  uploadResume
);

/*
|--------------------------------------------------------------------------
| UPLOAD PROFILE IMAGE
|--------------------------------------------------------------------------
|
| POST /api/portfolio/upload/profile-image
|
| Protected admin endpoint.
|
| Cloudinary:
|   JPG / JPEG / PNG / WEBP → IMAGE resource
|
|--------------------------------------------------------------------------
*/

router.post(
  '/profile-image',
  protect,
  profileImageUpload.single(
    'profileImage'
  ),
  uploadProfileImage
);

/*
|--------------------------------------------------------------------------
| EXPORT ROUTER
|--------------------------------------------------------------------------
*/

module.exports = router;
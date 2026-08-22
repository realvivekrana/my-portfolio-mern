const express = require('express');

const router = express.Router();

const {
  uploadResume,
  getPublicResume,
  getProtectedResume,
  getResumeInfo,
  uploadProfileImage,
} = require('../controllers/portfolioUploadController');

const {
  uploadResume: resumeUpload,
  uploadProfileImage: profileImageUpload,
} = require('../middleware/uploadMiddleware');

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
*/

router.post(
  '/profile-image',
  protect,
  profileImageUpload.single('profileImage'),
  uploadProfileImage
);

module.exports = router;
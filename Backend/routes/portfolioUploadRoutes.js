const express = require('express');

const router = express.Router();

const {
  uploadResume,
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
| Upload Resume
|--------------------------------------------------------------------------
|
| POST /api/portfolio/upload/resume
|
| Flow:
|
| Admin
|   ↓
| JWT Authentication
|   ↓
| Multer PDF Upload
|   ↓
| Resume Controller
|   ↓
| MongoDB
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
| Upload Profile Image
|--------------------------------------------------------------------------
|
| POST /api/portfolio/upload/profile-image
|
| Flow:
|
| Admin
|   ↓
| JWT Authentication
|   ↓
| Multer Image Upload
|   ↓
| Profile Image Controller
|   ↓
| MongoDB
|
|--------------------------------------------------------------------------
*/

router.post(
  '/profile-image',
  protect,
  profileImageUpload.single('profileImage'),
  uploadProfileImage
);

module.exports = router;
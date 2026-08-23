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
| Public portfolio ka resume yahan se open hoga.
|
| Authentication required nahi hai.
|
|--------------------------------------------------------------------------
*/

router.get(
  '/public-resume',
  getPublicResume
);

/*
|--------------------------------------------------------------------------
| PUBLIC RESUME - BACKWARD COMPATIBILITY
|--------------------------------------------------------------------------
|
| GET /api/portfolio/upload/resume/public
|
| Purane database / frontend versions mein agar ye URL save hai,
| to resume phir bhi properly open ho jayega.
|
| Authentication required nahi hai.
|
|--------------------------------------------------------------------------
*/

router.get(
  '/resume/public',
  getPublicResume
);

/*
|--------------------------------------------------------------------------
| PUBLIC RESUME - OLD ROUTE COMPATIBILITY
|--------------------------------------------------------------------------
|
| GET /api/portfolio/resume/public
|
| Kuch purane records mein ye URL save ho sakta hai.
|
| Is route ko direct portfolio upload router mein nahi rakha ja sakta,
| kyunki router /api/portfolio/upload ke andar mounted hai.
|
| Isliye actual old route server.js/portfolioRoutes.js level par
| separately handle karna recommended hai.
|
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| PROTECTED ADMIN RESUME
|--------------------------------------------------------------------------
|
| GET /api/portfolio/upload/resume
|
| Sirf authenticated admin resume access kar sakta hai.
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
| Admin dashboard current resume ki information fetch karega.
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
| Admin dashboard se PDF resume upload hoga.
|
| Field name:
|   resume
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
| Admin dashboard se profile image upload hogi.
|
| Field name:
|   profileImage
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
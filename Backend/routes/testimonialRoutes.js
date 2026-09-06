const express = require('express');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

const {
  getAllTestimonials,
  getFeaturedTestimonials,
  getAdminTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  uploadTestimonialAvatar,
} = require('../controllers/testimonialController');

const {
  uploadTestimonialAvatar: testimonialAvatarUpload,
} = require('../middleware/uploadMiddleware');

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/

router.get('/', getAllTestimonials);
router.get('/featured', getFeaturedTestimonials);

/*
|--------------------------------------------------------------------------
| ADMIN ROUTES
|--------------------------------------------------------------------------
*/

router.get('/admin', protect, getAdminTestimonials);

/*
|--------------------------------------------------------------------------
| AVATAR UPLOAD — must come before /:id
|--------------------------------------------------------------------------
*/

router.post(
  '/upload-image',
  protect,
  testimonialAvatarUpload.single('testimonialImage'),
  uploadTestimonialAvatar
);

/*
|--------------------------------------------------------------------------
| SINGLE / CREATE / UPDATE / DELETE
|--------------------------------------------------------------------------
*/

router.get('/:id', getTestimonialById);
router.post('/', protect, createTestimonial);
router.put('/:id', protect, updateTestimonial);
router.delete('/:id', protect, deleteTestimonial);

module.exports = router;
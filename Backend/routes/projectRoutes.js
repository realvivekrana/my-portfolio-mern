const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { uploadProjectScreenshots } = require('../middleware/uploadMiddleware');
const {
  getAllProjects,
  getFeaturedProjects,
  getProjectBySlug,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');

// @route   GET /api/projects (Public)
router.get('/', getAllProjects);

// @route   GET /api/projects/featured (Public)
router.get('/featured', getFeaturedProjects);

// @route   GET /api/projects/case-study/:slug (Public)
// IMPORTANT: must come before /:id so Express doesn't treat
// "case-study" as a project ID.
router.get('/case-study/:slug', getProjectBySlug);

// @route   POST /api/projects/upload-screenshots (Protected)
// Returns Cloudinary URLs for up to 8 screenshots at once.
router.post(
  '/upload-screenshots',
  protect,
  uploadProjectScreenshots.array('screenshots', 8),
  (req, res) => {
    try {
      const files = req.files || [];

      if (!files.length) {
        return res.status(400).json({
          success: false,
          message: 'Please select at least one screenshot.',
        });
      }

      const urls = files.map((file) => file.path || file.secure_url).filter(Boolean);

      return res.status(200).json({
        success: true,
        message: 'Screenshots uploaded successfully',
        data: { screenshots: urls },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// @route   GET /api/projects/:id (Public)
router.get('/:id', getProjectById);

// @route   POST /api/projects (Protected)
router.post('/', protect, createProject);

// @route   PUT /api/projects/:id (Protected)
router.put('/:id', protect, updateProject);

// @route   DELETE /api/projects/:id (Protected)
router.delete('/:id', protect, deleteProject);

module.exports = router;
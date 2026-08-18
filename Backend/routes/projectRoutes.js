const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getAllProjects,
  getFeaturedProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');

// @route   GET /api/projects (Public)
router.get('/', getAllProjects);

// @route   GET /api/projects/featured (Public)
router.get('/featured', getFeaturedProjects);

// @route   GET /api/projects/:id (Public)
router.get('/:id', getProjectById);

// @route   POST /api/projects (Protected)
router.post('/', protect, createProject);

// @route   PUT /api/projects/:id (Protected)
router.put('/:id', protect, updateProject);

// @route   DELETE /api/projects/:id (Protected)
router.delete('/:id', protect, deleteProject);

module.exports = router;
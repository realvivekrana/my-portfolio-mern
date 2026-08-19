const express = require('express');

const router = express.Router();

const {
  registerAdmin,
  loginAdmin,
  verifyAdminPin,
  getMe,
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/auth/register
// @access  Public
router.post('/register', registerAdmin);

// @route   POST /api/auth/login
// @access  Public
router.post('/login', loginAdmin);

// @route   POST /api/auth/verify-pin
// @access  Protected
router.post('/verify-pin', protect, verifyAdminPin);

// @route   GET /api/auth/me
// @access  Protected
router.get('/me', protect, getMe);

module.exports = router;
const express = require('express');

const router = express.Router();

const {
  registerAdmin,
  loginAdmin,
  verifyAdminPin,
  getMe,
  changePassword,
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

// ======================================================
// REGISTER
// POST /api/auth/register
// Access: Public
// ======================================================

router.post(
  '/register',
  registerAdmin
);

// ======================================================
// LOGIN
// POST /api/auth/login
// Access: Public
// ======================================================

router.post(
  '/login',
  loginAdmin
);

// ======================================================
// VERIFY ADMIN PIN
// POST /api/auth/verify-pin
// Access: Protected
// ======================================================

router.post(
  '/verify-pin',
  protect,
  verifyAdminPin
);

// ======================================================
// GET LOGGED-IN ADMIN
// GET /api/auth/me
// Access: Protected
// ======================================================

router.get(
  '/me',
  protect,
  getMe
);

// ======================================================
// CHANGE PASSWORD
// PUT /api/auth/change-password
// Access: Protected
// ======================================================

router.put(
  '/change-password',
  protect,
  changePassword
);

module.exports = router;
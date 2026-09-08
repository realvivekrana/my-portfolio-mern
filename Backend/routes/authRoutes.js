const express = require('express');

const router = express.Router();

const {
  registerAdmin,
  loginAdmin,
  refreshAccessToken,
  logoutAdmin,
  verifyAdminPin,
  getMe,
  changePassword,
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

const { authLimiter } = require('../middleware/rateLimiter');

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
//
// `authLimiter` brute-force login attempts ko rokta hai
// (10 attempts / 15 minutes per IP).
// ======================================================

router.post(
  '/login',
  authLimiter,
  loginAdmin
);

// ======================================================
// REFRESH ACCESS TOKEN
// POST /api/auth/refresh-token
// Access: Public (httpOnly refresh cookie ke through)
// ======================================================

router.post(
  '/refresh-token',
  refreshAccessToken
);

// ======================================================
// LOGOUT
// POST /api/auth/logout
// Access: Public (bas cookie clear + DB se refresh token hataata hai)
// ======================================================

router.post(
  '/logout',
  logoutAdmin
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
const jwt = require('jsonwebtoken');

const Admin = require('../models/Admin');

const {
  generateAccessToken,
  generateRefreshToken,
} = require('../utils/generateToken');

// ======================================================
// REFRESH TOKEN COOKIE OPTIONS
// ======================================================
//
// httpOnly       -> browser JS (document.cookie) isko kabhi read nahi
//                   kar sakta, XSS se refresh token safe rehta hai.
// secure         -> production me sirf HTTPS par bheja jaata hai.
// sameSite:'none'-> production me isliye zaroori hai kyunki frontend
//                   (vercel.app) aur backend (render.com) alag domains
//                   par hain — cross-site cookie ke liye 'none' + secure
//                   dono chahiye. Local dev me 'lax' kaafi hai.
// path           -> cookie sirf /api/auth/* routes ko hi bheja jaata
//                   hai, har request ke saath nahi (bandwidth + safety).
// ======================================================

// FIX: Pehle sirf `NODE_ENV === 'production'` check hota tha. Agar Render par
// NODE_ENV set nahi hai (ya "prod" jaisa kuch aur likha hai), to cookie
// sameSite:'lax' + secure:false ban jaati thi — aur browser cross-site
// (vercel.app -> onrender.com) request me use bhejta hi nahi -> 15 min baad
// admin baar-baar logout. Ab HTTPS frontend/Render dikhte hi cross-site
// settings (secure + sameSite none) apne aap lag jaati hain.
const isCrossSiteHttps = () =>
  process.env.NODE_ENV === 'production' ||
  Boolean(process.env.RENDER) ||
  Boolean(process.env.RENDER_EXTERNAL_URL) ||
  /^https:\/\//i.test(process.env.FRONTEND_URL || '');

const getRefreshCookieOptions = () => {
  const crossSite = isCrossSiteHttps();

  return {
    httpOnly: true,
    secure: crossSite,
    sameSite: crossSite ? 'none' : 'lax',
    path: '/api/auth',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days (JWT_REFRESH_EXPIRE se match rakho)
  };
};

// clearCookie ko `maxAge` nahi dena chahiye (Express deprecation warning,
// Express 5 me ignore hoga) — isliye clear karte waqt maxAge hata dete hain.
const getClearCookieOptions = () => {
  const { maxAge, ...options } = getRefreshCookieOptions();
  return options;
};

// ======================================================
// ISSUE TOKENS (access token return karo, refresh token cookie me set karo)
// ======================================================

// `previousRefreshToken` sirf refresh ke time diya jaata hai — rotation ke
// baad purana token chhoti grace window ke baad invalid ho jaata hai.
const issueTokens = async (res, admin, previousRefreshToken = null) => {
  const accessToken = generateAccessToken(admin._id);
  const refreshToken = generateRefreshToken(admin._id);

  const decodedRefresh = jwt.decode(refreshToken);
  const expiresAt = new Date(decodedRefresh.exp * 1000);

  await Admin.addRefreshSession(admin._id, refreshToken, expiresAt);

  if (previousRefreshToken) {
    await Admin.expireRefreshSessionSoon(admin._id, previousRefreshToken);
  }

  res.cookie('refreshToken', refreshToken, getRefreshCookieOptions());

  return accessToken;
};

// ======================================================
// REGISTER ADMIN
// POST /api/auth/register
// Access: Public
// ======================================================

const registerAdmin = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
    } = req.body;

    // ==================================================
    // VALIDATION
    // ==================================================

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          'Please provide username, email and password',
      });
    }

    // ==================================================
    // SECURITY: sirf PEHLA admin register ho sakta hai
    // --------------------------------------------------
    // Pehle ye route public tha — koi bhi /api/auth/register hit karke
    // admin ban sakta tha aur poora portfolio edit/delete kar sakta tha.
    // Ab admin pehle se ho to registration band hai.
    // ==================================================

    if ((await Admin.countDocuments()) > 0) {
      return res.status(403).json({
        success: false,
        message: 'Registration is disabled. An admin account already exists.',
      });
    }

    // ==================================================
    // CHECK EXISTING ADMIN
    // ==================================================

    const adminExists = await Admin.findOne({
      email,
    });

    if (adminExists) {
      return res.status(400).json({
        success: false,
        message:
          'Admin already exists with this email',
      });
    }

    // ==================================================
    // CREATE ADMIN
    // ==================================================

    const admin = await Admin.create({
      username,
      email,
      password,
    });

    // ==================================================
    // ISSUE TOKENS
    // ==================================================

    const accessToken = await issueTokens(res, admin);

    // ==================================================
    // RESPONSE
    // ==================================================

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      data: {
        _id: admin._id,
        username: admin.username,
        email: admin.email,
        token: accessToken,
      },
    });
  } catch (error) {
    console.error(
      'Register admin error:',
      error
    );

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// LOGIN ADMIN
// POST /api/auth/login
// Access: Public
// ======================================================

const loginAdmin = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // ==================================================
    // VALIDATION
    // ==================================================

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          'Please provide email and password',
      });
    }

    // ==================================================
    // FIND ADMIN
    // ==================================================

    const admin = await Admin.findOne({
      email,
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message:
          'Invalid email or password',
      });
    }

    // ==================================================
    // CHECK PASSWORD
    // ==================================================

    const isMatch =
      await admin.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message:
          'Invalid email or password',
      });
    }

    // ==================================================
    // ISSUE TOKENS
    // ==================================================

    const accessToken = await issueTokens(res, admin);

    // ==================================================
    // RESPONSE
    // ==================================================

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        _id: admin._id,
        username: admin.username,
        email: admin.email,
        token: accessToken,
      },
    });
  } catch (error) {
    console.error(
      'Login admin error:',
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// REFRESH ACCESS TOKEN
// POST /api/auth/refresh-token
// Access: Public (refresh token httpOnly cookie ke through aata hai)
// ======================================================
//
// Frontend jab bhi ek protected API call par 401 paata hai (access
// token expire ho chuka), tab yeh endpoint call karke bina dubara
// login kiye naya access token le sakta hai — jab tak refresh cookie
// valid hai (max 30 din, ya jab tak logout na ho).
//
// ======================================================

const refreshAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies?.refreshToken;

    if (!incomingRefreshToken) {
      return res.status(401).json({
        success: false,
        message: 'No refresh token provided, please login again',
      });
    }

    // ==================================================
    // VERIFY REFRESH TOKEN SIGNATURE + EXPIRY
    // ==================================================

    let decoded;

    try {
      decoded = jwt.verify(
        incomingRefreshToken,
        process.env.JWT_REFRESH_SECRET
      );
    } catch (error) {
      res.clearCookie('refreshToken', getClearCookieOptions());

      return res.status(401).json({
        success: false,
        message: 'Refresh token expired or invalid, please login again',
      });
    }

    // ==================================================
    // FIND ADMIN + STORED (HASHED) REFRESH TOKEN
    // ==================================================

    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      res.clearCookie('refreshToken', getClearCookieOptions());

      return res.status(401).json({
        success: false,
        message: 'Admin not found, please login again',
      });
    }

    // ==================================================
    // CHECK TOKEN IS A LIVE SESSION (SHA-256 hash match + not expired)
    // ==================================================
    //
    // Logout ho chuke ya rotate ho chuke (grace window ke baad) tokens
    // yahan reject ho jaate hain, chahe JWT signature abhi valid ho.
    //
    // ==================================================

    const isValidRefreshToken = await Admin.hasValidRefreshSession(
      admin._id,
      incomingRefreshToken
    );

    if (!isValidRefreshToken) {
      res.clearCookie('refreshToken', getClearCookieOptions());

      return res.status(401).json({
        success: false,
        message: 'Refresh token no longer valid, please login again',
      });
    }

    // ==================================================
    // ROTATE REFRESH TOKEN + ISSUE NEW ACCESS TOKEN
    // ==================================================
    //
    // Har refresh par naya refresh token milta hai; purana 30 sec ki grace
    // ke baad invalid. Grace window isliye ki 2 tabs ek saath refresh
    // karein to doosra bhi chal jaaye (warna random logout hota).
    //
    // ==================================================

    const newAccessToken = await issueTokens(
      res,
      admin,
      incomingRefreshToken
    );

    res.status(200).json({
      success: true,
      message: 'Access token refreshed successfully',
      data: {
        token: newAccessToken,
      },
    });
  } catch (error) {
    console.error(
      'Refresh token error:',
      error
    );

    res.status(500).json({
      success: false,
      message: 'Failed to refresh access token',
    });
  }
};

// ======================================================
// LOGOUT ADMIN
// POST /api/auth/logout
// Access: Public (bas cookie clear karta hai + DB se refresh token hataata hai)
// ======================================================

const logoutAdmin = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies?.refreshToken;

    if (incomingRefreshToken) {
      try {
        const decoded = jwt.decode(incomingRefreshToken);

        if (decoded?.id) {
          await Admin.removeRefreshSession(decoded.id, incomingRefreshToken);
        }
      } catch (error) {
        // Token already invalid/garbage — bas cookie clear karke aage badho
      }
    }

    res.clearCookie('refreshToken', getClearCookieOptions());

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error(
      'Logout admin error:',
      error
    );

    res.status(500).json({
      success: false,
      message: 'Failed to logout',
    });
  }
};

// ======================================================
// VERIFY ADMIN PIN
// POST /api/auth/verify-pin
// Access: Protected
// ======================================================

const verifyAdminPin = async (req, res) => {
  try {
    const {
      pin,
    } = req.body;

    // ==================================================
    // VALIDATION
    // ==================================================

    if (!pin) {
      return res.status(400).json({
        success: false,
        message:
          'Please enter the admin PIN',
      });
    }

    // ==================================================
    // GET ADMIN PIN FROM ENV
    // ==================================================

    const adminPin =
      process.env.ADMIN_PIN;

    if (!adminPin) {
      return res.status(500).json({
        success: false,
        message:
          'Admin PIN is not configured on the server',
      });
    }

    // ==================================================
    // VERIFY PIN
    // ==================================================

    if (
      String(pin) !==
      String(adminPin)
    ) {
      return res.status(401).json({
        success: false,
        message:
          'Invalid admin PIN',
      });
    }

    // ==================================================
    // RESPONSE
    // ==================================================

    res.status(200).json({
      success: true,
      message:
        'PIN verified successfully',
    });
  } catch (error) {
    console.error(
      'Verify admin PIN error:',
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// GET LOGGED-IN ADMIN
// GET /api/auth/me
// Access: Protected
// ======================================================

const getMe = async (req, res) => {
  try {
    // ==================================================
    // FIND ADMIN
    // ==================================================

    const admin =
      await Admin.findById(
        req.admin.id
      ).select('-password');

    // ==================================================
    // ADMIN NOT FOUND
    // ==================================================

    if (!admin) {
      return res.status(404).json({
        success: false,
        message:
          'Admin not found',
      });
    }

    // ==================================================
    // RESPONSE
    // ==================================================

    res.status(200).json({
      success: true,
      message:
        'Admin data fetched successfully',
      data: admin,
    });
  } catch (error) {
    console.error(
      'Get admin error:',
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// CHANGE ADMIN PASSWORD
// PUT /api/auth/change-password
// Access: Protected
// ======================================================

const changePassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    // ==================================================
    // VALIDATION
    // ==================================================

    if (
      !currentPassword ||
      !newPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Current password and new password are required',
      });
    }

    // ==================================================
    // PASSWORD LENGTH
    // ==================================================

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          'New password must be at least 6 characters',
      });
    }

    // ==================================================
    // SAME PASSWORD CHECK
    // ==================================================

    if (
      currentPassword ===
      newPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          'New password must be different from current password',
      });
    }

    // ==================================================
    // FIND LOGGED-IN ADMIN
    // ==================================================

    const admin =
      await Admin.findById(
        req.admin._id
      ).select('+password');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message:
          'Admin not found',
      });
    }

    // ==================================================
    // CHECK CURRENT PASSWORD
    // ==================================================

    const isCurrentPasswordCorrect =
      await admin.matchPassword(
        currentPassword
      );

    if (
      !isCurrentPasswordCorrect
    ) {
      return res.status(401).json({
        success: false,
        message:
          'Current password is incorrect',
      });
    }

    // ==================================================
    // UPDATE PASSWORD
    // ==================================================

    /*
      Admin model ke pre-save middleware
      password ko automatically hash karega.
    */

    admin.password =
      newPassword;

    await admin.save();

    // ==================================================
    // RESPONSE
    // ==================================================

    res.status(200).json({
      success: true,
      message:
        'Password changed successfully',
    });
  } catch (error) {
    console.error(
      'Change password error:',
      error
    );

    res.status(500).json({
      success: false,
      message:
        'Failed to change password',
    });
  }
};

// ======================================================
// EXPORT ALL CONTROLLERS
// ======================================================

module.exports = {
  registerAdmin,
  loginAdmin,
  refreshAccessToken,
  logoutAdmin,
  verifyAdminPin,
  getMe,
  changePassword,
};
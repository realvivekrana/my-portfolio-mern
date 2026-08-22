const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');

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
    // RESPONSE
    // ==================================================

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      data: {
        _id: admin._id,
        username: admin.username,
        email: admin.email,
        token: generateToken(admin._id),
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
    // RESPONSE
    // ==================================================

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        _id: admin._id,
        username: admin.username,
        email: admin.email,
        token: generateToken(admin._id),
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
  verifyAdminPin,
  getMe,
  changePassword,
};
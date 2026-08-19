const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');

// @desc    Register new admin
// @route   POST /api/auth/register
// @access  Public
const registerAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username, email and password',
      });
    }

    const adminExists = await Admin.findOne({ email });

    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: 'Admin already exists with this email',
      });
    }

    const admin = await Admin.create({
      username,
      email,
      password,
    });

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
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Verify admin PIN
// @route   POST /api/auth/verify-pin
// @access  Protected
const verifyAdminPin = async (req, res) => {
  try {
    const { pin } = req.body;

    if (!pin) {
      return res.status(400).json({
        success: false,
        message: 'Please enter the admin PIN',
      });
    }

    const adminPin = process.env.ADMIN_PIN;

    if (!adminPin) {
      return res.status(500).json({
        success: false,
        message: 'Admin PIN is not configured on the server',
      });
    }

    if (String(pin) !== String(adminPin)) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin PIN',
      });
    }

    res.status(200).json({
      success: true,
      message: 'PIN verified successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get logged-in admin data
// @route   GET /api/auth/me
// @access  Protected
const getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');

    res.status(200).json({
      success: true,
      message: 'Admin data fetched successfully',
      data: admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  verifyAdminPin,
  getMe,
};
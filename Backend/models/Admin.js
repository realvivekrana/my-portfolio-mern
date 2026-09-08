const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },

    // ==================================================
    // REFRESH TOKEN (hashed)
    // ==================================================
    //
    // Refresh token kabhi bhi plain text me DB me store nahi hota —
    // sirf uska bcrypt hash rakha jaata hai (password ki tarah).
    // `select: false` hai isliye normal queries me yeh field
    // automatically nahi aata — explicitly `.select('+refreshToken')`
    // karna padega jab zaroorat ho (refresh/logout controllers me).
    //
    // ==================================================

    refreshToken: {
      type: String,
      select: false,
      default: null,
    },

    refreshTokenExpiresAt: {
      type: Date,
      select: false,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Password ko save karne se PEHLE automatically hash kar do
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Login ke time entered password ko hashed password se match karne ka method
adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ======================================================
// SET REFRESH TOKEN (hash karke save karo)
// ======================================================

adminSchema.methods.setRefreshToken = async function (rawRefreshToken, expiresAt) {
  const salt = await bcrypt.genSalt(10);
  this.refreshToken = await bcrypt.hash(rawRefreshToken, salt);
  this.refreshTokenExpiresAt = expiresAt;
  await this.save({ validateBeforeSave: false });
};

// ======================================================
// VERIFY REFRESH TOKEN (raw token ko stored hash se compare karo)
// ======================================================

adminSchema.methods.matchRefreshToken = async function (rawRefreshToken) {
  if (!this.refreshToken) {
    return false;
  }
  return await bcrypt.compare(rawRefreshToken, this.refreshToken);
};

// ======================================================
// CLEAR REFRESH TOKEN (logout par)
// ======================================================

adminSchema.methods.clearRefreshToken = async function () {
  this.refreshToken = null;
  this.refreshTokenExpiresAt = null;
  await this.save({ validateBeforeSave: false });
};

module.exports = mongoose.model('Admin', adminSchema);
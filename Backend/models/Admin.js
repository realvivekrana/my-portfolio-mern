const mongoose = require('mongoose');
const crypto = require('crypto');
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
    // REFRESH SESSIONS (SHA-256 hashed, multi-device)
    // ==================================================
    //
    // FIX: Pehle refresh token ko bcrypt se hash kiya jaata tha. bcrypt
    // sirf pehle 72 bytes padhta hai, aur JWT ke pehle 72 bytes (header +
    // payload ka shuruaati hissa) har refresh token me ek jaise hote hain
    // -> koi bhi purana/logout ho chuka token "valid" dikhta tha (revocation
    // asal me kaam hi nahi karta tha), aur ek hi token DB me save hone se
    // doosre device par login karte hi pehla device logout ho jaata.
    //
    // Ab: har login/refresh ka SHA-256 hash `refreshSessions` array me
    // store hota hai (max 10 devices/sessions). Plain token kabhi save nahi.
    // `select: false` -> normal queries me nahi aata.
    //
    // ==================================================

    refreshSessions: {
      type: [
        {
          _id: false,
          hash: { type: String, required: true },
          expiresAt: { type: Date, required: true },
        },
      ],
      select: false,
      default: [],
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
// REFRESH SESSION HELPERS (atomic MongoDB updates)
// ======================================================
//
// Sab operations single atomic `updateOne` / `exists` calls hain (koi
// read-modify-save nahi), isliye 2 tabs ek saath refresh karein to bhi
// VersionError / race condition nahi aata.
// ======================================================

const MAX_REFRESH_SESSIONS = 10;

// Refresh token rotate hone ke baad purana token itne ms tak chalta rehta
// hai — multiple tabs / parallel requests ek saath refresh karein to
// doosre ka refresh fail hokar admin ko logout na kare.
const ROTATION_GRACE_MS = 30 * 1000;

const hashToken = (rawToken) =>
  crypto.createHash('sha256').update(String(rawToken)).digest('hex');

// Naya session add karo (login / register / refresh ke baad)
adminSchema.statics.addRefreshSession = async function (
  adminId,
  rawRefreshToken,
  expiresAt
) {
  await this.updateOne(
    { _id: adminId },
    {
      $push: {
        refreshSessions: {
          $each: [{ hash: hashToken(rawRefreshToken), expiresAt }],
          $slice: -MAX_REFRESH_SESSIONS,
        },
      },
    }
  );
};

// Kya yeh raw refresh token abhi bhi valid session hai?
adminSchema.statics.hasValidRefreshSession = async function (
  adminId,
  rawRefreshToken
) {
  const found = await this.exists({
    _id: adminId,
    refreshSessions: {
      $elemMatch: {
        hash: hashToken(rawRefreshToken),
        expiresAt: { $gt: new Date() },
      },
    },
  });

  return Boolean(found);
};

// Rotation ke baad purane token ko sirf chhoti grace window tak valid rakho
adminSchema.statics.expireRefreshSessionSoon = async function (
  adminId,
  rawRefreshToken
) {
  await this.updateOne(
    { _id: adminId, 'refreshSessions.hash': hashToken(rawRefreshToken) },
    {
      $min: {
        'refreshSessions.$.expiresAt': new Date(Date.now() + ROTATION_GRACE_MS),
      },
    }
  );
};

// Logout: yeh session turant hata do
adminSchema.statics.removeRefreshSession = async function (
  adminId,
  rawRefreshToken
) {
  await this.updateOne(
    { _id: adminId },
    { $pull: { refreshSessions: { hash: hashToken(rawRefreshToken) } } }
  );
};

module.exports = mongoose.model('Admin', adminSchema);
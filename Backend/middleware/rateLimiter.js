const rateLimit = require('express-rate-limit');

/*
|--------------------------------------------------------------------------
| CENTRALIZED RATE LIMITERS
|--------------------------------------------------------------------------
|
| Sab public (no-auth) endpoints ke rate limiters yaha ek jagah rakhe
| gaye hain, taaki future me naya public route add karte waqt bas
| yaha ek naya limiter define karke import karna ho.
|
| NOTE: `app.set('trust proxy', 1)` server.js me already set hai, isliye
| Render/Railway/Vercel jaise reverse-proxy hosts ke peeche bhi har
| visitor ki asli IP sahi tarike se pehchani jaayegi.
|
|--------------------------------------------------------------------------
*/

// ======================================================
// CONTACT FORM LIMITER
// ======================================================
//
// Public endpoint: POST /api/contact
//
// 5 submissions / 15 minutes per IP — ek genuine visitor iss window me
// 1-2 baar hi form bhejega, lekin bots/spam scripts ko rok deta hai.
// ======================================================

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes

  limit: 5,

  standardHeaders: true, // RateLimit-* headers add karo
  legacyHeaders: false,

  message: {
    success: false,
    message:
      "You've sent too many messages recently. Please try again after some time.",
  },

  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message:
        "You've sent too many messages recently. Please try again after some time.",
    });
  },
});

// ======================================================
// CHATBOT LIMITER
// ======================================================
//
// Public endpoint: POST /api/chatbot
//
// 15 messages / 10 minutes per IP — genuine visitor ke liye kaafi,
// automated abuse / free-tier AI quota drain ko rokta hai.
// ======================================================

const chatbotLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes

  limit: 15,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message:
      "You're sending messages a little too quickly. Please wait a few minutes and try again.",
  },

  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message:
        "You're sending messages a little too quickly. Please wait a few minutes and try again.",
    });
  },
});

// ======================================================
// AUTH LOGIN LIMITER (bonus safety net)
// ======================================================
//
// Public endpoint: POST /api/auth/login
//
// Brute-force login attempts ko rokne ke liye — 10 attempts / 15 min
// per IP. Register/login dono kaafi sensitive hain, isliye yeh bhi
// yahi module me rakha hai (server.js/authRoutes.js me lagana optional).
// ======================================================

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes

  limit: 10,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: 'Too many login attempts. Please try again after some time.',
  },

  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many login attempts. Please try again after some time.',
    });
  },
});

module.exports = {
  contactLimiter,
  chatbotLimiter,
  authLimiter,
};
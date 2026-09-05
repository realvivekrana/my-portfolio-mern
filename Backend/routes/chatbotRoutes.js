const express = require('express');

const rateLimit = require('express-rate-limit');

const router = express.Router();

const { sendMessage } = require('../controllers/chatbotController');

/*
|--------------------------------------------------------------------------
| CHATBOT RATE LIMITER
|--------------------------------------------------------------------------
|
| Public endpoint hai (koi login/JWT required nahi), isliye har visitor
| ki IP par ek reasonable limit lagate hain — taaki:
|
|   1. Koi script/bot spam karke Groq ka free quota khatam na kare.
|   2. Server par unnecessary load na aaye.
|
| 15 messages / 10 minutes per IP — ek genuine visitor ke liye kaafi
| hai, lekin automated abuse ko rok deta hai.
|
| NOTE: Isko sahi tarike se kaam karne ke liye, agar app kisi reverse
| proxy (Render, Railway, Vercel, Nginx, etc.) ke peeche deploy hai,
| toh `server.js` me `app.set('trust proxy', 1)` set hona zaroori hai
| — warna har request same "proxy IP" se aati hui dikhegi.
|
|--------------------------------------------------------------------------
*/

const chatbotLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes

  limit: 15,

  standardHeaders: true, // adds RateLimit-* headers
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

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
|
| Portfolio visitor chatbot ke saath chat kar sakta hai.
|
| POST /api/chatbot
|
| Response streams back as Server-Sent Events (SSE):
|   event: chunk   -> { token: string }         (partial reply text)
|   event: action  -> { type, ... }             (resume / project link)
|   event: error   -> { message: string }
|   event: done    -> {}
|
|--------------------------------------------------------------------------
*/

router.post('/', chatbotLimiter, sendMessage);

module.exports = router;
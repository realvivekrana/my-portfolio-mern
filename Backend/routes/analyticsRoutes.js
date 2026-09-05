const express = require('express');

const rateLimit = require('express-rate-limit');

const router = express.Router();

const {
  trackEvent,
  getAnalyticsSummary,
} = require('../controllers/analyticsController');

const {
  protect,
} = require('../middleware/authMiddleware');

/*
|--------------------------------------------------------------------------
| TRACK RATE LIMITER
|--------------------------------------------------------------------------
|
| /track public endpoint hai (login required nahi), isliye ek
| reasonable per-IP limit lagate hain taaki koi script/bot spam
| karke fake analytics data na bhar de.
|
| Ek genuine visitor normal browsing mein bhi kaafi events bhej
| sakta hai (pageview + har project click + resume download),
| isliye limit thoda generous rakha hai.
|
|--------------------------------------------------------------------------
*/

const trackLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes

  limit: 120,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message:
      'Too many analytics requests. Please slow down.',
  },

  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message:
        'Too many analytics requests. Please slow down.',
    });
  },
});

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
|
| POST /api/analytics/track
|
| Portfolio visitors ke pageview / project click / resume
| download events yahan record hote hain.
|
|--------------------------------------------------------------------------
*/

router.post(
  '/track',
  trackLimiter,
  trackEvent
);

/*
|--------------------------------------------------------------------------
| PROTECTED ADMIN
|--------------------------------------------------------------------------
|
| GET /api/analytics/summary
|
| Admin Dashboard ke Analytics tab ke liye totals, daily trend
| aur top projects return karta hai.
|
|--------------------------------------------------------------------------
*/

router.get(
  '/summary',
  protect,
  getAnalyticsSummary
);

module.exports = router;
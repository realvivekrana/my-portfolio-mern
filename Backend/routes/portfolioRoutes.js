const express = require('express');

const router = express.Router();

const {
  getPortfolio,
  updatePortfolio,
} = require('../controllers/portfolioController');

const { protect } = require('../middleware/authMiddleware');

/*
|--------------------------------------------------------------------------
| GET Portfolio
|--------------------------------------------------------------------------
| Public route
|
| Frontend portfolio isi route se dynamic portfolio content fetch karega.
|
| GET /api/portfolio
|--------------------------------------------------------------------------
*/

router.get('/', getPortfolio);

/*
|--------------------------------------------------------------------------
| UPDATE Portfolio
|--------------------------------------------------------------------------
| Protected admin route
|
| Admin Dashboard se portfolio content update karne ke liye.
|
| PUT /api/portfolio
|
| Request:
|   protect middleware
|        ↓
|   updatePortfolio controller
|--------------------------------------------------------------------------
*/

router.put(
  '/',
  protect,
  updatePortfolio
);

module.exports = router;
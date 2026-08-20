const express = require('express');

const {
  getPortfolio,
  updatePortfolio,
  updateProfileImage,
  removeProfileImage,
  resetPortfolio,
  deletePortfolio,
} = require('../controllers/portfolioController');

const router = express.Router();

/*
|--------------------------------------------------------------------------
| GET PORTFOLIO
|--------------------------------------------------------------------------
| Portfolio ka complete data fetch karega.
|
| GET /api/portfolio
|--------------------------------------------------------------------------
*/

router.get('/', getPortfolio);

/*
|--------------------------------------------------------------------------
| UPDATE PORTFOLIO
|--------------------------------------------------------------------------
| Admin Dashboard se profile, about, contact, social links,
| resume, SEO aur settings update karne ke liye.
|
| PUT /api/portfolio
|--------------------------------------------------------------------------
*/

router.put('/', updatePortfolio);

/*
|--------------------------------------------------------------------------
| UPDATE PROFILE IMAGE
|--------------------------------------------------------------------------
| Profile image upload/update.
|
| NOTE:
| Agar tumhare project me existing upload middleware hai,
| to next step me usi middleware ko connect karenge.
|
| POST /api/portfolio/profile-image
|--------------------------------------------------------------------------
*/

router.post('/profile-image', updateProfileImage);

/*
|--------------------------------------------------------------------------
| REMOVE PROFILE IMAGE
|--------------------------------------------------------------------------
|
| DELETE /api/portfolio/profile-image
|--------------------------------------------------------------------------
*/

router.delete('/profile-image', removeProfileImage);

/*
|--------------------------------------------------------------------------
| RESET PORTFOLIO
|--------------------------------------------------------------------------
| Saari profile information ko default values par reset karega.
|
| POST /api/portfolio/reset
|--------------------------------------------------------------------------
*/

router.post('/reset', resetPortfolio);

/*
|--------------------------------------------------------------------------
| DELETE PORTFOLIO
|--------------------------------------------------------------------------
| Complete portfolio document delete karega.
|
| DELETE /api/portfolio
|--------------------------------------------------------------------------
*/

router.delete('/', deletePortfolio);

module.exports = router;
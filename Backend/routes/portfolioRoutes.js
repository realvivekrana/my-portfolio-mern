const express = require('express');

const {
  getPortfolio,
  updatePortfolio,

  updateExperience,
  updateEducation,

  updateHero,
  updateAbout,
  updateContact,
  updateSocialLinks,
  updateSEO,
  updateSettings,

  updateProfileImage,
  removeProfileImage,

  resetPortfolio,
  deletePortfolio,
} = require('../controllers/portfolioController');

const {
  protect,
} = require('../middleware/authMiddleware');

const router = express.Router();

/*
|--------------------------------------------------------------------------
| GET PORTFOLIO
|--------------------------------------------------------------------------
|
| GET /api/portfolio
|
| Public portfolio ka complete data fetch karega.
|
|--------------------------------------------------------------------------
*/

router.get(
  '/',
  getPortfolio
);

/*
|--------------------------------------------------------------------------
| UPDATE COMPLETE PORTFOLIO
|--------------------------------------------------------------------------
|
| PUT /api/portfolio
|
| Admin Dashboard se portfolio ke multiple sections update karne
| ke liye.
|
|--------------------------------------------------------------------------
*/

router.put(
  '/',
  protect,
  updatePortfolio
);

/*
|--------------------------------------------------------------------------
| EXPERIENCE
|--------------------------------------------------------------------------
|
| PUT /api/portfolio/experience
|
| Admin Dashboard se Experience section update karega.
|
|--------------------------------------------------------------------------
*/

router.put(
  '/experience',
  protect,
  updateExperience
);

/*
|--------------------------------------------------------------------------
| EDUCATION
|--------------------------------------------------------------------------
|
| PUT /api/portfolio/education
|
| Admin Dashboard se Education section update karega.
|
|--------------------------------------------------------------------------
*/

router.put(
  '/education',
  protect,
  updateEducation
);

/*
|--------------------------------------------------------------------------
| HERO
|--------------------------------------------------------------------------
|
| PUT /api/portfolio/hero
|
|--------------------------------------------------------------------------
*/

router.put(
  '/hero',
  protect,
  updateHero
);

/*
|--------------------------------------------------------------------------
| ABOUT
|--------------------------------------------------------------------------
|
| PUT /api/portfolio/about
|
|--------------------------------------------------------------------------
*/

router.put(
  '/about',
  protect,
  updateAbout
);

/*
|--------------------------------------------------------------------------
| CONTACT
|--------------------------------------------------------------------------
|
| PUT /api/portfolio/contact
|
|--------------------------------------------------------------------------
*/

router.put(
  '/contact',
  protect,
  updateContact
);

/*
|--------------------------------------------------------------------------
| SOCIAL LINKS
|--------------------------------------------------------------------------
|
| PUT /api/portfolio/social-links
|
|--------------------------------------------------------------------------
*/

router.put(
  '/social-links',
  protect,
  updateSocialLinks
);

/*
|--------------------------------------------------------------------------
| SEO
|--------------------------------------------------------------------------
|
| PUT /api/portfolio/seo
|
|--------------------------------------------------------------------------
*/

router.put(
  '/seo',
  protect,
  updateSEO
);

/*
|--------------------------------------------------------------------------
| SETTINGS
|--------------------------------------------------------------------------
|
| PUT /api/portfolio/settings
|
|--------------------------------------------------------------------------
*/

router.put(
  '/settings',
  protect,
  updateSettings
);

/*
|--------------------------------------------------------------------------
| UPDATE PROFILE IMAGE
|--------------------------------------------------------------------------
|
| POST /api/portfolio/profile-image
|
| NOTE:
| Existing upload system ka dedicated route
| portfolioUploadRoutes.js mein bhi hai.
|
| Is route ko existing controller compatibility ke liye
| preserve kiya gaya hai.
|
|--------------------------------------------------------------------------
*/

router.post(
  '/profile-image',
  protect,
  updateProfileImage
);

/*
|--------------------------------------------------------------------------
| REMOVE PROFILE IMAGE
|--------------------------------------------------------------------------
|
| DELETE /api/portfolio/profile-image
|
|--------------------------------------------------------------------------
*/

router.delete(
  '/profile-image',
  protect,
  removeProfileImage
);

/*
|--------------------------------------------------------------------------
| RESET PORTFOLIO
|--------------------------------------------------------------------------
|
| POST /api/portfolio/reset
|
|--------------------------------------------------------------------------
*/

router.post(
  '/reset',
  protect,
  resetPortfolio
);

/*
|--------------------------------------------------------------------------
| DELETE PORTFOLIO
|--------------------------------------------------------------------------
|
| DELETE /api/portfolio
|
|--------------------------------------------------------------------------
*/

router.delete(
  '/',
  protect,
  deletePortfolio
);

module.exports = router;
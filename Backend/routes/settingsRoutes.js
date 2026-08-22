const express = require('express');

const {
  getSettings,
  updateSettings,
  resetSettings,
} = require('../controllers/settingsController');

const {
  protect,
} = require('../middleware/authMiddleware');

const router = express.Router();

/*
|--------------------------------------------------------------------------
| SETTINGS ROUTES
|--------------------------------------------------------------------------
|
| IMPORTANT:
| All settings routes are ADMIN PROTECTED.
|
| Authentication flow:
|
| Frontend
|    ↓
| Bearer Token
|    ↓
| protect middleware
|    ↓
| req.admin
|    ↓
| settingsController
|
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| GET SETTINGS
|--------------------------------------------------------------------------
|
| GET /api/settings
|
| Current logged-in admin ki settings fetch karega.
|
|--------------------------------------------------------------------------
*/

router.get(
  '/',
  protect,
  getSettings
);


/*
|--------------------------------------------------------------------------
| UPDATE SETTINGS
|--------------------------------------------------------------------------
|
| PUT /api/settings
|
| Dashboard preferences aur notification settings update karega.
|
|--------------------------------------------------------------------------
*/

router.put(
  '/',
  protect,
  updateSettings
);


/*
|--------------------------------------------------------------------------
| RESET SETTINGS
|--------------------------------------------------------------------------
|
| PUT /api/settings/reset
|
| Current admin ki settings ko default values par reset karega.
|
|--------------------------------------------------------------------------
*/

router.put(
  '/reset',
  protect,
  resetSettings
);


module.exports = router;
const express = require('express');

const {
  getSettings,
  updateSettings,
  resetSettings,
} = require('../controllers/settingsController');

const router = express.Router();

/*
|--------------------------------------------------------------------------
| GET SETTINGS
|--------------------------------------------------------------------------
|
| GET /api/settings
|
| Admin ki current settings fetch karega.
|
|--------------------------------------------------------------------------
*/

router.get('/', getSettings);

/*
|--------------------------------------------------------------------------
| UPDATE SETTINGS
|--------------------------------------------------------------------------
|
| PUT /api/settings
|
| Admin ki settings update karega.
|
|--------------------------------------------------------------------------
*/

router.put('/', updateSettings);

/*
|--------------------------------------------------------------------------
| RESET SETTINGS
|--------------------------------------------------------------------------
|
| PUT /api/settings/reset
|
| Settings ko default values par reset karega.
|
|--------------------------------------------------------------------------
*/

router.put('/reset', resetSettings);

module.exports = router;
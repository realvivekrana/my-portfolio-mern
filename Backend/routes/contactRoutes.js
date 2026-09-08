const express = require('express');

const router = express.Router();

const {
  createContact,
  getAllContacts,
  getContactById,
  markAsRead,
  deleteContact,
} = require('../controllers/contactController');

const {
  protect,
} = require('../middleware/authMiddleware');

const {
  contactLimiter,
} = require('../middleware/rateLimiter');

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
|
| Portfolio contact form se koi bhi visitor message send kar sakta hai.
| `contactLimiter` isko spam/abuse se bachata hai (5 requests / 15 min
| per IP) — protect se PEHLE lagaya gaya hai kyunki yeh route khud hi
| public/unauthenticated hai.
|
| POST /api/contact
|
|--------------------------------------------------------------------------
*/

router.post(
  '/',
  contactLimiter,
  createContact
);

/*
|--------------------------------------------------------------------------
| ADMIN - GET ALL MESSAGES
|--------------------------------------------------------------------------
|
| GET /api/contact
|
| Sirf authenticated admin messages dekh sakta hai.
|
|--------------------------------------------------------------------------
*/

router.get(
  '/',
  protect,
  getAllContacts
);

/*
|--------------------------------------------------------------------------
| ADMIN - GET SINGLE MESSAGE
|--------------------------------------------------------------------------
|
| GET /api/contact/:id
|
|--------------------------------------------------------------------------
*/

router.get(
  '/:id',
  protect,
  getContactById
);

/*
|--------------------------------------------------------------------------
| ADMIN - MARK MESSAGE AS READ
|--------------------------------------------------------------------------
|
| PUT /api/contact/:id/read
|
|--------------------------------------------------------------------------
*/

router.put(
  '/:id/read',
  protect,
  markAsRead
);

/*
|--------------------------------------------------------------------------
| ADMIN - DELETE MESSAGE
|--------------------------------------------------------------------------
|
| DELETE /api/contact/:id
|
|--------------------------------------------------------------------------
*/

router.delete(
  '/:id',
  protect,
  deleteContact
);

module.exports = router;
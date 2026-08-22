const express = require('express');

const router = express.Router();

const {
  protect,
} = require('../middleware/authMiddleware');

const {
  createMessage,
  getAllMessages,
  getMessageById,
  markMessageAsRead,
  markMessageAsUnread,
  updateMessage,
  deleteMessage,
  getUnreadMessageCount,
} = require('../controllers/messageController');

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| CREATE MESSAGE
|--------------------------------------------------------------------------
| POST /api/messages
|
| Contact form se koi bhi visitor message send kar sakta hai.
|--------------------------------------------------------------------------
*/

router.post(
  '/',
  createMessage
);

/*
|--------------------------------------------------------------------------
| ADMIN ROUTES
|--------------------------------------------------------------------------
| Saare neeche wale routes protected hain.
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| GET ALL MESSAGES
|--------------------------------------------------------------------------
| GET /api/messages
|--------------------------------------------------------------------------
*/

router.get(
  '/',
  protect,
  getAllMessages
);

/*
|--------------------------------------------------------------------------
| GET UNREAD MESSAGE COUNT
|--------------------------------------------------------------------------
| GET /api/messages/unread-count
|
| IMPORTANT:
| Ye route /:id se PEHLE hona chahiye.
| Warna "unread-count" ko MongoDB ID samajhne ki koshish ho sakti hai.
|--------------------------------------------------------------------------
*/

router.get(
  '/unread-count',
  protect,
  getUnreadMessageCount
);

/*
|--------------------------------------------------------------------------
| MARK MESSAGE AS READ
|--------------------------------------------------------------------------
| PATCH /api/messages/:id/read
|--------------------------------------------------------------------------
*/

router.patch(
  '/:id/read',
  protect,
  markMessageAsRead
);

/*
|--------------------------------------------------------------------------
| MARK MESSAGE AS UNREAD
|--------------------------------------------------------------------------
| PATCH /api/messages/:id/unread
|--------------------------------------------------------------------------
*/

router.patch(
  '/:id/unread',
  protect,
  markMessageAsUnread
);

/*
|--------------------------------------------------------------------------
| UPDATE MESSAGE
|--------------------------------------------------------------------------
| PATCH /api/messages/:id
|
| Admin notes, read status aur reply status update kar sakte hain.
|--------------------------------------------------------------------------
*/

router.patch(
  '/:id',
  protect,
  updateMessage
);

/*
|--------------------------------------------------------------------------
| GET SINGLE MESSAGE
|--------------------------------------------------------------------------
| GET /api/messages/:id
|--------------------------------------------------------------------------
*/

router.get(
  '/:id',
  protect,
  getMessageById
);

/*
|--------------------------------------------------------------------------
| DELETE MESSAGE
|--------------------------------------------------------------------------
| DELETE /api/messages/:id
|--------------------------------------------------------------------------
*/

router.delete(
  '/:id',
  protect,
  deleteMessage
);

module.exports = router;
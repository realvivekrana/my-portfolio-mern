const express = require('express');

const router = express.Router();

const { sendMessage } = require('../controllers/chatbotController');

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
|
| Portfolio visitor chatbot ke saath chat kar sakta hai.
|
| POST /api/chatbot
|
|--------------------------------------------------------------------------
*/

router.post('/', sendMessage);

module.exports = router;
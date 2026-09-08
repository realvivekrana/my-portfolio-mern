const express = require('express');

const router = express.Router();

const { sendMessage } = require('../controllers/chatbotController');

const {
  chatbotLimiter,
} = require('../middleware/rateLimiter');

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
|
| Portfolio visitor chatbot ke saath chat kar sakta hai.
|
| `chatbotLimiter` ab centralized `middleware/rateLimiter.js` se aata
| hai (15 messages / 10 minutes per IP) — behavior bilkul same hai,
| bas sabhi public-route limiters ab ek hi jagah maintain hote hain.
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
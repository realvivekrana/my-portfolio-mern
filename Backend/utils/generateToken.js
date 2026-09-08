const jwt = require('jsonwebtoken');

/*
|--------------------------------------------------------------------------
| ACCESS TOKEN
|--------------------------------------------------------------------------
|
| Short-lived hota hai (default 15 minutes). Yeh har protected API
| request ke Authorization header me bheja jaata hai. Expire hone par
| frontend `/api/auth/refresh-token` call karke naya access token
| le sakta hai (refresh cookie ke through, bina dubara login kiye).
|
|--------------------------------------------------------------------------
*/

const generateAccessToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || '15m',
    }
  );
};

/*
|--------------------------------------------------------------------------
| REFRESH TOKEN
|--------------------------------------------------------------------------
|
| Long-lived hota hai (default 30 days). Yeh kabhi bhi frontend JS ko
| directly visible nahi hota — httpOnly cookie ke through set hota hai
| aur sirf `/api/auth/refresh-token` aur `/api/auth/logout` routes
| tak scoped rehta hai (authController.js dekho).
|
| Isko sign karne ke liye alag secret (`JWT_REFRESH_SECRET`) use hota
| hai taaki agar access-token secret kisi tarah leak ho bhi jaaye,
| refresh tokens uss se forge na kiye ja sakein.
|
|--------------------------------------------------------------------------
*/

const generateRefreshToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d',
    }
  );
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
// Handle routes that don't exist (404)
const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global error handler
const errorHandler = (err, req, res, next) => {
  // Response ka header pehle hi ja chuka ho (e.g. chatbot SSE stream) to
  // dobara JSON bhejne par "Cannot set headers after they are sent" crash
  // aata — aise me Express ke default handler ko de do.
  if (res.headersSent) {
    return next(err);
  }

  // body-parser / multer jaise libraries `err.status` khud set karti hain
  // (e.g. kharab JSON body = 400, bahut bada payload = 413). Pehle ye sab
  // 500 ban jaate the.
  const errorStatus = err.status || err.statusCode;

  let statusCode =
    res.statusCode !== 200
      ? res.statusCode
      : errorStatus >= 400 && errorStatus < 600
      ? errorStatus
      : 500;
  let message = err.message;

  // CORS blocked origin — 500 ki jagah 403
  if (message && message.startsWith('CORS policy')) {
    statusCode = 403;
  }

  // Mongoose bad ObjectId error
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found';
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    message = 'Duplicate field value entered';
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
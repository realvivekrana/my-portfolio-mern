const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    /*
    |--------------------------------------------------------------------------
    | Sender Name
    |--------------------------------------------------------------------------
    */

    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },

    /*
    |--------------------------------------------------------------------------
    | Sender Email
    |--------------------------------------------------------------------------
    */

    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },

    /*
    |--------------------------------------------------------------------------
    | Subject
    |--------------------------------------------------------------------------
    */

    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      minlength: [3, 'Subject must be at least 3 characters'],
      maxlength: [200, 'Subject cannot exceed 200 characters'],
    },

    /*
    |--------------------------------------------------------------------------
    | Message
    |--------------------------------------------------------------------------
    */

    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      minlength: [5, 'Message must be at least 5 characters'],
      maxlength: [5000, 'Message cannot exceed 5000 characters'],
    },

    /*
    |--------------------------------------------------------------------------
    | Read Status
    |--------------------------------------------------------------------------
    */

    isRead: {
      type: Boolean,
      default: false,
    },

    /*
    |--------------------------------------------------------------------------
    | Reply Status
    |--------------------------------------------------------------------------
    */

    isReplied: {
      type: Boolean,
      default: false,
    },

    /*
    |--------------------------------------------------------------------------
    | Admin Notes
    |--------------------------------------------------------------------------
    */

    adminNote: {
      type: String,
      default: '',
      trim: true,
      maxlength: [2000, 'Admin note cannot exceed 2000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

/*
|--------------------------------------------------------------------------
| Indexes
|--------------------------------------------------------------------------
|
| These indexes make admin message listing and unread-message
| queries faster.
|
|--------------------------------------------------------------------------
*/

messageSchema.index({
  isRead: 1,
  createdAt: -1,
});

messageSchema.index({
  createdAt: -1,
});

/*
|--------------------------------------------------------------------------
| Model
|--------------------------------------------------------------------------
*/

module.exports = mongoose.model(
  'Message',
  messageSchema
);
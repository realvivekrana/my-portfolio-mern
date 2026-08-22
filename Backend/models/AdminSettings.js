const mongoose = require('mongoose');

/*
|--------------------------------------------------------------------------
| ADMIN SETTINGS SCHEMA
|--------------------------------------------------------------------------
|
| Admin Dashboard ki personal preferences yahan store hongi.
|
| Admin
|   ↓
| AdminSettings
|   ↓
| MongoDB
|
|--------------------------------------------------------------------------
*/

const adminSettingsSchema = new mongoose.Schema(
  {
    /*
    |--------------------------------------------------------------------------
    | ADMIN
    |--------------------------------------------------------------------------
    |
    | Har admin ka apna settings document hoga.
    |
    |--------------------------------------------------------------------------
    */

    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
      unique: true,
      index: true,
    },

    /*
    |--------------------------------------------------------------------------
    | DASHBOARD PREFERENCES
    |--------------------------------------------------------------------------
    */

    dashboard: {
      defaultSection: {
        type: String,
        enum: [
          'overview',
          'projects',
          'certificates',
          'messages',
          'profile',
          'settings',
          'resume',
        ],
        default: 'overview',
      },

      compactSidebar: {
        type: Boolean,
        default: false,
      },

      confirmBeforeDelete: {
        type: Boolean,
        default: true,
      },

      autoRefreshMessages: {
        type: Boolean,
        default: true,
      },
    },

    /*
    |--------------------------------------------------------------------------
    | NOTIFICATION SETTINGS
    |--------------------------------------------------------------------------
    */

    notifications: {
      newMessageBadge: {
        type: Boolean,
        default: true,
      },

      successNotifications: {
        type: Boolean,
        default: true,
      },

      browserNotifications: {
        type: Boolean,
        default: false,
      },
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  'AdminSettings',
  adminSettingsSchema
);
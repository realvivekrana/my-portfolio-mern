const AdminSettings = require('../models/AdminSettings');

/*
|--------------------------------------------------------------------------
| DEFAULT SETTINGS
|--------------------------------------------------------------------------
|
| Agar kisi admin ka settings document MongoDB me nahi hai,
| to ye defaults use honge.
|
|--------------------------------------------------------------------------
*/

const DEFAULT_SETTINGS = {
  dashboard: {
    defaultSection: 'overview',
    compactSidebar: false,
    confirmBeforeDelete: true,
    autoRefreshMessages: true,
  },

  notifications: {
    newMessageBadge: true,
    successNotifications: true,
    browserNotifications: false,
  },
};

/*
|--------------------------------------------------------------------------
| GET ADMIN ID
|--------------------------------------------------------------------------
|
| Project ke authentication middleware ke according admin/user ID
| alag property me ho sakti hai.
|
| Hum common possibilities support kar rahe hain.
|
|--------------------------------------------------------------------------
*/

const getAdminId = (req) => {
  return (
    req.admin?._id ||
    req.admin?.id ||
    req.user?._id ||
    req.user?.id ||
    null
  );
};

/*
|--------------------------------------------------------------------------
| GET SETTINGS
|--------------------------------------------------------------------------
|
| GET /api/settings
|
| Admin ke dashboard aur notification settings return karega.
|
|--------------------------------------------------------------------------
*/

const getSettings = async (req, res) => {
  try {
    const adminId = getAdminId(req);

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: 'Admin authentication required.',
      });
    }

    let settings = await AdminSettings.findOne({
      admin: adminId,
    }).lean();

    /*
    |--------------------------------------------------------------------------
    | CREATE DEFAULT SETTINGS
    |--------------------------------------------------------------------------
    |
    | First time Settings open hone par document automatically create hoga.
    |
    |--------------------------------------------------------------------------
    */

    if (!settings) {
      settings = await AdminSettings.create({
        admin: adminId,
        ...DEFAULT_SETTINGS,
      });

      settings = settings.toObject();
    }

    return res.status(200).json({
      success: true,
      message: 'Settings fetched successfully.',
      data: settings,
    });
  } catch (error) {
    console.error('Get settings error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load settings.',
    });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE SETTINGS
|--------------------------------------------------------------------------
|
| PUT /api/settings
|
| Dashboard preferences + notification settings update karega.
|
|--------------------------------------------------------------------------
*/

const updateSettings = async (req, res) => {
  try {
    const adminId = getAdminId(req);

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: 'Admin authentication required.',
      });
    }

    const {
      dashboard,
      notifications,
    } = req.body || {};

    /*
    |--------------------------------------------------------------------------
    | FIND OR CREATE SETTINGS
    |--------------------------------------------------------------------------
    */

    let settings = await AdminSettings.findOne({
      admin: adminId,
    });

    if (!settings) {
      settings = new AdminSettings({
        admin: adminId,
        ...DEFAULT_SETTINGS,
      });
    }

    /*
    |--------------------------------------------------------------------------
    | DASHBOARD SETTINGS
    |--------------------------------------------------------------------------
    */

    if (dashboard && typeof dashboard === 'object') {
      /*
      |--------------------------------------------------------------------------
      | DEFAULT SECTION
      |--------------------------------------------------------------------------
      */

      if (
        dashboard.defaultSection !== undefined
      ) {
        const allowedSections = [
          'overview',
          'projects',
          'certificates',
          'messages',
          'profile',
          'settings',
          'resume',
        ];

        if (
          !allowedSections.includes(
            dashboard.defaultSection
          )
        ) {
          return res.status(400).json({
            success: false,
            message: 'Invalid default dashboard section.',
          });
        }

        settings.dashboard.defaultSection =
          dashboard.defaultSection;
      }

      /*
      |--------------------------------------------------------------------------
      | COMPACT SIDEBAR
      |--------------------------------------------------------------------------
      */

      if (
        dashboard.compactSidebar !== undefined
      ) {
        if (
          typeof dashboard.compactSidebar !==
          'boolean'
        ) {
          return res.status(400).json({
            success: false,
            message:
              'compactSidebar must be a boolean value.',
          });
        }

        settings.dashboard.compactSidebar =
          dashboard.compactSidebar;
      }

      /*
      |--------------------------------------------------------------------------
      | CONFIRM BEFORE DELETE
      |--------------------------------------------------------------------------
      */

      if (
        dashboard.confirmBeforeDelete !== undefined
      ) {
        if (
          typeof dashboard.confirmBeforeDelete !==
          'boolean'
        ) {
          return res.status(400).json({
            success: false,
            message:
              'confirmBeforeDelete must be a boolean value.',
          });
        }

        settings.dashboard.confirmBeforeDelete =
          dashboard.confirmBeforeDelete;
      }

      /*
      |--------------------------------------------------------------------------
      | AUTO REFRESH MESSAGES
      |--------------------------------------------------------------------------
      */

      if (
        dashboard.autoRefreshMessages !== undefined
      ) {
        if (
          typeof dashboard.autoRefreshMessages !==
          'boolean'
        ) {
          return res.status(400).json({
            success: false,
            message:
              'autoRefreshMessages must be a boolean value.',
          });
        }

        settings.dashboard.autoRefreshMessages =
          dashboard.autoRefreshMessages;
      }
    }

    /*
    |--------------------------------------------------------------------------
    | NOTIFICATION SETTINGS
    |--------------------------------------------------------------------------
    */

    if (
      notifications &&
      typeof notifications === 'object'
    ) {
      /*
      |--------------------------------------------------------------------------
      | NEW MESSAGE BADGE
      |--------------------------------------------------------------------------
      */

      if (
        notifications.newMessageBadge !== undefined
      ) {
        if (
          typeof notifications.newMessageBadge !==
          'boolean'
        ) {
          return res.status(400).json({
            success: false,
            message:
              'newMessageBadge must be a boolean value.',
          });
        }

        settings.notifications.newMessageBadge =
          notifications.newMessageBadge;
      }

      /*
      |--------------------------------------------------------------------------
      | SUCCESS NOTIFICATIONS
      |--------------------------------------------------------------------------
      */

      if (
        notifications.successNotifications !==
        undefined
      ) {
        if (
          typeof notifications.successNotifications !==
          'boolean'
        ) {
          return res.status(400).json({
            success: false,
            message:
              'successNotifications must be a boolean value.',
          });
        }

        settings.notifications.successNotifications =
          notifications.successNotifications;
      }

      /*
      |--------------------------------------------------------------------------
      | BROWSER NOTIFICATIONS
      |--------------------------------------------------------------------------
      */

      if (
        notifications.browserNotifications !==
        undefined
      ) {
        if (
          typeof notifications.browserNotifications !==
          'boolean'
        ) {
          return res.status(400).json({
            success: false,
            message:
              'browserNotifications must be a boolean value.',
          });
        }

        settings.notifications.browserNotifications =
          notifications.browserNotifications;
      }
    }

    /*
    |--------------------------------------------------------------------------
    | SAVE
    |--------------------------------------------------------------------------
    */

    await settings.save();

    /*
    |--------------------------------------------------------------------------
    | RETURN UPDATED SETTINGS
    |--------------------------------------------------------------------------
    */

    const updatedSettings =
      await AdminSettings.findOne({
        admin: adminId,
      }).lean();

    return res.status(200).json({
      success: true,
      message: 'Settings updated successfully.',
      data: updatedSettings,
    });
  } catch (error) {
    console.error('Update settings error:', error);

    /*
    |--------------------------------------------------------------------------
    | MONGOOSE VALIDATION ERROR
    |--------------------------------------------------------------------------
    */

    if (
      error.name === 'ValidationError'
    ) {
      const validationMessages = Object.values(
        error.errors || {}
      ).map(
        (item) => item.message
      );

      return res.status(400).json({
        success: false,
        message:
          validationMessages.join(', ') ||
          'Invalid settings data.',
      });
    }

    /*
    |--------------------------------------------------------------------------
    | DUPLICATE ADMIN SETTINGS
    |--------------------------------------------------------------------------
    */

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          'Settings already exist for this admin.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to update settings.',
    });
  }
};

/*
|--------------------------------------------------------------------------
| RESET SETTINGS
|--------------------------------------------------------------------------
|
| PUT /api/settings/reset
|
| Agar admin apni preferences ko default par lana chahe.
|
|--------------------------------------------------------------------------
*/

const resetSettings = async (req, res) => {
  try {
    const adminId = getAdminId(req);

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: 'Admin authentication required.',
      });
    }

    const settings =
      await AdminSettings.findOneAndUpdate(
        {
          admin: adminId,
        },
        {
          $set: {
            dashboard: {
              ...DEFAULT_SETTINGS.dashboard,
            },

            notifications: {
              ...DEFAULT_SETTINGS.notifications,
            },
          },
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }
      ).lean();

    return res.status(200).json({
      success: true,
      message: 'Settings reset successfully.',
      data: settings,
    });
  } catch (error) {
    console.error('Reset settings error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to reset settings.',
    });
  }
};

module.exports = {
  getSettings,
  updateSettings,
  resetSettings,
};
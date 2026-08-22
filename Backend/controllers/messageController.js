const Message = require('../models/Message');

/*
|--------------------------------------------------------------------------
| CREATE MESSAGE
|--------------------------------------------------------------------------
| POST /api/messages
|
| Public contact form se message create hoga.
|--------------------------------------------------------------------------
*/

const createMessage = async (req, res) => {
  try {
    const {
      name,
      email,
      subject,
      message,
    } = req.body;

    /*
    |--------------------------------------------------------------------------
    | Basic Validation
    |--------------------------------------------------------------------------
    */

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message:
          'Name, email, subject and message are required',
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Create Message
    |--------------------------------------------------------------------------
    */

    const newMessage =
      await Message.create({
        name,
        email,
        subject,
        message,
      });

    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

    return res.status(201).json({
      success: true,
      message:
        'Your message has been sent successfully',
      data: newMessage,
    });
  } catch (error) {
    console.error(
      'Create Message Error:',
      error
    );

    /*
    |--------------------------------------------------------------------------
    | Mongoose Validation Error
    |--------------------------------------------------------------------------
    */

    if (
      error.name ===
      'ValidationError'
    ) {
      const validationMessages =
        Object.values(
          error.errors
        ).map(
          (item) => item.message
        );

      return res.status(400).json({
        success: false,
        message:
          validationMessages.join(
            ', '
          ),
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Server Error
    |--------------------------------------------------------------------------
    */

    return res.status(500).json({
      success: false,
      message:
        'Failed to send message',
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET ALL MESSAGES
|--------------------------------------------------------------------------
| GET /api/messages
|
| Admin Dashboard ke liye.
|--------------------------------------------------------------------------
*/

const getAllMessages = async (
  req,
  res
) => {
  try {
    const messages =
      await Message.find()
        .sort({
          createdAt: -1,
        })
        .lean();

    return res.status(200).json({
      success: true,
      message:
        'Messages fetched successfully',
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    console.error(
      'Get All Messages Error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to fetch messages',
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET SINGLE MESSAGE
|--------------------------------------------------------------------------
| GET /api/messages/:id
|--------------------------------------------------------------------------
*/

const getMessageById = async (
  req,
  res
) => {
  try {
    const message =
      await Message.findById(
        req.params.id
      );

    if (!message) {
      return res.status(404).json({
        success: false,
        message:
          'Message not found',
      });
    }

    return res.status(200).json({
      success: true,
      message:
        'Message fetched successfully',
      data: message,
    });
  } catch (error) {
    console.error(
      'Get Message By ID Error:',
      error
    );

    /*
    |--------------------------------------------------------------------------
    | Invalid MongoDB ID
    |--------------------------------------------------------------------------
    */

    if (
      error.name ===
      'CastError'
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid message ID',
      });
    }

    return res.status(500).json({
      success: false,
      message:
        'Failed to fetch message',
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| MARK MESSAGE AS READ
|--------------------------------------------------------------------------
| PATCH /api/messages/:id/read
|--------------------------------------------------------------------------
*/

const markMessageAsRead = async (
  req,
  res
) => {
  try {
    const message =
      await Message.findByIdAndUpdate(
        req.params.id,
        {
          isRead: true,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!message) {
      return res.status(404).json({
        success: false,
        message:
          'Message not found',
      });
    }

    return res.status(200).json({
      success: true,
      message:
        'Message marked as read',
      data: message,
    });
  } catch (error) {
    console.error(
      'Mark Message As Read Error:',
      error
    );

    if (
      error.name ===
      'CastError'
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid message ID',
      });
    }

    return res.status(500).json({
      success: false,
      message:
        'Failed to mark message as read',
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| MARK MESSAGE AS UNREAD
|--------------------------------------------------------------------------
| PATCH /api/messages/:id/unread
|--------------------------------------------------------------------------
*/

const markMessageAsUnread =
  async (req, res) => {
    try {
      const message =
        await Message.findByIdAndUpdate(
          req.params.id,
          {
            isRead: false,
          },
          {
            new: true,
            runValidators: true,
          }
        );

      if (!message) {
        return res.status(404).json({
          success: false,
          message:
            'Message not found',
        });
      }

      return res.status(200).json({
        success: true,
        message:
          'Message marked as unread',
        data: message,
      });
    } catch (error) {
      console.error(
        'Mark Message As Unread Error:',
        error
      );

      if (
        error.name ===
        'CastError'
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Invalid message ID',
        });
      }

      return res.status(500).json({
        success: false,
        message:
          'Failed to mark message as unread',
        error: error.message,
      });
    }
  };

/*
|--------------------------------------------------------------------------
| UPDATE MESSAGE
|--------------------------------------------------------------------------
| PATCH /api/messages/:id
|
| Admin notes / reply status / read status update karne ke liye.
|--------------------------------------------------------------------------
*/

const updateMessage = async (
  req,
  res
) => {
  try {
    const {
      isRead,
      isReplied,
      adminNote,
    } = req.body;

    const updateData = {};

    /*
    |--------------------------------------------------------------------------
    | Allowed Fields
    |--------------------------------------------------------------------------
    */

    if (
      isRead !== undefined
    ) {
      updateData.isRead =
        Boolean(isRead);
    }

    if (
      isReplied !== undefined
    ) {
      updateData.isReplied =
        Boolean(isReplied);
    }

    if (
      adminNote !== undefined
    ) {
      updateData.adminNote =
        String(
          adminNote
        ).trim();
    }

    /*
    |--------------------------------------------------------------------------
    | No Fields
    |--------------------------------------------------------------------------
    */

    if (
      Object.keys(updateData)
        .length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          'No valid fields provided for update',
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Update
    |--------------------------------------------------------------------------
    */

    const message =
      await Message.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!message) {
      return res.status(404).json({
        success: false,
        message:
          'Message not found',
      });
    }

    return res.status(200).json({
      success: true,
      message:
        'Message updated successfully',
      data: message,
    });
  } catch (error) {
    console.error(
      'Update Message Error:',
      error
    );

    if (
      error.name ===
      'CastError'
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid message ID',
      });
    }

    return res.status(500).json({
      success: false,
      message:
        'Failed to update message',
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| DELETE MESSAGE
|--------------------------------------------------------------------------
| DELETE /api/messages/:id
|--------------------------------------------------------------------------
*/

const deleteMessage = async (
  req,
  res
) => {
  try {
    const message =
      await Message.findByIdAndDelete(
        req.params.id
      );

    if (!message) {
      return res.status(404).json({
        success: false,
        message:
          'Message not found',
      });
    }

    return res.status(200).json({
      success: true,
      message:
        'Message deleted successfully',
      data: {},
    });
  } catch (error) {
    console.error(
      'Delete Message Error:',
      error
    );

    if (
      error.name ===
      'CastError'
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid message ID',
      });
    }

    return res.status(500).json({
      success: false,
      message:
        'Failed to delete message',
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET UNREAD MESSAGE COUNT
|--------------------------------------------------------------------------
| GET /api/messages/unread-count
|
| Admin Dashboard notification badge ke liye.
|--------------------------------------------------------------------------
*/

const getUnreadMessageCount =
  async (req, res) => {
    try {
      const count =
        await Message.countDocuments({
          isRead: false,
        });

      return res.status(200).json({
        success: true,
        message:
          'Unread message count fetched successfully',
        count,
      });
    } catch (error) {
      console.error(
        'Unread Message Count Error:',
        error
      );

      return res.status(500).json({
        success: false,
        message:
          'Failed to fetch unread message count',
        error: error.message,
      });
    }
  };

/*
|--------------------------------------------------------------------------
| EXPORTS
|--------------------------------------------------------------------------
*/

module.exports = {
  createMessage,
  getAllMessages,
  getMessageById,
  markMessageAsRead,
  markMessageAsUnread,
  updateMessage,
  deleteMessage,
  getUnreadMessageCount,
};
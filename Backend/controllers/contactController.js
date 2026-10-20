const Contact = require('../models/Contact');

const { sendEmail } = require('../utils/sendEmail');

// Visitor ka diya hua text email ke HTML me jaata hai — escape na karein to
// koi <script>/<img onerror> ya fake links daal kar admin ko phish kar sakta hai.
const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and message',
      });
    }

    const contact = await Contact.create({ name, email, subject, message });

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully!',
      data: contact,
    });

    // ======================================================
    // EMAIL NOTIFICATION (fire-and-forget)
    // ======================================================
    //
    // Response client ko response bhej diya gaya hai (upar). Email
    // yahan se aage ASYNC bheja jaata hai taaki agar SMTP slow ho ya
    // fail ho jaaye, toh visitor ko response dene me delay ya error
    // na ho. Sirf server console me error log hota hai.
    //
    // ======================================================

    const notifyEmail =
      process.env.ADMIN_NOTIFY_EMAIL || process.env.EMAIL_USER;

    if (notifyEmail) {
      sendEmail({
        to: notifyEmail,
        subject: `New Portfolio Contact: ${String(subject || 'No subject').replace(/[\r\n]+/g, ' ').slice(0, 150)}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto;">
            <h2 style="color:#111;">📩 New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Subject:</strong> ${escapeHtml(subject || '—')}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; background:#f5f5f5; padding:12px; border-radius:6px;">${escapeHtml(message)}</p>
            <hr style="margin:20px 0; border:none; border-top:1px solid #eee;" />
            <p style="font-size:12px; color:#888;">Sent from your portfolio contact form at ${new Date().toLocaleString()}</p>
          </div>
        `,
        text: `New contact form submission\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject || '—'}\nMessage: ${message}`,
      }).catch((error) => {
        console.error('Contact notification email failed:', error.message);
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Admin (protected)
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: 'Contacts fetched successfully',
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single contact message
// @route   GET /api/contact/:id
// @access  Admin (protected)
const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contact fetched successfully',
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Mark message as read
// @route   PUT /api/contact/:id/read
// @access  Admin (protected)
const markAsRead = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message marked as read',
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete contact message
// @route   DELETE /api/contact/:id
// @access  Admin (protected)
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully',
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createContact,
  getAllContacts,
  getContactById,
  markAsRead,
  deleteContact,
};
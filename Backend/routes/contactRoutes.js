const express = require('express');
const router = express.Router();
const {
  createContact,
  getAllContacts,
  getContactById,
  markAsRead,
  deleteContact,
} = require('../controllers/contactController');

// @route   POST /api/contact
router.post('/', createContact);

// @route   GET /api/contact
router.get('/', getAllContacts);

// @route   GET /api/contact/:id
router.get('/:id', getContactById);

// @route   PUT /api/contact/:id/read
router.put('/:id/read', markAsRead);

// @route   DELETE /api/contact/:id
router.delete('/:id', deleteContact);

module.exports = router;
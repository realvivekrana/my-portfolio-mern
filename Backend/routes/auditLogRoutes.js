const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getAuditLogs, cleanupAuditLogs } = require('../controllers/auditLogController');

// @route   GET /api/audit-logs (Protected) — paginated, filterable
router.get('/', protect, getAuditLogs);

// @route   DELETE /api/audit-logs/cleanup?olderThanDays=90 (Protected)
router.delete('/cleanup', protect, cleanupAuditLogs);

module.exports = router;
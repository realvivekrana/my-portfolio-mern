const AuditLog = require('../models/AuditLog');

/*
|--------------------------------------------------------------------------
| GET /api/audit-logs
|--------------------------------------------------------------------------
|
| Query params:
|   page          (default 1)
|   limit         (default 20, max 100)
|   resourceType  (optional filter — 'Project', 'Certificate', etc.)
|   action        (optional filter — 'create' | 'update' | 'delete' | ...)
|
*/

const getAuditLogs = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.resourceType) {
      filter.resourceType = req.query.resourceType;
    }

    if (req.query.action) {
      filter.action = req.query.action;
    }

    const [logs, total] = await Promise.all([
      AuditLog.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AuditLog.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      message: 'Audit logs fetched successfully',
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| DELETE /api/audit-logs/cleanup
|--------------------------------------------------------------------------
|
| Purani logs saaf karne ke liye. Query param `olderThanDays` (default 90)
| se pehle ki saari logs delete kar deta hai.
|
*/

const cleanupAuditLogs = async (req, res) => {
  try {
    const olderThanDays = Math.max(parseInt(req.query.olderThanDays, 10) || 90, 1);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    const result = await AuditLog.deleteMany({ createdAt: { $lt: cutoffDate } });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} purani audit logs delete ho gayi (${olderThanDays} din se purani)`,
      data: { deletedCount: result.deletedCount },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getAuditLogs, cleanupAuditLogs };
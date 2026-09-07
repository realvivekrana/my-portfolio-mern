const mongoose = require('mongoose');

/*
|--------------------------------------------------------------------------
| Audit Log Model
|--------------------------------------------------------------------------
|
| Har admin action (create/update/delete/reorder/publish/unpublish) yahan
| record hota hai — kisne, kab, kya change kiya. Sirf read/append hota hai,
| kabhi edit nahi hota.
|
*/

const auditLogSchema = new mongoose.Schema(
  {
    // Kis admin ne action kiya
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },

    adminUsername: {
      type: String,
      trim: true,
      default: 'Unknown',
    },

    // create | update | delete | reorder | publish | unpublish
    action: {
      type: String,
      required: true,
      enum: ['create', 'update', 'delete', 'reorder', 'publish', 'unpublish'],
    },

    // Kis resource type par action hua — Project, Certificate, BlogPost, Testimonial, Portfolio
    resourceType: {
      type: String,
      required: true,
      trim: true,
    },

    // Us resource ki ID (agar applicable ho — reorder me multiple ho sakte hain)
    resourceId: {
      type: String,
      default: '',
    },

    // Resource ka human-readable label (e.g. project title) — list me dikhane ke liye
    resourceLabel: {
      type: String,
      trim: true,
      default: '',
    },

    // update ke case me changed fields ka before/after diff
    // [{ field: 'title', before: 'Old', after: 'New' }, ...]
    changes: {
      type: [
        {
          field: { type: String },
          before: { type: mongoose.Schema.Types.Mixed },
          after: { type: mongoose.Schema.Types.Mixed },
        },
      ],
      default: [],
    },

    ipAddress: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Sabse recent logs pehle — listing/filtering fast rahe
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ resourceType: 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
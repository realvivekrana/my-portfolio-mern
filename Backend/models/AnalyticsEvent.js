const mongoose = require('mongoose');

/*
|--------------------------------------------------------------------------
| Analytics Event Schema
|--------------------------------------------------------------------------
|
| Ek hi lightweight collection se teen cheezein track hoti hain:
|
|   1. pageview        -> Portfolio par kitni baar visit hua
|   2. project_click    -> Kaun sa project click hua (view / github / live)
|   3. resume_download  -> Resume kitni baar download hua
|
| Har event ke saath visitorId (localStorage) aur sessionId
| (sessionStorage) bhejte hain, taaki "unique visitors" aur
| "total views" dono calculate ho sakein.
|
|--------------------------------------------------------------------------
*/

const analyticsEventSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['pageview', 'project_click', 'resume_download'],
      required: true,
      index: true,
    },

    // Sirf pageview ke liye — kaunsa page/path visit hua
    path: {
      type: String,
      trim: true,
      default: '',
    },

    // Sirf project_click ke liye — 'view' | 'github' | 'live'
    action: {
      type: String,
      trim: true,
      default: '',
    },

    // Project reference (agar project baad me delete ho jaye
    // tab bhi projectTitle snapshot report mein dikhta rahega)
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
    },

    projectTitle: {
      type: String,
      trim: true,
      default: '',
    },

    visitorId: {
      type: String,
      trim: true,
      default: '',
      index: true,
    },

    sessionId: {
      type: String,
      trim: true,
      default: '',
    },

    referrer: {
      type: String,
      trim: true,
      default: '',
    },

    userAgent: {
      type: String,
      trim: true,
      default: '',
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
| Dashboard summary query mostly "type + date range" aur
| "type + project" par filter karti hai, isliye compound
| indexes yahan add kiye hain.
|
|--------------------------------------------------------------------------
*/

analyticsEventSchema.index({ type: 1, createdAt: -1 });
analyticsEventSchema.index({ type: 1, project: 1 });

module.exports = mongoose.model(
  'AnalyticsEvent',
  analyticsEventSchema
);
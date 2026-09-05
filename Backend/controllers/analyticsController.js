const mongoose = require('mongoose');

const AnalyticsEvent = require('../models/AnalyticsEvent');

/*
|--------------------------------------------------------------------------
| Allowed Values
|--------------------------------------------------------------------------
*/

const ALLOWED_TYPES = [
  'pageview',
  'project_click',
  'resume_download',
];

const ALLOWED_ACTIONS = [
  'view',
  'github',
  'live',
  '',
];

/*
|--------------------------------------------------------------------------
| TRACK EVENT
|--------------------------------------------------------------------------
| @route   POST /api/analytics/track
| @access  Public
|
| Frontend se visitor ke actions yahan bheje jaate hain:
|   - pageview        (portfolio page load hua)
|   - project_click    (project ka view/github/live click hua)
|   - resume_download  (visitor ne resume download kiya)
|
| Ye endpoint kabhi bhi UI ko todna nahi chahiye, isliye
| validation fail hone par bhi hum sirf ek soft error return
| karte hain — kabhi throw / crash nahi karte.
|--------------------------------------------------------------------------
*/

const trackEvent = async (
  req,
  res
) => {
  try {
    const {
      type,
      path,
      projectId,
      projectTitle,
      action,
      visitorId,
      sessionId,
      referrer,
    } = req.body || {};

    if (!ALLOWED_TYPES.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid analytics event type.',
      });
    }

    const safeAction = ALLOWED_ACTIONS.includes(action)
      ? action
      : '';

    let projectRef = null;

    if (
      projectId &&
      mongoose.Types.ObjectId.isValid(projectId)
    ) {
      projectRef = projectId;
    }

    await AnalyticsEvent.create({
      type,

      path:
        typeof path === 'string'
          ? path.slice(0, 300)
          : '',

      action: safeAction,

      project: projectRef,

      projectTitle:
        typeof projectTitle === 'string'
          ? projectTitle.slice(0, 150)
          : '',

      visitorId:
        typeof visitorId === 'string'
          ? visitorId.slice(0, 100)
          : '',

      sessionId:
        typeof sessionId === 'string'
          ? sessionId.slice(0, 100)
          : '',

      referrer:
        typeof referrer === 'string'
          ? referrer.slice(0, 300)
          : '',

      userAgent: req.headers['user-agent']
        ? String(req.headers['user-agent']).slice(0, 300)
        : '',
    });

    return res.status(201).json({
      success: true,
    });
  } catch (error) {
    console.error(
      'Track Analytics Event Error:',
      error
    );

    // Analytics kabhi bhi visitor ke experience ko break nahi karni chahiye.
    return res.status(200).json({
      success: false,
      message: 'Failed to record analytics event.',
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET ANALYTICS SUMMARY
|--------------------------------------------------------------------------
| @route   GET /api/analytics/summary?days=14
| @access  Protected Admin
|
| Admin Dashboard ke "Analytics" tab ke liye:
|   - totals            (page views, unique visitors, resume downloads, project clicks)
|   - dailyTrend        (last N days: views + resume downloads, chart ke liye)
|   - topProjects       (sabse zyada click hue projects, chart ke liye)
|--------------------------------------------------------------------------
*/

const getAnalyticsSummary = async (
  req,
  res
) => {
  try {
    const requestedDays = parseInt(
      req.query.days,
      10
    );

    const days = Number.isFinite(requestedDays)
      ? Math.min(Math.max(requestedDays, 1), 90)
      : 14;

    const since = new Date();
    since.setHours(0, 0, 0, 0);
    since.setDate(since.getDate() - (days - 1));

    /*
    |--------------------------------------------------------------------------
    | Totals (all-time)
    |--------------------------------------------------------------------------
    */

    const [
      totalPageViews,
      totalResumeDownloads,
      totalProjectClicks,
      uniqueVisitorIds,
    ] = await Promise.all([
      AnalyticsEvent.countDocuments({
        type: 'pageview',
      }),

      AnalyticsEvent.countDocuments({
        type: 'resume_download',
      }),

      AnalyticsEvent.countDocuments({
        type: 'project_click',
      }),

      AnalyticsEvent.distinct('visitorId', {
        visitorId: { $nin: [null, ''] },
      }),
    ]);

    /*
    |--------------------------------------------------------------------------
    | Daily Trend (last N days)
    |--------------------------------------------------------------------------
    */

    const dailyTrendRaw = await AnalyticsEvent.aggregate([
      {
        $match: {
          createdAt: { $gte: since },
          type: { $in: ['pageview', 'resume_download'] },
        },
      },
      {
        $group: {
          _id: {
            date: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$createdAt',
              },
            },
            type: '$type',
          },
          count: { $sum: 1 },
        },
      },
    ]);

    const dateList = [];

    for (let i = 0; i < days; i += 1) {
      const d = new Date(since);
      d.setDate(d.getDate() + i);
      dateList.push(d.toISOString().slice(0, 10));
    }

    const dailyTrend = dateList.map((date) => {
      const viewsEntry = dailyTrendRaw.find(
        (r) =>
          r._id.date === date &&
          r._id.type === 'pageview'
      );

      const downloadsEntry = dailyTrendRaw.find(
        (r) =>
          r._id.date === date &&
          r._id.type === 'resume_download'
      );

      return {
        date,
        views: viewsEntry ? viewsEntry.count : 0,
        resumeDownloads: downloadsEntry
          ? downloadsEntry.count
          : 0,
      };
    });

    /*
    |--------------------------------------------------------------------------
    | Top Projects (all-time, by total clicks)
    |--------------------------------------------------------------------------
    */

    const topProjectsRaw = await AnalyticsEvent.aggregate([
      {
        $match: { type: 'project_click' },
      },
      {
        $group: {
          _id: {
            projectId: '$project',
            title: '$projectTitle',
          },
          totalClicks: { $sum: 1 },
          liveClicks: {
            $sum: {
              $cond: [{ $eq: ['$action', 'live'] }, 1, 0],
            },
          },
          githubClicks: {
            $sum: {
              $cond: [{ $eq: ['$action', 'github'] }, 1, 0],
            },
          },
          viewClicks: {
            $sum: {
              $cond: [{ $eq: ['$action', 'view'] }, 1, 0],
            },
          },
        },
      },
      { $sort: { totalClicks: -1 } },
      { $limit: 8 },
    ]);

    const topProjects = topProjectsRaw.map((p) => ({
      projectId: p._id.projectId,
      title: p._id.title || 'Untitled Project',
      totalClicks: p.totalClicks,
      liveClicks: p.liveClicks,
      githubClicks: p.githubClicks,
      viewClicks: p.viewClicks,
    }));

    return res.status(200).json({
      success: true,
      data: {
        totals: {
          totalPageViews,
          uniqueVisitors: uniqueVisitorIds.length,
          totalResumeDownloads,
          totalProjectClicks,
        },
        dailyTrend,
        topProjects,
        rangeDays: days,
      },
    });
  } catch (error) {
    console.error(
      'Get Analytics Summary Error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics summary.',
      error: error.message,
    });
  }
};

module.exports = {
  trackEvent,
  getAnalyticsSummary,
};
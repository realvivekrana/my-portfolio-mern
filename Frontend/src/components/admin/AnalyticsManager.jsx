import { useEffect, useState } from 'react';

import {
  FaEye,
  FaUsers,
  FaDownload,
  FaMousePointer,
  FaSyncAlt,
  FaGithub,
  FaExternalLinkAlt,
} from 'react-icons/fa';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

import { toast } from 'react-toastify';

import API from '../../utils/axios';
import Loader from '../ui/Loader';

/*
|--------------------------------------------------------------------------
| Analytics Manager
|--------------------------------------------------------------------------
|
| Admin Dashboard > Analytics tab.
|
| Ye component GET /api/analytics/summary se data leta hai aur
| dikhata hai:
|
|   - Total page views / unique visitors / resume downloads / project clicks
|   - Pichhle N dino ka trend (line chart)
|   - Sabse zyada click hue projects (bar chart)
|
|--------------------------------------------------------------------------
*/

const RANGE_OPTIONS = [
  { label: '7 Days', value: 7 },
  { label: '14 Days', value: 14 },
  { label: '30 Days', value: 30 },
  { label: '90 Days', value: 90 },
];

function AnalyticsManager() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [rangeDays, setRangeDays] = useState(14);

  /*
  |--------------------------------------------------------------------------
  | FETCH ANALYTICS SUMMARY
  |--------------------------------------------------------------------------
  */

  const fetchSummary = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError('');

      const response = await API.get(
        `/analytics/summary?days=${rangeDays}`
      );

      setSummary(response.data?.data || null);
    } catch (fetchError) {
      console.error(
        'Fetch Analytics Summary Error:',
        fetchError
      );

      setError(
        fetchError.response?.data?.message ||
          'Failed to load analytics data.'
      );

      if (isManualRefresh) {
        toast.error('Failed to refresh analytics.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rangeDays]);

  /*
  |--------------------------------------------------------------------------
  | LOADING STATE
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader text="Loading analytics..." />
      </div>
    );
  }

  const totals = summary?.totals || {
    totalPageViews: 0,
    uniqueVisitors: 0,
    totalResumeDownloads: 0,
    totalProjectClicks: 0,
  };

  const dailyTrend = summary?.dailyTrend || [];
  const topProjects = summary?.topProjects || [];

  /*
  |--------------------------------------------------------------------------
  | FORMAT TREND DATA FOR CHART (short date labels)
  |--------------------------------------------------------------------------
  */

  const chartData = dailyTrend.map((entry) => {
    const dateObj = new Date(entry.date);

    return {
      ...entry,
      label: dateObj.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
      }),
    };
  });

  const statCards = [
    {
      key: 'views',
      label: 'Total Page Views',
      value: totals.totalPageViews,
      icon: <FaEye />,
      bg: 'bg-indigo-50 dark:bg-indigo-500/10',
      text: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      key: 'visitors',
      label: 'Unique Visitors',
      value: totals.uniqueVisitors,
      icon: <FaUsers />,
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      text: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      key: 'resume',
      label: 'Resume Downloads',
      value: totals.totalResumeDownloads,
      icon: <FaDownload />,
      bg: 'bg-yellow-50 dark:bg-yellow-500/10',
      text: 'text-yellow-600 dark:text-yellow-400',
    },
    {
      key: 'clicks',
      label: 'Project Clicks',
      value: totals.totalProjectClicks,
      icon: <FaMousePointer />,
      bg: 'bg-red-50 dark:bg-red-500/10',
      text: 'text-red-600 dark:text-red-400',
    },
  ];

  return (
    <section>
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
            Visitor Insights 📊
          </p>

          <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white">
            Analytics & Visitor Insights
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400">
            Portfolio ke page views, resume downloads aur sabse
            popular projects yahan track karein.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={rangeDays}
            onChange={(event) =>
              setRangeDays(Number(event.target.value))
            }
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm focus:border-indigo-400 focus:outline-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
          >
            {RANGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => fetchSummary(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
          >
            <FaSyncAlt
              className={refreshing ? 'animate-spin' : ''}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </div>
      )}

      {/* =====================================================
          STAT CARDS
      ====================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.key}
            className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {card.label}
                </p>

                <p className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white">
                  {card.value}
                </p>
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.bg} ${card.text}`}
              >
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* =====================================================
          DAILY TREND CHART
      ====================================================== */}

      <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-5">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Visitor Trend
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Page views aur resume downloads — pichhle{' '}
            {rangeDays} din.
          </p>
        </div>

        {chartData.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
            Abhi tak koi data nahi hai. Portfolio share karna
            shuru karein!
          </p>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  className="dark:opacity-10"
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '0.75rem',
                    border: '1px solid #e5e7eb',
                    fontSize: '0.85rem',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '0.8rem' }} />
                <Line
                  type="monotone"
                  dataKey="views"
                  name="Page Views"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="resumeDownloads"
                  name="Resume Downloads"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* =====================================================
          TOP PROJECTS CHART
      ====================================================== */}

      <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mb-5">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Most Clicked Projects
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Sabse zyada view / GitHub / live-demo click hue
            projects (all-time).
          </p>
        </div>

        {topProjects.length === 0 ? (
          <p className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">
            Abhi tak koi project click track nahi hua.
          </p>
        ) : (
          <>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topProjects}
                  layout="vertical"
                  margin={{ left: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                  />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tick={{ fontSize: 12 }}
                    stroke="#9ca3af"
                  />
                  <YAxis
                    type="category"
                    dataKey="title"
                    width={160}
                    tick={{ fontSize: 12 }}
                    stroke="#9ca3af"
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '0.75rem',
                      border: '1px solid #e5e7eb',
                      fontSize: '0.85rem',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '0.8rem' }} />
                  <Bar
                    dataKey="viewClicks"
                    name="Views"
                    stackId="a"
                    fill="#6366f1"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="liveClicks"
                    name="Live Demo"
                    stackId="a"
                    fill="#10b981"
                  />
                  <Bar
                    dataKey="githubClicks"
                    name="GitHub"
                    stackId="a"
                    fill="#6b7280"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Simple table breakdown */}

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[420px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                    <th className="pb-2 font-semibold">
                      Project
                    </th>
                    <th className="pb-2 font-semibold">
                      <FaEye className="inline" /> Views
                    </th>
                    <th className="pb-2 font-semibold">
                      <FaExternalLinkAlt className="inline" />{' '}
                      Live
                    </th>
                    <th className="pb-2 font-semibold">
                      <FaGithub className="inline" /> GitHub
                    </th>
                    <th className="pb-2 font-semibold">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topProjects.map((project) => (
                    <tr
                      key={
                        project.projectId ||
                        project.title
                      }
                      className="border-b border-gray-100 text-gray-700 last:border-0 dark:border-gray-900 dark:text-gray-300"
                    >
                      <td className="py-2.5 font-medium text-gray-900 dark:text-white">
                        {project.title}
                      </td>
                      <td className="py-2.5">
                        {project.viewClicks}
                      </td>
                      <td className="py-2.5">
                        {project.liveClicks}
                      </td>
                      <td className="py-2.5">
                        {project.githubClicks}
                      </td>
                      <td className="py-2.5 font-bold text-indigo-600 dark:text-indigo-400">
                        {project.totalClicks}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default AnalyticsManager;
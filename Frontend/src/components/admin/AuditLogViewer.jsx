import { useEffect, useState } from 'react';

import { toast } from 'react-toastify';

import {
  FaHistory,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSort,
  FaEye,
  FaEyeSlash,
  FaChevronDown,
  FaChevronRight,
  FaFilter,
  FaBroom,
  FaUserCircle,
} from 'react-icons/fa';

import API from '../../utils/axios';

/*
|--------------------------------------------------------------------------
| Action → Badge Styling
|--------------------------------------------------------------------------
*/

const ACTION_META = {
  create: {
    label: 'Created',
    icon: <FaPlus />,
    className:
      'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400',
  },
  update: {
    label: 'Updated',
    icon: <FaEdit />,
    className:
      'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
  },
  delete: {
    label: 'Deleted',
    icon: <FaTrash />,
    className:
      'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400',
  },
  reorder: {
    label: 'Reordered',
    icon: <FaSort />,
    className:
      'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400',
  },
  publish: {
    label: 'Published',
    icon: <FaEye />,
    className:
      'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
  },
  unpublish: {
    label: 'Unpublished',
    icon: <FaEyeSlash />,
    className:
      'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  },
};

const RESOURCE_TYPES = [
  'Project',
  'Certificate',
  'BlogPost',
  'Testimonial',
  'Portfolio',
];

const ACTIONS = ['create', 'update', 'delete', 'reorder', 'publish', 'unpublish'];

/*
|--------------------------------------------------------------------------
| Relative Time Formatter
|--------------------------------------------------------------------------
*/

const formatRelativeTime = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/*
|--------------------------------------------------------------------------
| Value Formatter (for before/after diff display)
|--------------------------------------------------------------------------
*/

const formatValue = (value) => {
  if (value === null || value === undefined || value === '') {
    return <span className="italic text-gray-400">empty</span>;
  }

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }

  if (Array.isArray(value)) {
    return value.length ? value.join(', ') : <span className="italic text-gray-400">empty</span>;
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  const str = String(value);

  return str.length > 80 ? `${str.slice(0, 80)}…` : str;
};

/*
|--------------------------------------------------------------------------
| Single Log Row
|--------------------------------------------------------------------------
*/

function LogRow({ log }) {
  const [expanded, setExpanded] = useState(false);

  const meta = ACTION_META[log.action] || {
    label: log.action,
    icon: <FaHistory />,
    className: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  };

  const hasChanges = Array.isArray(log.changes) && log.changes.length > 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${meta.className}`}
          >
            {meta.icon}
            {meta.label}
          </span>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
              {log.resourceType}
              {log.resourceLabel ? ` — ${log.resourceLabel}` : ''}
            </p>

            <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <FaUserCircle className="text-[13px]" />
              <span>{log.adminUsername || 'Unknown'}</span>
              <span>•</span>
              <span title={new Date(log.createdAt).toLocaleString('en-IN')}>
                {formatRelativeTime(log.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {hasChanges && (
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {expanded ? <FaChevronDown /> : <FaChevronRight />}
            {log.changes.length} field{log.changes.length === 1 ? '' : 's'} changed
          </button>
        )}
      </div>

      {expanded && hasChanges && (
        <div className="mt-3 space-y-2 border-t border-gray-100 pt-3 dark:border-gray-800">
          {log.changes.map((change, index) => (
            <div
              key={`${log._id}-change-${index}`}
              className="grid grid-cols-1 gap-1 rounded-lg bg-gray-50 p-3 text-xs dark:bg-gray-950 sm:grid-cols-[120px_1fr_auto_1fr]"
            >
              <span className="font-bold text-gray-700 dark:text-gray-200">
                {change.field}
              </span>

              <span className="text-red-500 line-through decoration-red-300">
                {formatValue(change.before)}
              </span>

              <span className="hidden text-gray-400 sm:inline">→</span>

              <span className="font-semibold text-green-600 dark:text-green-400">
                {formatValue(change.after)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Audit Log Viewer
|--------------------------------------------------------------------------
*/

function AuditLogViewer() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });

  const [resourceType, setResourceType] = useState('');
  const [action, setAction] = useState('');

  const [cleaning, setCleaning] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Fetch Logs
  |--------------------------------------------------------------------------
  */

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError('');

      const params = { page, limit: 20 };

      if (resourceType) params.resourceType = resourceType;
      if (action) params.action = action;

      const response = await API.get('/audit-logs', { params });

      setLogs(response.data?.data || []);
      setPagination(
        response.data?.pagination || { totalPages: 1, total: 0 }
      );
    } catch (err) {
      console.error('Audit Log Fetch Error:', err);

      setError(
        err?.response?.data?.message || 'Failed to load audit logs.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, resourceType, action]);

  /*
  |--------------------------------------------------------------------------
  | Filter Change — reset to page 1
  |--------------------------------------------------------------------------
  */

  const handleFilterChange = (setter) => (event) => {
    setter(event.target.value);
    setPage(1);
  };

  /*
  |--------------------------------------------------------------------------
  | Cleanup Old Logs
  |--------------------------------------------------------------------------
  */

  const handleCleanup = async () => {
    const confirmed = window.confirm(
      '90 din se purani saari audit logs permanently delete ho jayengi. Continue karein?'
    );

    if (!confirmed) return;

    try {
      setCleaning(true);

      const response = await API.delete('/audit-logs/cleanup', {
        params: { olderThanDays: 90 },
      });

      toast.success(
        response.data?.message || 'Old audit logs cleaned up.'
      );

      setPage(1);
      fetchLogs();
    } catch (err) {
      console.error('Audit Log Cleanup Error:', err);

      toast.error(
        err?.response?.data?.message || 'Failed to clean up audit logs.'
      );
    } finally {
      setCleaning(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-900 dark:bg-white/10 dark:text-white">
              <FaHistory />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Audit Log
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Kisne, kab, kya change kiya — poora admin activity history.
                {pagination.total > 0 && ` ${pagination.total} entries total.`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCleanup}
            disabled={cleaning}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <FaBroom />
            {cleaning ? 'Cleaning...' : 'Clean Up (90d+)'}
          </button>
        </div>

        {/* Filters */}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
            <FaFilter className="text-xs" />
            Filters:
          </div>

          <select
            value={resourceType}
            onChange={handleFilterChange(setResourceType)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
          >
            <option value="">All Resource Types</option>
            {RESOURCE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            value={action}
            onChange={handleFilterChange(setAction)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
          >
            <option value="">All Actions</option>
            {ACTIONS.map((item) => (
              <option key={item} value={item}>
                {ACTION_META[item]?.label || item}
              </option>
            ))}
          </select>

          {(resourceType || action) && (
            <button
              type="button"
              onClick={() => {
                setResourceType('');
                setAction('');
                setPage(1);
              }}
              className="text-sm font-semibold text-gray-500 underline hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Clear filters
            </button>
          )}
        </div>

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
            {error}
          </div>
        )}
      </div>

      {/* Log List */}

      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900 dark:border-gray-700 dark:border-t-white" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Loading audit logs...
            </span>
          </div>
        </div>
      ) : logs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center dark:border-gray-700 dark:bg-gray-900">
          <FaHistory className="mx-auto text-3xl text-gray-400" />
          <h3 className="mt-3 font-bold text-gray-900 dark:text-white">
            No audit logs yet
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Admin actions (create, update, delete, reorder, publish) will show up here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <LogRow key={log._id} log={log} />
          ))}
        </div>
      )}

      {/* Pagination */}

      {!loading && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page <= 1}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            Previous
          </button>

          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Page {page} of {pagination.totalPages}
          </span>

          <button
            type="button"
            onClick={() =>
              setPage((prev) => Math.min(pagination.totalPages, prev + 1))
            }
            disabled={page >= pagination.totalPages}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default AuditLogViewer;
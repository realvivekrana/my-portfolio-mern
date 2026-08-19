import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FaLock,
  FaShieldAlt,
  FaArrowRight,
} from 'react-icons/fa';

import { useAuth } from '../context/AuthContext';

function AdminPin() {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const inputRef = useRef(null);

  const {
    admin,
    verifyPin,
    logout,
  } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!admin) {
      navigate('/admin/login', {
        replace: true,
      });
    }
  }, [admin, navigate]);

  const handlePinChange = (e) => {
    const value = e.target.value;

    if (/^\d{0,4}$/.test(value)) {
      setPin(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (pin.length !== 4) {
      toast.error('Please enter your 4-digit PIN');
      return;
    }

    setLoading(true);

    try {
      await verifyPin(pin);

      toast.success('PIN verified successfully!');

      navigate('/admin/dashboard', {
        replace: true,
      });
    } catch (err) {
      setPin('');

      const message =
        err.response?.data?.message ||
        'Invalid PIN. Please try again.';

      toast.error(message);

      inputRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();

    navigate('/admin/login', {
      replace: true,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6 transition-colors duration-500 dark:bg-gray-950">

      <div className="w-full max-w-md">

        {/* Security Icon */}

        <div className="mb-8 text-center">

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 shadow-sm dark:bg-indigo-500/10 dark:text-indigo-400">
            <FaShieldAlt className="text-2xl" />
          </div>

          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
            Additional Security
          </p>

          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Admin Verification
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-500 dark:text-gray-400">
            Enter your 4-digit security PIN to access the admin dashboard.
          </p>
        </div>

        {/* PIN Card */}

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-gray-200 bg-white p-7 shadow-xl shadow-gray-200/40 dark:border-gray-800 dark:bg-gray-900 dark:shadow-none sm:p-8"
        >

          {/* Logged in user */}

          <div className="mb-6 flex items-center gap-3 rounded-2xl bg-gray-50 p-4 dark:bg-gray-950">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              <FaLock />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Signed in as
              </p>

              <p className="truncate text-sm font-bold text-gray-900 dark:text-white">
                {admin?.username || admin?.email || 'Admin'}
              </p>
            </div>

          </div>

          {/* PIN Input */}

          <div>
            <label
              htmlFor="admin-pin"
              className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              4-Digit PIN
            </label>

            <input
              ref={inputRef}
              id="admin-pin"
              type="password"
              inputMode="numeric"
              autoComplete="off"
              maxLength={4}
              value={pin}
              onChange={handlePinChange}
              placeholder="••••"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-4 text-center text-3xl font-bold tracking-[0.6em] text-gray-900 outline-none transition-all duration-200 placeholder:tracking-[0.4em] placeholder:text-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-700"
            />

            <p className="mt-2 text-center text-xs text-gray-400 dark:text-gray-500">
              Enter exactly 4 digits
            </p>
          </div>

          {/* Verify */}

          <button
            type="submit"
            disabled={loading || pin.length !== 4}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Verifying...
              </>
            ) : (
              <>
                Verify PIN
                <FaArrowRight className="text-sm" />
              </>
            )}
          </button>

          {/* Logout */}

          <button
            type="button"
            onClick={handleLogout}
            className="mt-4 w-full rounded-xl py-3 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            Use a different account
          </button>
        </form>

      </div>
    </div>
  );
}

export default AdminPin;
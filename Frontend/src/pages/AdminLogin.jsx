import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FaLock,
  FaShieldAlt,
  FaArrowLeft,
} from 'react-icons/fa';

import { useAuth } from '../context/AuthContext';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    setLoading(true);

    try {
      await login(email, password);

      toast.success('Login successful!');

      navigate('/admin/pin');
    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Login failed. Please try again.';

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToPortfolio = () => {
    navigate('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-10 transition-colors duration-500 dark:bg-gray-950">

      <div className="w-full max-w-md">

        {/* Back to Portfolio */}

        <button
          type="button"
          onClick={handleBackToPortfolio}
          className="group mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors duration-200 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
        >
          <FaArrowLeft className="transition-transform duration-200 group-hover:-translate-x-1" />

          Back to Portfolio
        </button>

        {/* Header */}

        <div className="mb-8 text-center">

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 shadow-sm dark:bg-indigo-500/10 dark:text-indigo-400">
            <FaShieldAlt className="text-2xl" />
          </div>

          <h1 className="mb-2 text-3xl font-extrabold text-gray-900 dark:text-white">
            Admin Login
          </h1>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            Sign in to manage your portfolio
          </p>
        </div>

        {/* Login Form */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-gray-200 bg-white p-7 shadow-xl shadow-gray-200/40 dark:border-gray-800 dark:bg-gray-900 dark:shadow-none sm:p-8"
        >

          {/* Email */}

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Email
            </label>

            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="admin@example.com"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            />
          </div>

          {/* Password */}

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Password
            </label>

            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition-all duration-200 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
            />
          </div>

          {/* Sign In */}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                Signing in...
              </>
            ) : (
              <>
                <FaLock className="text-sm" />

                Sign In
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-400 dark:text-gray-500">
            Protected admin area
          </p>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
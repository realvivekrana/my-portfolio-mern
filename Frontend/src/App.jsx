import {
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminPin from './pages/AdminPin';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

import ProtectedRoute from './components/admin/ProtectedRoute';

import GlobalSpaceBackground from './components/ui/GlobalSpaceBackground';

/*
|--------------------------------------------------------------------------
| App Content
|--------------------------------------------------------------------------
*/

function AppContent() {
  const location =
    useLocation();

  /*
  |--------------------------------------------------------------------------
  | ADMIN ROUTE DETECTION
  |--------------------------------------------------------------------------
  |
  | Admin pages ko public cosmic background se alag rakha gaya hai.
  |
  | Isse:
  |
  | /admin/login
  | /admin/pin
  | /admin/dashboard
  |
  | par GlobalSpaceBackground render nahi hoga.
  |
  |--------------------------------------------------------------------------
  */

  const isAdminRoute =
    location.pathname.startsWith(
      '/admin'
    );

  return (
    <div
      className={`relative min-h-screen overflow-x-hidden ${
        isAdminRoute
          ? 'bg-white text-gray-900 dark:bg-[#050505] dark:text-white'
          : 'bg-black text-white'
      }`}
    >

      {/* =====================================================
          GLOBAL COSMIC BACKGROUND
          -----------------------------------------------------
          Sirf public portfolio ke liye.
      ====================================================== */}

      {!isAdminRoute && (
        <GlobalSpaceBackground />
      )}

      {/* =====================================================
          APPLICATION CONTENT
      ====================================================== */}

      <div
        className={
          isAdminRoute
            ? 'relative z-10 min-h-screen'
            : 'relative z-10'
        }
      >

        <Routes>

          {/* =================================================
              PUBLIC WEBSITE
          ================================================== */}

          <Route
            path="/"
            element={<Home />}
          />

          {/* =================================================
              ADMIN LOGIN
          ================================================== */}

          <Route
            path="/admin/login"
            element={
              <AdminLogin />
            }
          />

          {/* =================================================
              ADMIN PIN
          ================================================== */}

          <Route
            path="/admin/pin"
            element={
              <AdminPin />
            }
          />

          {/* =================================================
              PROTECTED ADMIN DASHBOARD
          ================================================== */}

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* =================================================
              404
          ================================================== */}

          <Route
            path="*"
            element={
              <NotFound />
            }
          />

        </Routes>

      </div>

      {/* =====================================================
          TOAST NOTIFICATIONS
      ====================================================== */}

      <ToastContainer
        position="bottom-right"
        theme="dark"
      />

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| APP
|--------------------------------------------------------------------------
*/

function App() {
  return (
    <AppContent />
  );
}

export default App;
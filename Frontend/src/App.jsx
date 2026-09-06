import { lazy, Suspense } from 'react';

import {
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Public route — sabse zyada visitors yahi hit karte hain,
// isliye eager load rakha hai.
import Home from './pages/Home';

import ProtectedRoute from './components/admin/ProtectedRoute';
import Loader from './components/ui/Loader';

import GlobalSpaceBackground from './components/ui/GlobalSpaceBackground';

/*
|--------------------------------------------------------------------------
| CODE SPLITTING — ADMIN ROUTES
|--------------------------------------------------------------------------
|
| Admin Login / Pin / Dashboard sirf portfolio owner use karta hai,
| public visitors kabhi nahi. AdminDashboard khud hi sabse bada
| bundle hai (200KB+) — isko lazy-load karne se public visitors ke
| initial page load me yeh JS bilkul download hi nahi hota, jo
| Lighthouse Performance score ko sabse zyada improve karta hai.
|
|--------------------------------------------------------------------------
*/

const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminPin = lazy(() => import('./pages/AdminPin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));

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

        <Suspense fallback={<Loader fullScreen text="Loading..." />}>
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
        </Suspense>

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
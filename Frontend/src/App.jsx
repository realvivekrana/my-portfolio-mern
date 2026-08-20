import { Routes, Route } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminPin from './pages/AdminPin';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

import ProtectedRoute from './components/admin/ProtectedRoute';

import GlobalSpaceBackground from './components/ui/GlobalSpaceBackground';

function App() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black text-white">

      {/* =====================================================
          GLOBAL COSMIC / SOLAR SYSTEM BACKGROUND
          -----------------------------------------------------
          Public portfolio ke liye common animated background.
          Admin pages ko is animation se alag rakha gaya hai.
      ====================================================== */}

      <GlobalSpaceBackground />

      {/* =====================================================
          APPLICATION CONTENT
      ====================================================== */}

      <div className="relative z-10">

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
            element={<AdminLogin />}
          />

          {/* =================================================
              ADMIN PIN
          ================================================== */}

          <Route
            path="/admin/pin"
            element={<AdminPin />}
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
            element={<NotFound />}
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

export default App;
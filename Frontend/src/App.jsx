import { Routes, Route } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminPin from './pages/AdminPin';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

import ProtectedRoute from './components/admin/ProtectedRoute';

function App() {
  return (
    <>
      <Routes>

        {/* Public Website */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* Admin Login */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* Admin PIN */}

        <Route
          path="/admin/pin"
          element={<AdminPin />}
        />

        {/* Protected Admin Dashboard */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* 404 */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>

      <ToastContainer
        position="bottom-right"
        theme="dark"
      />
    </>
  );
}

export default App;
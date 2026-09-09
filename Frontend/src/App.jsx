import { lazy, Suspense } from 'react';

import {
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';

import { AnimatePresence } from 'framer-motion';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Public route — sabse zyada visitors yahi hit karte hain,
// isliye eager load rakha hai.
import Home from './pages/Home';

import ProtectedRoute from './components/admin/ProtectedRoute';
import Loader from './components/ui/Loader';

import GlobalSpaceBackground from './components/ui/GlobalSpaceBackground';

import PageTransition, {
  FadeOnlyTransition,
} from './components/ui/PageTransition';

import CommandPalette from './components/ui/CommandPalette';
import PWAInstallPrompt from './components/ui/PWAInstallPrompt';

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
| CODE SPLITTING — NEW PUBLIC ROUTES
|--------------------------------------------------------------------------
|
| Blog archive/post aur project case-study pages home page ke baad
| hi visit hote hain, isliye inko bhi lazy-load rakha gaya hai.
|
|--------------------------------------------------------------------------
*/

const BlogArchive = lazy(() => import('./pages/BlogArchive'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const ProjectCaseStudy = lazy(() => import('./pages/ProjectCaseStudy'));

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
          : 'bg-[#050505] text-white'
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
          <AnimatePresence mode="wait" initial={false}>
            <Routes location={location} key={location.pathname}>

              {/* =================================================
                  PUBLIC WEBSITE
                  -----------------------------------------------
                  Home nests a `position: fixed` Navbar, so it uses
                  the opacity-only FadeOnlyTransition (see
                  PageTransition.jsx) instead of the slide transition
                  — a transform on this wrapper would otherwise
                  briefly break the fixed navbar during the
                  animation.
              ================================================== */}

              <Route
                path="/"
                element={
                  <FadeOnlyTransition>
                    <Home />
                  </FadeOnlyTransition>
                }
              />

              {/* =================================================
                  BLOG ARCHIVE
              ================================================== */}

              <Route
                path="/blog"
                element={
                  <PageTransition>
                    <BlogArchive />
                  </PageTransition>
                }
              />

              {/* =================================================
                  SINGLE BLOG POST
              ================================================== */}

              <Route
                path="/blog/:slug"
                element={
                  <PageTransition>
                    <BlogPost />
                  </PageTransition>
                }
              />

              {/* =================================================
                  PROJECT CASE STUDY
              ================================================== */}

              <Route
                path="/projects/:slug"
                element={
                  <PageTransition>
                    <ProjectCaseStudy />
                  </PageTransition>
                }
              />

              {/* =================================================
                  ADMIN LOGIN
              ================================================== */}

              <Route
                path="/admin/login"
                element={
                  <PageTransition>
                    <AdminLogin />
                  </PageTransition>
                }
              />

              {/* =================================================
                  ADMIN PIN
              ================================================== */}

              <Route
                path="/admin/pin"
                element={
                  <PageTransition>
                    <AdminPin />
                  </PageTransition>
                }
              />

              {/* =================================================
                  PROTECTED ADMIN DASHBOARD
                  -----------------------------------------------
                  No page transition here on purpose — the
                  dashboard has its own internal fixed sidebar/topbar
                  chrome, same reasoning as Home above.
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
                  <PageTransition>
                    <NotFound />
                  </PageTransition>
                }
              />

            </Routes>
          </AnimatePresence>
        </Suspense>

      </div>

      {/* =====================================================
          COMMAND PALETTE (Cmd/Ctrl + K)
      ====================================================== */}

      <CommandPalette />

      {/* =====================================================
          PWA INSTALL PROMPT
      ====================================================== */}

      <PWAInstallPrompt />

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
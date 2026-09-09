/*
|--------------------------------------------------------------------------
| SERVICE WORKER REGISTRATION
|--------------------------------------------------------------------------
|
| Registers /sw.js once the window has finished loading, so it never
| competes with the initial page render for bandwidth/CPU. No-ops
| safely in dev (Vite's dev server + HMR don't play nicely with an
| active SW) and in browsers without SW support.
|
|--------------------------------------------------------------------------
*/

export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  // Skip in local dev — avoids stale-cache confusion while iterating
  // with Vite's dev server. Production builds (vite build + preview,
  // or the real deployed site) always register normally.
  if (import.meta.env.DEV) {
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        // Check for an updated service worker on every load so
        // returning visitors eventually pick up new deployments.
        registration.update().catch(() => {});
      })
      .catch((error) => {
        console.warn('Service worker registration failed:', error);
      });
  });
}
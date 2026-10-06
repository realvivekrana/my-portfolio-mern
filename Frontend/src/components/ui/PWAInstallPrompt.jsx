import { useEffect, useState } from 'react';
import { FaDownload, FaTimes } from 'react-icons/fa';

import { useLanguage } from '../../context/LanguageContext';

const DISMISSED_KEY = 'pwaInstallDismissedAt';

// Don't nag again for a week after the visitor dismisses the banner.
const DISMISS_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;

/*
|--------------------------------------------------------------------------
| PWA INSTALL PROMPT
|--------------------------------------------------------------------------
|
| Listens for the browser's `beforeinstallprompt` event (Chrome,
| Edge, Android) and shows a small dismissible banner offering to
| install the portfolio as an app. Safari/iOS don't fire this event
| at all — the banner simply never appears there, which is expected
| (iOS users install via the native Share -> Add to Home Screen flow
| instead).
|
|--------------------------------------------------------------------------
*/

function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const { t } = useLanguage();

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();

      const dismissedAt = Number(
        localStorage.getItem(DISMISSED_KEY) || 0
      );

      const cooledDown =
        Date.now() - dismissedAt > DISMISS_COOLDOWN_MS;

      if (!cooledDown) {
        return;
      }

      setDeferredPrompt(event);
      setIsVisible(true);
    };

    const handleAppInstalled = () => {
      setIsVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener(
      'beforeinstallprompt',
      handleBeforeInstallPrompt
    );

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );

      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();

    await deferredPrompt.userChoice;

    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-x-4 bottom-4 z-[90] mx-auto max-w-sm rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-2xl backdrop-blur-xl dark:border-purple-500/15 dark:bg-[#0b0b12]/95 dark:shadow-[0_8px_40px_rgba(201,162,75,0.15)] sm:inset-x-auto sm:right-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#C9A24B] to-[#9C7A3C] text-white shadow-lg shadow-purple-500/25">
          <FaDownload className="text-sm" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            {t('pwa.installTitle')}
          </p>

          <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
            {t('pwa.installBody')}
          </p>

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handleInstallClick}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-2 text-xs font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#C9A24B] dark:bg-white dark:text-gray-900 dark:hover:bg-purple-400 dark:hover:text-white"
            >
              <FaDownload className="text-[10px]" />
              {t('pwa.installButton')}
            </button>

            <button
              type="button"
              onClick={handleDismiss}
              className="rounded-lg px-3 py-2 text-xs font-semibold text-gray-500 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-200"
            >
              {t('pwa.dismissButton')}
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          aria-label={t('pwa.dismissButton')}
          className="shrink-0 rounded-lg p-1.5 text-gray-400 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-900 dark:hover:text-gray-300"
        >
          <FaTimes className="text-xs" />
        </button>
      </div>
    </div>
  );
}

export default PWAInstallPrompt;
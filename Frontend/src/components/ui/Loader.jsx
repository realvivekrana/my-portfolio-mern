import { useEffect, useState } from 'react';

/*
|--------------------------------------------------------------------------
| Loader
|--------------------------------------------------------------------------
| Full-screen loader used during authentication / protected route loading.
|
| Important:
| - White flash avoid karne ke liye loader background theme-aware hai.
| - Dark mode  -> dark background
| - Light mode -> light background
|--------------------------------------------------------------------------
*/

function Loader({
  fullScreen = false,
  text = 'Loading...',
}) {
  const [isDark, setIsDark] =
    useState(() => {
      if (
        typeof document !==
        'undefined'
      ) {
        return document.documentElement.classList.contains(
          'dark'
        );
      }

      return false;
    });

  /*
  |--------------------------------------------------------------------------
  | Keep Loader In Sync With Theme
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (
      typeof document ===
      'undefined'
    ) {
      return undefined;
    }

    const root =
      document.documentElement;

    const updateTheme = () => {
      setIsDark(
        root.classList.contains(
          'dark'
        )
      );
    };

    updateTheme();

    const observer =
      new MutationObserver(
        updateTheme
      );

    observer.observe(root, {
      attributes: true,
      attributeFilter: [
        'class',
      ],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Background
  |--------------------------------------------------------------------------
  */

  const backgroundClass =
    isDark
      ? 'bg-[#050505] text-white'
      : 'bg-[#f8fafc] text-gray-900';

  /*
  |--------------------------------------------------------------------------
  | Full Screen Loader
  |--------------------------------------------------------------------------
  */

  if (fullScreen) {
    return (
      <div
        className={`fixed inset-0 z-[99999] flex min-h-screen w-full items-center justify-center transition-colors duration-200 ${backgroundClass}`}
      >
        <div className="flex flex-col items-center justify-center">

          {/* Spinner */}

          <div
            className={`h-10 w-10 animate-spin rounded-full border-4 ${
              isDark
                ? 'border-white/10 border-t-white'
                : 'border-gray-200 border-t-gray-900'
            }`}
          />

          {/* Loading Text */}

          {text && (
            <p
              className={`mt-4 text-sm font-medium ${
                isDark
                  ? 'text-gray-400'
                  : 'text-gray-600'
              }`}
            >
              {text}
            </p>
          )}

        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Normal Loader
  |--------------------------------------------------------------------------
  */

  return (
    <div
      className={`flex items-center justify-center p-6 ${backgroundClass}`}
    >
      <div className="flex flex-col items-center justify-center">

        <div
          className={`h-8 w-8 animate-spin rounded-full border-4 ${
            isDark
              ? 'border-white/10 border-t-white'
              : 'border-gray-200 border-t-gray-900'
          }`}
        />

        {text && (
          <p
            className={`mt-3 text-sm font-medium ${
              isDark
                ? 'text-gray-400'
                : 'text-gray-600'
            }`}
          >
            {text}
          </p>
        )}

      </div>
    </div>
  );
}

export default Loader;
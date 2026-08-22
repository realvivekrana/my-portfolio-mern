import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

const ThemeContext = createContext(null);

const THEME_KEY = 'theme';

function getInitialTheme() {
  if (typeof window === 'undefined') {
    return false;
  }

  const savedTheme =
    localStorage.getItem(THEME_KEY);

  if (savedTheme === 'dark') {
    return true;
  }

  if (savedTheme === 'light') {
    return false;
  }

  return window.matchMedia(
    '(prefers-color-scheme: dark)'
  ).matches;
}

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] =
    useState(getInitialTheme);

  useEffect(() => {
    const root =
      document.documentElement;

    /*
    |----------------------------------------------------------------------
    | Apply Theme
    |----------------------------------------------------------------------
    |
    | Important:
    | We DO NOT disable CSS transitions here.
    | This allows the public portfolio to smoothly transition between
    | dark and light mode instead of flashing abruptly.
    |
    */

    if (isDark) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';

      localStorage.setItem(
        THEME_KEY,
        'dark'
      );
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';

      localStorage.setItem(
        THEME_KEY,
        'light'
      );
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(
      (previous) => !previous
    );
  };

  const value = {
    isDark,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider
      value={value}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context =
    useContext(ThemeContext);

  if (!context) {
    throw new Error(
      'useTheme must be used inside a ThemeProvider'
    );
  }

  return context;
}

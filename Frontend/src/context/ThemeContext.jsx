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

  const savedTheme = localStorage.getItem(THEME_KEY);

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
  const [isDark, setIsDark] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;

    /*
      Disable transitions temporarily while applying the
      initial theme. This prevents unwanted animation/flicker
      when the page first loads.
    */
    root.classList.add('theme-transition');

    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
    }

    const transitionTimer = setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 50);

    return () => {
      clearTimeout(transitionTimer);
    };
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((previous) => !previous);
  };

  const value = {
    isDark,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      'useTheme must be used inside a ThemeProvider'
    );
  }

  return context;
}
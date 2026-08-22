import { useEffect, useState } from 'react';

import {
  FaBars,
  FaTimes,
  FaMoon,
  FaSun,
  FaLock,
} from 'react-icons/fa';

import { useTheme } from '../../context/ThemeContext';

const navLinks = [
  {
    name: 'Home',
    href: '#home',
  },
  {
    name: 'About',
    href: '#about',
  },
  {
    name: 'Skills',
    href: '#skills',
  },
  {
    name: 'Experience',
    href: '#experience',
  },
  {
    name: 'Projects',
    href: '#projects',
  },
  {
    name: 'Contact',
    href: '#contact',
  },
];

function Navbar() {
  const { isDark, toggleTheme } = useTheme();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  /* =========================================================
     SCROLL HANDLER
  ========================================================= */

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);

      const sections = navLinks
        .map((link) => document.querySelector(link.href))
        .filter(Boolean);

      let currentSection = 'home';

      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 150;

        if (window.scrollY >= sectionTop) {
          currentSection = section.id;
        }
      });

      setActiveSection(currentSection);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  /* =========================================================
     MOBILE MENU BODY SCROLL LOCK
  ========================================================= */

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  /* =========================================================
     CLOSE MOBILE MENU WHEN SCREEN BECOMES DESKTOP
  ========================================================= */

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const handleNavigation = (href) => {
    const target = document.querySelector(href);

    if (!target) {
      setIsMobileMenuOpen(false);
      return;
    }

    const navbarOffset = 90;

    const targetPosition =
      target.getBoundingClientRect().top +
      window.scrollY -
      navbarOffset;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth',
    });

    setIsMobileMenuOpen(false);
  };

  /* =========================================================
     HOME / LOGO
  ========================================================= */

  const handleLogoClick = () => {
    handleNavigation('#home');
  };

  /* =========================================================
     THEME
  ========================================================= */

  const handleThemeToggle = () => {
    toggleTheme();
  };

  /* =========================================================
     ADMIN
  ========================================================= */

  const handleAdminClick = () => {
    setIsMobileMenuOpen(false);
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>
      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <header
        className={`fixed inset-x-0 top-0 z-50 px-3 transition-all duration-500 sm:px-4 md:px-6 ${
          isScrolled
            ? 'pt-2 sm:pt-3'
            : 'pt-3 sm:pt-4'
        }`}
      >
        <nav
          className={`mx-auto flex w-full max-w-7xl items-center justify-between rounded-2xl border transition-all duration-500 ${
            isScrolled
              ? 'border-gray-200/80 bg-white/90 px-3 py-2.5 shadow-lg shadow-gray-900/5 backdrop-blur-xl dark:border-gray-800/80 dark:bg-gray-950/90 dark:shadow-black/20 sm:px-5 sm:py-3'
              : 'border-gray-200/60 bg-white/70 px-3 py-2.5 backdrop-blur-lg dark:border-gray-800/60 dark:bg-gray-950/70 sm:px-5 sm:py-3'
          }`}
        >
          {/* =================================================
              LOGO
          ================================================== */}

          <button
            type="button"
            onClick={handleLogoClick}
            aria-label="Go to home"
            className="group flex min-w-0 shrink-0 items-center gap-2.5 sm:gap-3"
          >
            {/* Logo Box */}

            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-sm font-extrabold text-white shadow-md shadow-indigo-600/20 transition-transform duration-300 group-hover:scale-105 sm:h-10 sm:w-10">
              V
            </span>

            {/* Logo Text */}

            <span className="hidden text-sm font-extrabold tracking-[0.14em] text-gray-900 sm:block dark:text-white">
              VIVEK RANA
            </span>
          </button>

          {/* =================================================
              DESKTOP NAVIGATION
          ================================================== */}

          <div className="hidden items-center gap-0.5 lg:flex xl:gap-1">
            {navLinks.map((link) => {
              const sectionId = link.href.replace('#', '');
              const isActive =
                activeSection === sectionId;

              return (
                <button
                  key={link.name}
                  type="button"
                  onClick={() =>
                    handleNavigation(link.href)
                  }
                  className={`relative rounded-xl px-2.5 py-2 text-sm font-semibold transition-all duration-300 xl:px-3.5 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white'
                  }`}
                >
                  {link.name}

                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* =================================================
              DESKTOP ACTIONS
          ================================================== */}

          <div className="hidden items-center gap-1.5 lg:flex">
            {/* Theme Toggle */}

            <button
              type="button"
              onClick={handleThemeToggle}
              aria-label={
                isDark
                  ? 'Switch to light mode'
                  : 'Switch to dark mode'
              }
              title={
                isDark
                  ? 'Switch to light mode'
                  : 'Switch to dark mode'
              }
              className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-indigo-500/30 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
            >
              {isDark ? (
                <FaSun className="text-sm text-yellow-400 transition-transform duration-300 group-hover:rotate-45" />
              ) : (
                <FaMoon className="text-sm transition-transform duration-300 group-hover:-rotate-12" />
              )}
            </button>

            {/* Admin */}

            <a
              href="/admin/login"
              aria-label="Admin Login"
              title="Admin Login"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-bold text-gray-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-indigo-500/30 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
            >
              <FaLock className="text-xs" />
              <span>Admin</span>
            </a>
          </div>

          {/* =================================================
              MOBILE MENU BUTTON
          ================================================== */}

          <button
            type="button"
            onClick={() =>
              setIsMobileMenuOpen(
                (previous) => !previous
              )
            }
            aria-label={
              isMobileMenuOpen
                ? 'Close navigation menu'
                : 'Open navigation menu'
            }
            aria-expanded={isMobileMenuOpen}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700 transition-all duration-300 hover:bg-gray-200 active:scale-95 lg:hidden dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {isMobileMenuOpen ? (
              <FaTimes className="text-base" />
            ) : (
              <FaBars className="text-base" />
            )}
          </button>
        </nav>

        {/* =====================================================
            MOBILE MENU
        ====================================================== */}

        <div
          className={`mx-auto mt-2 w-full max-w-7xl overflow-hidden rounded-2xl border border-gray-200/80 bg-white/95 shadow-xl shadow-gray-900/10 backdrop-blur-xl transition-all duration-300 dark:border-gray-800/80 dark:bg-gray-950/95 dark:shadow-black/30 lg:hidden ${
            isMobileMenuOpen
              ? 'max-h-[calc(100vh-90px)] translate-y-0 opacity-100'
              : 'pointer-events-none max-h-0 -translate-y-2 opacity-0'
          }`}
        >
          <div className="max-h-[calc(100vh-90px)] overflow-y-auto overscroll-contain p-3 sm:p-4">

            {/* =================================================
                MOBILE NAV LINKS
            ================================================== */}

            <div className="space-y-1">
              {navLinks.map((link) => {
                const sectionId =
                  link.href.replace('#', '');

                const isActive =
                  activeSection === sectionId;

                return (
                  <button
                    key={link.name}
                    type="button"
                    onClick={() =>
                      handleNavigation(link.href)
                    }
                    className={`flex min-h-11 w-full items-center rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all duration-300 active:scale-[0.99] ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {link.name}
                  </button>
                );
              })}
            </div>

            {/* =================================================
                DIVIDER
            ================================================== */}

            <div className="my-3 h-px bg-gray-200 dark:bg-gray-800" />

            {/* =================================================
                THEME
            ================================================== */}

            <button
              type="button"
              onClick={handleThemeToggle}
              aria-label={
                isDark
                  ? 'Switch to light mode'
                  : 'Switch to dark mode'
              }
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-2 text-sm font-semibold text-gray-700 transition-all duration-300 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 active:scale-[0.98] dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-indigo-500/30 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
            >
              {isDark ? (
                <>
                  <FaSun className="text-yellow-400" />
                  <span>Switch to Light Mode</span>
                </>
              ) : (
                <>
                  <FaMoon />
                  <span>Switch to Dark Mode</span>
                </>
              )}
            </button>

            {/* =================================================
                ADMIN ACCESS
            ================================================== */}

            <a
              href="/admin/login"
              onClick={handleAdminClick}
              className="mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-700 transition-all duration-300 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 active:scale-[0.99] dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-indigo-500/30 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
            >
              <FaLock className="text-xs" />
              Admin Access
            </a>
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;
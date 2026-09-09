import { useEffect, useState } from 'react';

import {
  FaBars,
  FaTimes,
  FaMoon,
  FaSun,
  FaLock,
  FaLanguage,
} from 'react-icons/fa';

import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

function useNavLinks(t) {
  return [
    {
      key: 'home',
      name: t('nav.home'),
      href: '#home',
    },
    {
      key: 'about',
      name: t('nav.about'),
      href: '#about',
    },
    {
      key: 'skills',
      name: t('nav.skills'),
      href: '#skills',
    },
    {
      key: 'experience',
      name: t('nav.experience'),
      href: '#experience',
    },
    {
      key: 'projects',
      name: t('nav.projects'),
      href: '#projects',
    },
    {
      key: 'contact',
      name: t('nav.contact'),
      href: '#contact',
    },
  ];
}

function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  const navLinks = useNavLinks(t);

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
              ? 'border-gray-200/80 bg-white/90 px-3 py-2.5 shadow-lg shadow-gray-900/5 backdrop-blur-xl dark:border-purple-500/15 dark:bg-[#0b0b12]/90 dark:shadow-[0_8px_32px_rgba(139,92,246,0.12)] sm:px-5 sm:py-3'
              : 'border-gray-200/60 bg-white/70 px-3 py-2.5 backdrop-blur-lg dark:border-white/[0.08] dark:bg-[#0b0b12]/70 sm:px-5 sm:py-3'
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

            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#3B82F6] text-sm font-extrabold text-white shadow-md shadow-[#8B5CF6]/30 transition-transform duration-300 group-hover:scale-105 sm:h-10 sm:w-10">
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
                  key={link.key}
                  type="button"
                  onClick={() =>
                    handleNavigation(link.href)
                  }
                  className={`relative rounded-xl px-2.5 py-2 text-sm font-semibold transition-all duration-300 xl:px-3.5 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 dark:bg-purple-500/10 dark:text-purple-300'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white'
                  }`}
                >
                  {link.name}

                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-indigo-600 dark:bg-gradient-to-r dark:from-purple-400 dark:to-blue-400" />
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
              aria-label={t('theme.dark')}
              title={
                isDark ? t('theme.light') : t('theme.dark')
              }
              className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-purple-500/40 dark:hover:bg-purple-500/10 dark:hover:text-purple-300"
            >
              {isDark ? (
                <FaSun className="text-sm text-yellow-400 transition-transform duration-300 group-hover:rotate-45" />
              ) : (
                <FaMoon className="text-sm transition-transform duration-300 group-hover:-rotate-12" />
              )}
            </button>

            {/* Language Toggle */}

            <button
              type="button"
              onClick={toggleLanguage}
              aria-label={t('language.switchTo')}
              title={t('language.switchTo')}
              className="group flex h-10 shrink-0 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-2.5 text-xs font-bold text-gray-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-purple-500/40 dark:hover:bg-purple-500/10 dark:hover:text-purple-300"
            >
              <FaLanguage className="text-sm" />
              <span className="uppercase">
                {language === 'en' ? 'हिं' : 'EN'}
              </span>
            </button>

            {/* Admin */}

            <a
              href="/admin/login"
              aria-label="Admin Login"
              title="Admin Login"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-bold text-gray-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-purple-500/40 dark:hover:bg-purple-500/10 dark:hover:text-purple-300"
            >
              <FaLock className="text-xs" />
              <span>{t('nav.admin')}</span>
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
          className={`mx-auto mt-2 w-full max-w-7xl overflow-hidden rounded-2xl border border-gray-200/80 bg-white/95 shadow-xl shadow-gray-900/10 backdrop-blur-xl transition-all duration-300 dark:border-purple-500/15 dark:bg-[#0b0b12]/95 dark:shadow-[0_8px_40px_rgba(139,92,246,0.15)] lg:hidden ${
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
                    key={link.key}
                    type="button"
                    onClick={() =>
                      handleNavigation(link.href)
                    }
                    className={`flex min-h-11 w-full items-center rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all duration-300 active:scale-[0.99] ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-600 dark:bg-purple-500/10 dark:text-purple-300'
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

            <div className="my-3 h-px bg-gray-200 dark:bg-white/[0.08]" />

            {/* =================================================
                THEME
            ================================================== */}

            <button
              type="button"
              onClick={handleThemeToggle}
              aria-label={
                isDark ? t('theme.light') : t('theme.dark')
              }
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-2 text-sm font-semibold text-gray-700 transition-all duration-300 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 active:scale-[0.98] dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-purple-500/40 dark:hover:bg-purple-500/10 dark:hover:text-purple-300"
            >
              {isDark ? (
                <>
                  <FaSun className="text-yellow-400" />
                  <span>{t('theme.switchToLight')}</span>
                </>
              ) : (
                <>
                  <FaMoon />
                  <span>{t('theme.switchToDark')}</span>
                </>
              )}
            </button>

            {/* =================================================
                MOBILE LANGUAGE TOGGLE
            ================================================== */}

            <button
              type="button"
              onClick={toggleLanguage}
              className="mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-2 text-sm font-semibold text-gray-700 transition-all duration-300 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 active:scale-[0.98] dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-purple-500/40 dark:hover:bg-purple-500/10 dark:hover:text-purple-300"
            >
              <FaLanguage />
              <span>
                {language === 'en'
                  ? 'हिंदी में देखें'
                  : 'View in English'}
              </span>
            </button>

            {/* =================================================
                ADMIN ACCESS
            ================================================== */}

            <a
              href="/admin/login"
              onClick={handleAdminClick}
              className="mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-700 transition-all duration-300 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 active:scale-[0.99] dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-purple-500/40 dark:hover:bg-purple-500/10 dark:hover:text-purple-300"
            >
              <FaLock className="text-xs" />
              {t('nav.admin')} Access
            </a>
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useNavigate, useLocation } from 'react-router-dom';

import {
  FaHome,
  FaUser,
  FaCode,
  FaBriefcase,
  FaEnvelope,
  FaMoon,
  FaSun,
  FaLanguage,
  FaFileAlt,
  FaRegNewspaper,
  FaLock,
  FaSearch,
} from 'react-icons/fa';

import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

/*
|--------------------------------------------------------------------------
| COMMAND PALETTE (Cmd/Ctrl + K)
|--------------------------------------------------------------------------
|
| A Linear/Vercel-style quick-navigation overlay. Press Cmd+K (Mac)
| or Ctrl+K (Windows/Linux) anywhere in the app to open it, type to
| filter, use Arrow Up/Down + Enter to select, Esc to close.
|
| Section commands ("Go to Projects" etc.) work from ANY route: if
| we're already on the home page they scroll directly; otherwise
| they navigate to "/" first and set the URL hash, and Home.jsx's
| hash-scroll effect finishes the job once that section has mounted.
|
|--------------------------------------------------------------------------
*/

function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const inputRef = useRef(null);
  const listRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const { isDark, toggleTheme } = useTheme();
  const { toggleLanguage, t } = useLanguage();

  /* =========================================================
     GO TO SECTION (works from any route)
  ========================================================= */

  const goToSection = useCallback(
    (sectionId) => {
      if (location.pathname === '/') {
        const target = document.getElementById(sectionId);

        if (target) {
          const navbarOffset = 90;

          const targetPosition =
            target.getBoundingClientRect().top +
            window.scrollY -
            navbarOffset;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth',
          });

          return;
        }
      }

      // Not on home (or section not mounted yet) — navigate home
      // with the section in the hash; Home.jsx picks this up and
      // scrolls once the lazy section has rendered.
      navigate(`/#${sectionId}`);
    },
    [location.pathname, navigate]
  );

  /* =========================================================
     COMMAND LIST
  ========================================================= */

  const commands = useMemo(
    () => [
      {
        id: 'go-home',
        group: t('commandPalette.groupNavigation'),
        label: t('commandPalette.goToHome'),
        icon: FaHome,
        keywords: 'home top',
        action: () => goToSection('home'),
      },
      {
        id: 'go-about',
        group: t('commandPalette.groupNavigation'),
        label: t('commandPalette.goToAbout'),
        icon: FaUser,
        keywords: 'about me who',
        action: () => goToSection('about'),
      },
      {
        id: 'go-skills',
        group: t('commandPalette.groupNavigation'),
        label: t('commandPalette.goToSkills'),
        icon: FaCode,
        keywords: 'skills tech stack technologies',
        action: () => goToSection('skills'),
      },
      {
        id: 'go-experience',
        group: t('commandPalette.groupNavigation'),
        label: t('commandPalette.goToExperience'),
        icon: FaBriefcase,
        keywords: 'experience career work job',
        action: () => goToSection('experience'),
      },
      {
        id: 'go-projects',
        group: t('commandPalette.groupNavigation'),
        label: t('commandPalette.goToProjects'),
        icon: FaCode,
        keywords: 'projects work case studies portfolio',
        action: () => goToSection('projects'),
      },
      {
        id: 'go-contact',
        group: t('commandPalette.groupNavigation'),
        label: t('commandPalette.goToContact'),
        icon: FaEnvelope,
        keywords: 'contact email message reach out',
        action: () => goToSection('contact'),
      },
      {
        id: 'open-blog',
        group: t('commandPalette.groupNavigation'),
        label: t('commandPalette.openBlog'),
        icon: FaRegNewspaper,
        keywords: 'blog articles posts writing',
        action: () => navigate('/blog'),
      },
      {
        id: 'toggle-theme',
        group: t('commandPalette.groupActions'),
        label: t('commandPalette.toggleTheme'),
        icon: isDark ? FaSun : FaMoon,
        keywords: 'theme dark light mode toggle',
        action: () => toggleTheme(),
      },
      {
        id: 'toggle-language',
        group: t('commandPalette.groupActions'),
        label: t('commandPalette.toggleLanguage'),
        icon: FaLanguage,
        keywords: 'language hindi english hi en toggle',
        action: () => toggleLanguage(),
      },
      {
        id: 'view-resume',
        group: t('commandPalette.groupActions'),
        label: t('commandPalette.viewResume'),
        icon: FaFileAlt,
        keywords: 'resume cv download view',
        action: () => {
          const footerResumeButton = document.querySelector(
            '#footer button'
          );

          if (location.pathname === '/') {
            goToSection('footer');
          } else {
            navigate('/#footer');
          }

          // Nudge the visitor toward the resume card in the footer;
          // clicking "View" itself still requires a deliberate tap
          // since it opens a new tab (browsers block that from here).
          window.setTimeout(() => {
            footerResumeButton?.focus();
          }, 500);
        },
      },
      {
        id: 'admin-login',
        group: t('commandPalette.groupActions'),
        label: t('commandPalette.adminLogin'),
        icon: FaLock,
        keywords: 'admin login dashboard owner',
        action: () => navigate('/admin/login'),
      },
    ],
    [t, isDark, goToSection, navigate, toggleTheme, toggleLanguage, location.pathname]
  );

  const filteredCommands = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return commands;
    }

    return commands.filter((command) =>
      `${command.label} ${command.keywords}`
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [commands, query]);

  /* =========================================================
     OPEN / CLOSE
  ========================================================= */

  const closePalette = useCallback(() => {
    setIsOpen(false);
    setQuery('');
    setActiveIndex(0);
  }, []);

  const runCommand = useCallback(
    (command) => {
      if (!command) {
        return;
      }

      closePalette();
      command.action();
    },
    [closePalette]
  );

  /* =========================================================
     GLOBAL KEYBOARD SHORTCUT
  ========================================================= */

  useEffect(() => {
    const handleKeyDown = (event) => {
      const isModifierPressed = event.metaKey || event.ctrlKey;

      if (isModifierPressed && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsOpen((previous) => !previous);
        return;
      }

      if (event.key === 'Escape' && isOpen) {
        event.preventDefault();
        closePalette();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closePalette]);

  /* =========================================================
     FOCUS INPUT ON OPEN + LOCK BODY SCROLL
  ========================================================= */

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';

      // Wait a tick for the overlay to mount before focusing.
      const focusTimeout = window.setTimeout(() => {
        inputRef.current?.focus();
      }, 10);

      return () => {
        window.clearTimeout(focusTimeout);
      };
    }

    document.body.style.overflow = '';

    return undefined;
  }, [isOpen]);

  /* =========================================================
     RESET ACTIVE INDEX WHEN QUERY CHANGES
  ========================================================= */

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  /* =========================================================
     ARROW KEY NAVIGATION
  ========================================================= */

  const handleInputKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();

      setActiveIndex((previous) =>
        filteredCommands.length === 0
          ? 0
          : (previous + 1) % filteredCommands.length
      );
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();

      setActiveIndex((previous) =>
        filteredCommands.length === 0
          ? 0
          : (previous - 1 + filteredCommands.length) %
            filteredCommands.length
      );
    } else if (event.key === 'Enter') {
      event.preventDefault();
      runCommand(filteredCommands[activeIndex]);
    }
  };

  /* =========================================================
     SCROLL ACTIVE ITEM INTO VIEW
  ========================================================= */

  useEffect(() => {
    if (!listRef.current) {
      return;
    }

    const activeElement = listRef.current.querySelector(
      `[data-index="${activeIndex}"]`
    );

    activeElement?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  if (!isOpen) {
    return null;
  }

  /* =========================================================
     GROUP COMMANDS FOR DISPLAY
  ========================================================= */

  let runningIndex = -1;

  const groups = filteredCommands.reduce((accumulator, command) => {
    const existingGroup = accumulator.find(
      (group) => group.name === command.group
    );

    if (existingGroup) {
      existingGroup.items.push(command);
    } else {
      accumulator.push({ name: command.group, items: [command] });
    }

    return accumulator;
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm"
      onClick={closePalette}
      role="presentation"
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-950"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        {/* Search Input */}

        <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3.5 dark:border-gray-800">
          <FaSearch className="shrink-0 text-sm text-gray-400" />

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder={t('commandPalette.placeholder')}
            className="w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-white dark:placeholder:text-gray-500"
            autoComplete="off"
            spellCheck="false"
          />

          <kbd className="hidden shrink-0 rounded-md border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] font-semibold text-gray-500 sm:inline-block dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
            Esc
          </kbd>
        </div>

        {/* Results */}

        <div
          ref={listRef}
          className="max-h-[60vh] overflow-y-auto p-2"
        >
          {filteredCommands.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              {t('commandPalette.noResults')}
            </p>
          ) : (
            groups.map((group) => (
              <div key={group.name} className="mb-2 last:mb-0">
                <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-600">
                  {group.name}
                </p>

                {group.items.map((command) => {
                  runningIndex += 1;

                  const currentIndex = runningIndex;
                  const isActive = currentIndex === activeIndex;
                  const Icon = command.icon;

                  return (
                    <button
                      key={command.id}
                      type="button"
                      data-index={currentIndex}
                      onClick={() => runCommand(command)}
                      onMouseEnter={() => setActiveIndex(currentIndex)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors duration-100 ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-600 dark:bg-purple-500/10 dark:text-purple-300'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <Icon className="shrink-0 text-sm opacity-70" />
                      <span>{command.label}</span>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer Hints */}

        <div className="flex items-center justify-end gap-4 border-t border-gray-200 px-4 py-2.5 text-[11px] text-gray-400 dark:border-gray-800 dark:text-gray-500">
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 dark:border-gray-700 dark:bg-gray-900">
              ↑↓
            </kbd>
            {t('commandPalette.hint')}
          </span>

          <span className="flex items-center gap-1">
            <kbd className="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 dark:border-gray-700 dark:bg-gray-900">
              ↵
            </kbd>
            {t('commandPalette.hintSelect')}
          </span>

          <span className="flex items-center gap-1">
            <kbd className="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 dark:border-gray-700 dark:bg-gray-900">
              Esc
            </kbd>
            {t('commandPalette.hintClose')}
          </span>
        </div>
      </div>
    </div>
  );
}

export default CommandPalette;
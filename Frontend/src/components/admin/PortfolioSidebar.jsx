import {
  FaChartPie,
  FaUser,
  FaCode,
  FaBriefcase,
  FaGraduationCap,
  FaCertificate,
  FaProjectDiagram,
  FaEnvelope,
  FaFilePdf,
  FaSearch,
  FaCog,
  FaSignOutAlt,
  FaTimes,
} from 'react-icons/fa';

/*
|--------------------------------------------------------------------------
| Portfolio Admin Sidebar
|--------------------------------------------------------------------------
|
| This sidebar is designed for the Portfolio CMS.
|
| Sections:
|
| Overview
| Portfolio
|   ├── Hero
|   ├── About
|   ├── Skills
|   ├── Experience
|   ├── Education
|   ├── Certifications
|   └── SEO
| Projects
| Messages
| Resume
| Settings
|
|--------------------------------------------------------------------------
*/

const portfolioItems = [
  {
    id: 'hero',
    label: 'Hero',
    icon: FaUser,
  },
  {
    id: 'about',
    label: 'About',
    icon: FaUser,
  },
  {
    id: 'skills',
    label: 'Skills',
    icon: FaCode,
  },
  {
    id: 'experience',
    label: 'Experience',
    icon: FaBriefcase,
  },
  {
    id: 'education',
    label: 'Education',
    icon: FaGraduationCap,
  },
  {
    id: 'certifications',
    label: 'Certifications',
    icon: FaCertificate,
  },
  {
    id: 'seo',
    label: 'SEO',
    icon: FaSearch,
  },
];

function PortfolioSidebar({
  activeSection = 'overview',
  onSectionChange,
  onLogout,
  isOpen = true,
  onClose,
}) {
  /*
  |--------------------------------------------------------------------------
  | Navigation Handler
  |--------------------------------------------------------------------------
  */

  const handleNavigation = (section) => {
    if (onSectionChange) {
      onSectionChange(section);
    }

    /*
    |--------------------------------------------------------------------------
    | Close sidebar on mobile after navigation
    |--------------------------------------------------------------------------
    */

    if (onClose) {
      onClose();
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Active Item Classes
  |--------------------------------------------------------------------------
  */

  const getItemClasses = (section) => {
    const isActive = activeSection === section;

    return `
      group
      flex
      min-h-11
      w-full
      items-center
      gap-3
      rounded-xl
      px-3
      py-2.5
      text-left
      text-sm
      font-semibold
      transition-all
      duration-200
      ${
        isActive
          ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
      }
    `;
  };

  return (
    <>
      {/* =====================================================
          MOBILE OVERLAY
      ====================================================== */}

      {isOpen && (
        <button
          type="button"
          aria-label="Close admin sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className={`
          fixed
          bottom-0
          left-0
          top-0
          z-50
          flex
          w-[280px]
          max-w-[85vw]
          flex-col
          border-r
          border-gray-200
          bg-white
          shadow-xl
          transition-transform
          duration-300
          dark:border-gray-800
          dark:bg-gray-950
          lg:sticky
          lg:z-auto
          lg:h-screen
          lg:w-64
          lg:max-w-none
          lg:shadow-none
          ${
            isOpen
              ? 'translate-x-0'
              : '-translate-x-full lg:translate-x-0'
          }
        `}
      >
        {/* =================================================
            SIDEBAR HEADER
        ================================================== */}

        <div className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-800">

          {/* Logo */}

          <button
            type="button"
            onClick={() =>
              handleNavigation('overview')
            }
            className="flex min-w-0 items-center gap-3"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-sm font-extrabold text-white shadow-md shadow-indigo-600/20">
              V
            </span>

            <div className="min-w-0 text-left">
              <p className="truncate text-sm font-extrabold text-gray-900 dark:text-white">
                VIVEK RANA
              </p>

              <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Portfolio CMS
              </p>
            </div>
          </button>

          {/* Mobile Close */}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 lg:hidden dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
          >
            <FaTimes />
          </button>
        </div>

        {/* =================================================
            SIDEBAR CONTENT
        ================================================== */}

        <div className="flex-1 overflow-y-auto px-3 py-5">

          {/* =================================================
              OVERVIEW
          ================================================== */}

          <div className="mb-6">

            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500">
              Dashboard
            </p>

            <button
              type="button"
              onClick={() =>
                handleNavigation('overview')
              }
              className={getItemClasses(
                'overview'
              )}
            >
              <FaChartPie className="shrink-0 text-sm" />

              <span>Overview</span>
            </button>

          </div>

          {/* =================================================
              PORTFOLIO
          ================================================== */}

          <div className="mb-6">

            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500">
              Portfolio
            </p>

            <div className="space-y-1">

              {portfolioItems.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      handleNavigation(
                        item.id
                      )
                    }
                    className={getItemClasses(
                      item.id
                    )}
                  >
                    <Icon className="shrink-0 text-sm" />

                    <span>{item.label}</span>
                  </button>
                );
              })}

            </div>

          </div>

          {/* =================================================
              MANAGEMENT
          ================================================== */}

          <div className="mb-6">

            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500">
              Management
            </p>

            <div className="space-y-1">

              {/* Projects */}

              <button
                type="button"
                onClick={() =>
                  handleNavigation(
                    'projects'
                  )
                }
                className={getItemClasses(
                  'projects'
                )}
              >
                <FaProjectDiagram className="shrink-0 text-sm" />

                <span>Projects</span>
              </button>

              {/* Messages */}

              <button
                type="button"
                onClick={() =>
                  handleNavigation(
                    'messages'
                  )
                }
                className={getItemClasses(
                  'messages'
                )}
              >
                <FaEnvelope className="shrink-0 text-sm" />

                <span>Messages</span>
              </button>

              {/* Resume */}

              <button
                type="button"
                onClick={() =>
                  handleNavigation(
                    'resume'
                  )
                }
                className={getItemClasses(
                  'resume'
                )}
              >
                <FaFilePdf className="shrink-0 text-sm" />

                <span>Resume</span>
              </button>

            </div>

          </div>

          {/* =================================================
              SETTINGS
          ================================================== */}

          <div>

            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500">
              System
            </p>

            <button
              type="button"
              onClick={() =>
                handleNavigation(
                  'settings'
                )
              }
              className={getItemClasses(
                'settings'
              )}
            >
              <FaCog className="shrink-0 text-sm" />

              <span>Settings</span>
            </button>

          </div>

        </div>

        {/* =================================================
            SIDEBAR FOOTER
        ================================================== */}

        <div className="shrink-0 border-t border-gray-200 p-3 dark:border-gray-800">

          <button
            type="button"
            onClick={onLogout}
            className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 transition-all duration-200 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
          >
            <FaSignOutAlt className="shrink-0 text-sm" />

            <span>Logout</span>
          </button>

        </div>
      </aside>
    </>
  );
}

export default PortfolioSidebar;
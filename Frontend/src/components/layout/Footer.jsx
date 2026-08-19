import { Link } from 'react-router-dom';
import {
  FaGithub,
  FaLinkedin,
  FaHeart,
  FaArrowUp,
  FaFilePdf,
  FaLock,
} from 'react-icons/fa';

function Footer() {
  const currentYear = new Date().getFullYear();

  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="relative overflow-hidden border-t border-gray-200 bg-white transition-colors duration-500 dark:border-gray-800 dark:bg-gray-950">

      {/* =====================================================
          BACKGROUND DECORATION
      ====================================================== */}

      <div className="pointer-events-none absolute -left-40 top-10 h-72 w-72 rounded-full bg-indigo-100/40 blur-3xl dark:bg-indigo-600/5" />

      <div className="pointer-events-none absolute -right-40 bottom-0 h-72 w-72 rounded-full bg-purple-100/40 blur-3xl dark:bg-purple-600/5" />

      {/* =====================================================
          MAIN FOOTER
      ====================================================== */}

      <div className="relative mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-10">

        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">

          {/* =================================================
              BRAND
          ================================================== */}

          <div className="max-w-md">

            <Link
              to="/"
              className="inline-block text-2xl font-extrabold tracking-tight text-gray-900 transition-colors hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400"
            >
              VIVEK
              <span className="text-indigo-600 dark:text-indigo-400">
                .
              </span>
            </Link>

            <p className="mt-4 text-sm leading-7 text-gray-600 dark:text-gray-400">
              MERN Stack Developer focused on building modern,
              scalable and user-friendly web applications with
              clean code and thoughtful user experiences.
            </p>

            {/* Availability */}

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400">

              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />

                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>

              Open to Work
            </div>

            {/* Social Icons */}

            <div className="mt-6 flex items-center gap-3">

              <a
                href="https://github.com/realvivekrana"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="group flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-600 transition-all duration-300 hover:-translate-y-1 hover:border-gray-900 hover:bg-gray-900 hover:text-white dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-white dark:hover:bg-white dark:hover:text-gray-900"
              >
                <FaGithub className="text-lg transition-transform duration-300 group-hover:scale-110" />
              </a>

              <a
                href="https://www.linkedin.com/in/mrvivekrana/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="group flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-600 transition-all duration-300 hover:-translate-y-1 hover:border-blue-600 hover:bg-blue-600 hover:text-white dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-blue-600 dark:hover:bg-blue-600 dark:hover:text-white"
              >
                <FaLinkedin className="text-lg transition-transform duration-300 group-hover:scale-110" />
              </a>

            </div>
          </div>

          {/* =================================================
              NAVIGATION
          ================================================== */}

          <div>

            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
              Navigation
            </h3>

            <ul className="mt-5 space-y-3">

              <li>
                <a
                  href="#home"
                  className="text-sm text-gray-500 transition-colors hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                >
                  Home
                </a>
              </li>

              <li>
                <a
                  href="#about"
                  className="text-sm text-gray-500 transition-colors hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                >
                  About
                </a>
              </li>

              <li>
                <a
                  href="#skills"
                  className="text-sm text-gray-500 transition-colors hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                >
                  Skills
                </a>
              </li>

              <li>
                <a
                  href="#experience"
                  className="text-sm text-gray-500 transition-colors hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                >
                  Experience
                </a>
              </li>

              <li>
                <a
                  href="#projects"
                  className="text-sm text-gray-500 transition-colors hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                >
                  Projects
                </a>
              </li>

              <li>
                <a
                  href="#contact"
                  className="text-sm text-gray-500 transition-colors hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                >
                  Contact
                </a>
              </li>

            </ul>
          </div>

          {/* =================================================
              RESOURCES
          ================================================== */}

          <div>

            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
              Resources
            </h3>

            <ul className="mt-5 space-y-3">

              <li>
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                >
                  <FaFilePdf className="text-red-500" />

                  View Resume
                </a>
              </li>

              <li>
                <a
                  href="/resume.pdf"
                  download="Vivek-Rana-Resume.pdf"
                  className="group inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                >
                  <FaFilePdf className="text-red-500" />

                  Download Resume
                </a>
              </li>

              <li>
                <a
                  href="#projects"
                  className="text-sm text-gray-500 transition-colors hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                >
                  Featured Projects
                </a>
              </li>

              <li>
                <a
                  href="#contact"
                  className="text-sm text-gray-500 transition-colors hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                >
                  Let's Connect
                </a>
              </li>

            </ul>
          </div>

          {/* =================================================
              CONTACT / ADMIN
          ================================================== */}

          <div>

            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
              Get In Touch
            </h3>

            <p className="mt-5 text-sm leading-6 text-gray-500 dark:text-gray-400">
              Have a project, opportunity or idea?
              Let's build something meaningful together.
            </p>

            <a
              href="#contact"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-700"
            >
              Contact Me
            </a>

            {/* Admin */}

            <div className="mt-7 border-t border-gray-200 pt-5 dark:border-gray-800">

              <Link
                to="/admin/login"
                className="group inline-flex items-center gap-2 text-xs font-medium text-gray-400 transition-colors hover:text-gray-700 dark:text-gray-600 dark:hover:text-gray-400"
              >
                <FaLock className="text-[10px] transition-transform duration-300 group-hover:scale-110" />

                Admin Access
              </Link>

            </div>
          </div>

        </div>

        {/* =====================================================
            DIVIDER
        ====================================================== */}

        <div className="my-10 h-px bg-gray-200 dark:bg-gray-800" />

        {/* =====================================================
            BOTTOM FOOTER
        ====================================================== */}

        <div className="flex flex-col items-center justify-between gap-5 md:flex-row">

          <p className="text-center text-xs text-gray-500 md:text-left dark:text-gray-500">
            © {currentYear} Vivek Kumar Rana. All rights reserved.
          </p>

          <p className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500">
            Designed & built with
            <FaHeart className="text-red-500" />
            using MERN Stack
          </p>

          {/* Back To Top */}

          <button
            type="button"
            onClick={handleScrollTop}
            aria-label="Back to top"
            className="group flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-500 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-indigo-500/30 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
          >
            <FaArrowUp className="transition-transform duration-300 group-hover:-translate-y-0.5" />
          </button>

        </div>

      </div>
    </footer>
  );
}

export default Footer;
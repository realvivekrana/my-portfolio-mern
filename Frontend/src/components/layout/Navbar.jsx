import { useState, useEffect } from 'react';
import { HiMenu, HiX, HiSun, HiMoon } from 'react-icons/hi';
import { useTheme } from '../../context/ThemeContext';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const sections = navLinks.map((link) => link.href.replace('#', ''));
      const scrollPosition = window.scrollY + 150;

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPosition && el.offsetTop + el.offsetHeight > scrollPosition) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm z-50 shadow-lg transition-colors">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#home" className="text-2xl font-bold text-gray-900 dark:text-white">
          Vivek<span className="text-indigo-500">.rana</span>
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const sectionId = link.href.replace('#', '');
            const isActive = activeSection === sectionId;
            return (
              <li key={link.name}>
                <a href={link.href} className={isActive ? 'font-medium text-indigo-500' : 'font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors'}>
                  {link.name}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 text-xl transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <HiSun /> : <HiMoon />}
          </button>

          <button className="md:hidden text-gray-900 dark:text-white text-2xl" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>

      {isOpen && (
        <ul className="md:hidden flex flex-col items-center gap-4 bg-white dark:bg-gray-900 pb-6">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a href={link.href} onClick={handleLinkClick} className="text-gray-600 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors font-medium text-lg">
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}

export default Navbar;
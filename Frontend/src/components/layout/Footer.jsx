import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaTwitter, FaHeart } from 'react-icons/fa';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-8 px-6 transition-colors">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-gray-500 dark:text-gray-500 text-sm text-center md:text-left">
          © {currentYear} Vivek Rana. All rights reserved.
        </p>

        <div className="flex items-center gap-6 text-gray-500 dark:text-gray-400 text-xl">
          <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors" aria-label="GitHub">
            <FaGithub />
          </a>
          <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors" aria-label="LinkedIn">
            <FaLinkedin />
          </a>
          <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors" aria-label="Twitter">
            <FaTwitter />
          </a>
        </div>

        <p className="text-gray-500 dark:text-gray-500 text-sm flex items-center gap-1">
          Made with <FaHeart className="text-red-500" /> using MERN Stack
        </p>
      </div>

      <div className="text-center mt-4">
        <Link to="/admin/login" className="text-gray-300 dark:text-gray-700 hover:text-gray-400 dark:hover:text-gray-500 text-xs transition-colors">
          •
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
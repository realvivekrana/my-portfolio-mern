import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] flex flex-col items-center justify-center px-6 text-center transition-colors">
      <h1 className="text-8xl font-bold text-purple-400 mb-4">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-3">
        Page Not Found
      </h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link
        to="/"
        className="bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] hover:brightness-110 text-white px-6 py-3 rounded-lg font-medium transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}

export default NotFound;
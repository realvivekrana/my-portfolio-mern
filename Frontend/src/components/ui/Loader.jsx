function Loader({ fullScreen = false }) {
  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-gray-300 dark:border-gray-700 border-t-indigo-500 rounded-full animate-spin"></div>
      <p className="text-gray-500 dark:text-gray-400 text-sm">Loading...</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center transition-colors">
        {spinner}
      </div>
    );
  }

  return <div className="py-12 flex items-center justify-center">{spinner}</div>;
}

export default Loader;
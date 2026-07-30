function ErrorFallback() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center">
      <h1 className="mb-4 text-7xl font-bold text-cyan-400">
        Oops!
      </h1>

      <h2 className="mb-4 text-3xl font-semibold text-white">
        Something went wrong.
      </h2>

      <p className="mb-8 max-w-lg text-gray-400">
        An unexpected error occurred while loading the application.
      </p>

      <button
        onClick={() => window.location.reload()}
        className="rounded-lg bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
      >
        Reload Page
      </button>
    </div>
  );
}

export default ErrorFallback;
function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-cyan-400">404</h1>

        <h2 className="mt-4 text-3xl font-semibold">
          Page Not Found
        </h2>

        <p className="mt-2 text-gray-400">
          The page you're looking for doesn't exist.
        </p>
      </div>
    </div>
  );
}

export default NotFound;
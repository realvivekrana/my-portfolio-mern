const filters = ["All", "React", "MERN"];

const ProjectFilter = ({
  activeFilter,
  setActiveFilter,
}) => {
  return (
    <div className="mb-12 flex flex-wrap items-center justify-center gap-4">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => setActiveFilter(filter)}
          className={`rounded-full border px-6 py-3 text-sm font-semibold transition-all duration-300 ${
            activeFilter === filter
              ? "border-cyan-500 bg-cyan-500 text-black shadow-lg shadow-cyan-500/30"
              : "border-slate-700 bg-slate-900 text-white hover:border-cyan-500 hover:bg-slate-800"
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default ProjectFilter;
import { FaCode } from "react-icons/fa";

const ProjectCard = () => {
  return (
    <div className="absolute -right-8 bottom-12 z-20 hidden rounded-2xl border border-cyan-500/20 bg-slate-900/90 p-4 shadow-2xl backdrop-blur-lg lg:block">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-cyan-500 p-3 text-white">
          <FaCode />
        </div>

        <div>
          <h3 className="font-semibold text-white">
            4+ Projects
          </h3>

          <p className="text-sm text-gray-400">
            Completed
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
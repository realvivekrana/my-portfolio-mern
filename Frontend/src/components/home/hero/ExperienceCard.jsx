import { FaBriefcase } from "react-icons/fa";

const ExperienceCard = () => {
  return (
    <div className="absolute -left-8 top-12 z-20 hidden rounded-2xl border border-cyan-500/20 bg-slate-900/90 p-4 shadow-2xl backdrop-blur-lg lg:block">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-cyan-500 p-3 text-white">
          <FaBriefcase />
        </div>

        <div>
          <h3 className="font-semibold text-white">
            1+ Year
          </h3>

          <p className="text-sm text-gray-400">
            Experience
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;
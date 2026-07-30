import { motion } from "framer-motion";
import { FaGraduationCap } from "react-icons/fa";

const EducationCard = ({ education }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-lg"
    >
      <div className="mb-4 flex items-center gap-4">
        <div className="rounded-full bg-cyan-500 p-3 text-white">
          <FaGraduationCap />
        </div>

        <div>
          <h3 className="text-xl font-bold text-white">
            {education.degree}
          </h3>

          <p className="text-cyan-400">
            {education.college}
          </p>
        </div>
      </div>

      <span className="rounded bg-cyan-500/20 px-3 py-1 text-sm text-cyan-400">
        {education.year}
      </span>

      <p className="mt-4 text-gray-400">
        {education.description}
      </p>
    </motion.div>
  );
};

export default EducationCard;
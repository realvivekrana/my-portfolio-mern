import { motion } from "framer-motion";
import { FaBriefcase, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

const ExperienceCard = ({ experience }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-lg transition-all duration-300 hover:border-cyan-500 hover:shadow-cyan-500/20"
    >
      {/* Company & Role */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-white">
          {experience.role}
        </h3>

        <p className="mt-2 text-lg font-semibold text-cyan-400">
          {experience.company}
        </p>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <FaCalendarAlt />
            <span>{experience.duration}</span>
          </div>

          <div className="flex items-center gap-2">
            <FaMapMarkerAlt />
            <span>{experience.location}</span>
          </div>

          <div className="flex items-center gap-2">
            <FaBriefcase />
            <span>{experience.type}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="mb-6 leading-7 text-slate-300">
        {experience.description}
      </p>

      {/* Achievements */}
      <div className="mb-6">
        <h4 className="mb-3 text-lg font-semibold text-white">
          Key Achievements
        </h4>

        <ul className="space-y-2">
          {experience.achievements.map((achievement, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-slate-300"
            >
              <span className="mt-1 text-cyan-400">✔</span>
              <span>{achievement}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Technologies */}
      <div>
        <h4 className="mb-3 text-lg font-semibold text-white">
          Technologies
        </h4>

        <div className="flex flex-wrap gap-3">
          {experience.technologies.map((tech, index) => (
            <span
              key={index}
              className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ExperienceCard;
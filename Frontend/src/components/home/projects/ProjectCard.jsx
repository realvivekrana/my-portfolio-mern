import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const ProjectCard = ({ project, onViewDetails }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg transition-all duration-300 hover:border-cyan-500"
    >
      {/* Image */}
      <div className="group relative overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="h-60 w-full object-cover transition duration-500 group-hover:scale-110"
        />

        <div className="absolute inset-0 flex items-center justify-center bg-black/70 opacity-0 transition duration-300 group-hover:opacity-100">
          <button
            onClick={() => onViewDetails(project)}
            className="rounded-full bg-cyan-500 px-6 py-3 font-semibold text-black transition hover:scale-105"
          >
            View Details
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4 p-6">
        <div>
          <h3 className="mb-2 text-2xl font-bold text-white">
            {project.title}
          </h3>

          <p className="line-clamp-3 text-slate-400">
            {project.description}
          </p>
        </div>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-slate-800 px-3 py-1 text-xs text-cyan-400"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-2">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 transition hover:border-cyan-500"
          >
            <FaGithub />
            GitHub
          </a>

          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 font-medium text-black transition hover:bg-cyan-400"
          >
            <FaExternalLinkAlt />
            Live
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
import { motion } from "framer-motion";
import ExperienceCard from "./ExperienceCard";

const ExperienceTimeline = ({ experiences }) => {
  return (
    <div className="relative mx-auto max-w-5xl">
      {/* Timeline Line */}
      <div className="absolute left-5 top-0 h-full w-1 rounded-full bg-slate-700 md:left-1/2 md:-translate-x-1/2"></div>

      <div className="space-y-16">
        {experiences.map((experience, index) => (
          <div
            key={experience.id}
            className={`relative flex items-center ${
              index % 2 === 0
                ? "md:justify-start"
                : "md:justify-end"
            }`}
          >
            {/* Timeline Dot */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="absolute left-5 z-20 h-5 w-5 -translate-x-1/2 rounded-full border-4 border-slate-950 bg-cyan-500 md:left-1/2"
            />

            {/* Card */}
            <div className="ml-12 w-full md:ml-0 md:w-[45%]">
              <ExperienceCard experience={experience} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExperienceTimeline;
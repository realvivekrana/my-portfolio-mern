import { motion } from "framer-motion";
import profile from "../../../assets/images/profile.jpeg";

import FloatingIcons from "./FloatingIcons";
import ExperienceCard from "./ExperienceCard";
import ProjectCard from "./ProjectCard";

const HeroImage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="relative flex items-center justify-center"
    >
      <div className="absolute h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"></div>

      <div className="absolute h-72 w-72 rounded-full bg-cyan-400/10 blur-2xl"></div>

      <FloatingIcons />
      <ExperienceCard />
      <ProjectCard />

      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.3 }}
        className="relative z-10"
      >
        <div className="animate-pulse rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 p-1">
          <div className="rounded-full bg-slate-900 p-2">
            <img
              src={profile}
              alt="Vivek Rana"
              className="h-[340px] w-[340px] rounded-full border-4 border-slate-800 object-cover shadow-2xl"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HeroImage;
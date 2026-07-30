import { motion } from "framer-motion";
import {
  FaDownload,
  FaEnvelope,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";

const HeroButtons = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="flex flex-wrap items-center gap-4"
    >
      {/* Resume */}
      <a
        href="/resume/Vivek_Rana_Resume.pdf"
        download="Vivek_Rana_Resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 rounded-xl bg-cyan-500 px-7 py-4 font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-1 hover:bg-cyan-400"
      >
        <FaDownload />
        Download Resume
      </a>

      {/* Contact */}
      <a
        href="#contact"
        className="flex items-center gap-2 rounded-xl border border-slate-700 px-7 py-4 font-semibold text-white transition-all duration-300 hover:border-cyan-500 hover:bg-cyan-500/10"
      >
        <FaEnvelope />
        Contact Me
      </a>

      {/* GitHub */}
      <a
        href="https://github.com/realvivekrana"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub Profile"
        className="flex h-14 w-14 items-center justify-center rounded-xl border border-slate-700 text-xl text-white transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500 hover:bg-cyan-500/10 hover:text-cyan-400"
      >
        <FaGithub />
      </a>

      {/* LinkedIn */}
      <a
        href="https://www.linkedin.com/in/mrvivekrana/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn Profile"
        className="flex h-14 w-14 items-center justify-center rounded-xl border border-slate-700 text-xl text-white transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500 hover:bg-cyan-500/10 hover:text-cyan-400"
      >
        <FaLinkedin />
      </a>
    </motion.div>
  );
};

export default HeroButtons;
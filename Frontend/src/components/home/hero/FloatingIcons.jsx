import { motion } from "framer-motion";
import {
  FaReact,
  FaNodeJs,
  FaHtml5,
  FaCss3Alt,
  FaGitAlt,
} from "react-icons/fa";

import {
  SiJavascript,
  SiMongodb,
  SiExpress,
  SiTailwindcss,
} from "react-icons/si";

const icons = [
  {
    Icon: FaReact,
    className: "top-0 left-10 text-cyan-400",
    duration: 5,
  },
  {
    Icon: SiJavascript,
    className: "top-10 right-0 text-yellow-400",
    duration: 6,
  },
  {
    Icon: FaNodeJs,
    className: "bottom-16 right-8 text-green-500",
    duration: 4,
  },
  {
    Icon: SiMongodb,
    className: "bottom-0 left-4 text-green-400",
    duration: 7,
  },
  {
    Icon: SiExpress,
    className: "top-1/2 -left-6 text-gray-300",
    duration: 5,
  },
  {
    Icon: SiTailwindcss,
    className: "top-1/2 -right-6 text-sky-400",
    duration: 6,
  },
  {
    Icon: FaGitAlt,
    className: "bottom-8 left-24 text-orange-500",
    duration: 4,
  },
  {
    Icon: FaHtml5,
    className: "top-24 left-0 text-orange-500",
    duration: 5,
  },
  {
    Icon: FaCss3Alt,
    className: "bottom-4 right-28 text-blue-500",
    duration: 6,
  },
];

const FloatingIcons = () => {
  return (
    <>
      {icons.map(({ Icon, className, duration }, index) => (
        <motion.div
          key={index}
          className={`absolute ${className}`}
          animate={{
            y: [0, -15, 0],
          }}
          transition={{
            duration,
            repeat: Infinity,
          }}
        >
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20 shadow-xl">
            <Icon size={28} />
          </div>
        </motion.div>
      ))}
    </>
  );
};

export default FloatingIcons;
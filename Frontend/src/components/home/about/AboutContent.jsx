import { motion } from "framer-motion";
import {
  FaCode,
  FaMapMarkerAlt,
  FaGraduationCap,
} from "react-icons/fa";

const AboutContent = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      className="space-y-8"
    >
      <div>
        <span className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-400">
          About Me
        </span>

        <h2 className="mt-5 text-5xl font-bold">
          Passionate MERN Stack Developer
        </h2>
      </div>

      <p className="text-lg leading-8 text-gray-400">
        I'm a MERN Stack Developer who enjoys building fast,
        scalable and responsive web applications.
        I love transforming ideas into modern digital products
        with clean UI and efficient backend architecture.
      </p>

      <div className="space-y-5">

        <div className="flex items-center gap-4">
          <FaCode className="text-cyan-400 text-xl" />

          <div>
            <h3 className="font-semibold">
              Experience
            </h3>

            <p className="text-gray-400">
              1 Year MERN Stack Development
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <FaGraduationCap className="text-cyan-400 text-xl" />

          <div>
            <h3 className="font-semibold">
              Education
            </h3>

            <p className="text-gray-400">
              MCA • Amity University Online
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <FaMapMarkerAlt className="text-cyan-400 text-xl" />

          <div>
            <h3 className="font-semibold">
              Location
            </h3>

            <p className="text-gray-400">
              Pune, Maharashtra, India
            </p>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default AboutContent;
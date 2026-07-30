import { motion } from "framer-motion";
import HeroButtons from "./HeroButtons";

const HeroContent = () => {
  return (
    <div className="space-y-7">
      <motion.span
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-block rounded-full border border-cyan-500/30 bg-cyan-500/10 px-5 py-2 text-sm font-medium text-cyan-400"
      >
        👋 Welcome to my Portfolio
      </motion.span>

      <motion.h1
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-5xl font-extrabold leading-tight text-white md:text-6xl"
      >
        Hi, I'm{" "}
        <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
          Vivek Rana
        </span>
      </motion.h1>

      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-semibold text-gray-300"
      >
        MERN Stack Developer
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-xl text-lg leading-8 text-gray-400"
      >
        I build fast, scalable and responsive full-stack web applications
        using MongoDB, Express.js, React.js and Node.js. Passionate about
        creating clean UI, modern user experiences and production-ready
        applications.
      </motion.p>

      <HeroButtons />
    </div>
  );
};

export default HeroContent;
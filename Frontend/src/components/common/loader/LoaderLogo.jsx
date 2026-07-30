import { motion } from "framer-motion";

const LoaderLogo = () => {
  return (
    <motion.h1
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
      }}
      className="text-4xl font-bold tracking-widest"
    >
      <span className="text-white">VIVEK</span>
      <span className="text-cyan-400">.</span>
    </motion.h1>
  );
};

export default LoaderLogo;
import { motion, useScroll } from "framer-motion";

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed left-0 top-0 z-[9999] h-1 origin-left bg-cyan-400"
      style={{
        scaleX: scrollYProgress,
      }}
    />
  );
};

export default ScrollProgress;
import { motion } from "framer-motion";

const StatCard = ({ number, title }) => {
  return (
    <motion.div
      whileHover={{
        y: -8,
        scale: 1.03,
      }}
      className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-lg transition-all"
    >
      <h2 className="text-4xl font-bold text-cyan-400">
        {number}
      </h2>

      <p className="mt-2 text-gray-400">
        {title}
      </p>
    </motion.div>
  );
};

export default StatCard;
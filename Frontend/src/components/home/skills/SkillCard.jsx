import { motion } from "framer-motion";

const SkillCard = ({ skill }) => {
  const Icon = skill.icon;

  return (
    <motion.div
      whileHover={{
        y: -10,
        scale: 1.04,
      }}
      className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all"
    >
      <Icon className={`text-5xl ${skill.color}`} />

      <h3 className="mt-5 text-xl font-bold">
        {skill.name}
      </h3>

      <div className="mt-5 h-2 rounded-full bg-slate-700">
        <div
          className="h-2 rounded-full bg-cyan-400"
          style={{
            width: `${skill.level}%`,
          }}
        />
      </div>

      <p className="mt-3 text-sm text-gray-400">
        {skill.level}%
      </p>
    </motion.div>
  );
};

export default SkillCard;
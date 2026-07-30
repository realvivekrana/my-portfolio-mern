import { motion } from "framer-motion";

const blobs = [
  {
    size: "w-80 h-80",
    color: "bg-cyan-500/20",
    top: "-10%",
    left: "-5%",
    duration: 12,
  },
  {
    size: "w-96 h-96",
    color: "bg-blue-500/20",
    bottom: "-20%",
    right: "-10%",
    duration: 16,
  },
  {
    size: "w-72 h-72",
    color: "bg-purple-500/20",
    top: "30%",
    right: "25%",
    duration: 10,
  },
];

const HeroBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(to right,#ffffff 1px,transparent 1px),
            linear-gradient(to bottom,#ffffff 1px,transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Animated Blobs */}
      {blobs.map((blob, index) => (
        <motion.div
          key={index}
          animate={{
            x: [0, 60, -40, 0],
            y: [0, -40, 40, 0],
            scale: [1, 1.15, 0.9, 1],
          }}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className={`absolute ${blob.size} ${blob.color} rounded-full blur-3xl`}
          style={{
            top: blob.top,
            left: blob.left,
            bottom: blob.bottom,
            right: blob.right,
          }}
        />
      ))}

      {/* Glow */}
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[150px]" />
    </div>
  );
};

export default HeroBackground;
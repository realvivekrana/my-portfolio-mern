import { motion } from "framer-motion";
import profile from "../../../assets/images/profile.jpeg";

const AboutImage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="flex justify-center"
    >
      <img
        src={profile}
        alt="Vivek Rana"
        className="h-[420px] w-[320px] rounded-3xl object-cover shadow-2xl"
      />
    </motion.div>
  );
};

export default AboutImage;
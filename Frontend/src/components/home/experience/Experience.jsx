import { motion } from "framer-motion";

import Container from "../../ui/Container";
import ExperienceTimeline from "./ExperienceTimeline";
import experienceData from "./experienceData";

const Experience = () => {
  return (
    <section
      id="experience"
      className="bg-slate-950 py-24"
    >
      <Container>
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-cyan-500 px-4 py-2 text-sm font-semibold text-cyan-400">
            My Journey
          </span>

          <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
            Experience
          </h2>

          <p className="mx-auto max-w-3xl text-lg leading-8 text-slate-400">
            My professional journey as a Frontend Developer, building modern,
            responsive, and scalable web applications using React and modern
            frontend technologies.
          </p>
        </motion.div>

        {/* Timeline */}
        <ExperienceTimeline experiences={experienceData} />
      </Container>
    </section>
  );
};

export default Experience;
import { useState } from "react";
import { motion } from "framer-motion";

import Container from "../../ui/Container";
import ProjectFilter from "./ProjectFilter";
import ProjectsGrid from "./ProjectsGrid";
import projectsData from "./projectsData";

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <section
      id="projects"
      className="bg-slate-950 py-24"
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-cyan-500 px-4 py-2 text-sm font-semibold text-cyan-400">
            My Work
          </span>

          <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl">
            Featured Projects
          </h2>

          <p className="mx-auto max-w-3xl text-lg leading-8 text-slate-400">
            Here are some of my featured projects built using modern web
            technologies. Each project focuses on clean UI, responsive design,
            performance, and solving real-world problems.
          </p>
        </motion.div>

        <ProjectFilter
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />

        <ProjectsGrid
          projects={projectsData}
          activeFilter={activeFilter}
        />
      </Container>
    </section>
  );
};

export default Projects;
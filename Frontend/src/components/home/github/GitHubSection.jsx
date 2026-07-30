import { motion } from "framer-motion";

import GitHubStats from "./GitHubStats";
import GitHubButton from "./GitHubButton";

const GitHubSection = () => {
  return (
    <section
      id="github"
      className="bg-slate-900 py-24 text-white"
    >
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="text-5xl font-bold">
            GitHub Activity
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-400">
            Explore my GitHub profile to see repositories,
            contributions, coding activity, and the technologies I work
            with.
          </p>
        </motion.div>

        <GitHubStats />

        <div className="mt-10 flex justify-center">
          <GitHubButton />
        </div>
      </div>
    </section>
  );
};

export default GitHubSection;
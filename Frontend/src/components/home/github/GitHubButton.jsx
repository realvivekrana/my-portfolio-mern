import { FaGithub } from "react-icons/fa";

const GitHubButton = () => {
  return (
    <a
      href="https://github.com/realvivekrana"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition-all duration-300 hover:-translate-y-1 hover:bg-cyan-400"
    >
      <FaGithub className="text-xl" />
      Visit GitHub
    </a>
  );
};

export default GitHubButton;
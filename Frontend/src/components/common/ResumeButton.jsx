import { FaDownload } from "react-icons/fa";

const ResumeButton = () => {
  return (
    <a
      href="/resume/Vivek_Rana_Resume.pdf"
      download="Vivek_Rana_Resume.pdf"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition-all duration-300 hover:scale-105 hover:bg-cyan-400"
    >
      <FaDownload />
      Download Resume
    </a>
  );
};

export default ResumeButton;
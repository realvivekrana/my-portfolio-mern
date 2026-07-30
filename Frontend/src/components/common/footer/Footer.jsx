import { FaGithub, FaLinkedin, FaArrowUp } from "react-icons/fa";
import FooterLinks from "./FooterLinks";

const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-10 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6">

        <h2 className="text-2xl font-bold text-cyan-400">
          Vivek Rana
        </h2>

        <FooterLinks />

        <div className="flex gap-5">
          <a href="https://github.com/realvivekrana" target="_blank" rel="noreferrer">
            <FaGithub className="text-2xl hover:text-cyan-400" />
          </a>

          <a href="#" target="_blank" rel="noreferrer">
            <FaLinkedin className="text-2xl hover:text-cyan-400" />
          </a>
        </div>

        <button
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
          className="rounded-full bg-cyan-500 p-3 text-black transition hover:scale-110"
        >
          <FaArrowUp />
        </button>

        <p className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Vivek Rana. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
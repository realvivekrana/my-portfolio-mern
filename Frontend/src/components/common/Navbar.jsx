import { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

import Logo from "./Logo";
import NavItem from "../ui/NavItem";
import navLinks from "../../constants/navLinks";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-slate-700 bg-slate-950/80 shadow-lg backdrop-blur-xl"
          : "bg-slate-950/90"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5">
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <NavItem
              key={link.id}
              title={link.title}
              path={link.path}
            />
          ))}

          <a
            href="/resume/Vivek_Rana_Resume.pdf"
            download
            className="rounded-lg bg-cyan-500 px-5 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Resume
          </a>
        </nav>

        {/* Mobile Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-2xl text-white md:hidden"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="border-t border-slate-800 bg-slate-950 px-5 py-5 md:hidden">
          <div className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.path}
                onClick={() => setMenuOpen(false)}
                className="text-gray-300 transition hover:text-cyan-400"
              >
                {link.title}
              </a>
            ))}

            <a
              href="/resume/Vivek_Rana_Resume.pdf"
              download
              className="rounded-lg bg-cyan-500 px-5 py-3 text-center font-semibold text-slate-950"
            >
              Download Resume
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}

export default Navbar;
import Logo from "./Logo";
import NavItem from "../ui/NavItem";
import navLinks from "../../constants/navLinks";

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5">

        <Logo />

        <nav className="hidden gap-8 md:flex">
          {navLinks.map((link) => (
            <NavItem
              key={link.id}
              title={link.title}
              path={link.path}
            />
          ))}
        </nav>

      </div>
    </header>
  );
}

export default Navbar;
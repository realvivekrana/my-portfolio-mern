function NavItem({ title, path }) {
  return (
    <a
      href={path}
      className="relative py-2 text-gray-300 transition-all duration-300 hover:text-cyan-400 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-cyan-400 after:transition-all after:duration-300 hover:after:w-full"
    >
      {title}
    </a>
  );
}

export default NavItem;
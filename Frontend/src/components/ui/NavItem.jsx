function NavItem({ title, path }) {
  return (
    <a
      href={path}
      className="text-gray-300 transition duration-300 hover:text-cyan-400"
    >
      {title}
    </a>
  );
}

export default NavItem;
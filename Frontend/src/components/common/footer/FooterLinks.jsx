import footerData from "./footerData";

const FooterLinks = () => {
  return (
    <div className="flex flex-wrap justify-center gap-6">
      {footerData.map((link) => (
        <a
          key={link.title}
          href={link.href}
          className="text-gray-400 transition hover:text-cyan-400"
        >
          {link.title}
        </a>
      ))}
    </div>
  );
};

export default FooterLinks;
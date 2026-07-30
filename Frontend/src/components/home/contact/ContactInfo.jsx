import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

import socialLinks from "./socialLinks";

const ContactInfo = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-bold">
          Let's Work Together
        </h2>

        <p className="mt-4 text-gray-400">
          Feel free to contact me for internships,
          freelance work or full-time opportunities.
        </p>
      </div>

      <div className="space-y-5">
        <div className="flex items-center gap-4">
          <FaEnvelope className="text-cyan-400 text-xl" />
          <span>your@email.com</span>
        </div>

        <div className="flex items-center gap-4">
          <FaPhone className="text-cyan-400 text-xl" />
          <span>+91 XXXXX XXXXX</span>
        </div>

        <div className="flex items-center gap-4">
          <FaMapMarkerAlt className="text-cyan-400 text-xl" />
          <span>Pune, Maharashtra</span>
        </div>
      </div>

      <div className="flex gap-4">
        {socialLinks.map((item) => {
          const Icon = item.icon;

          return (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-slate-800 p-4 hover:bg-cyan-500 transition"
            >
              <Icon />
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default ContactInfo;
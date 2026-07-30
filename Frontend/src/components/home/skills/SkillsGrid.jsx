import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaNodeJs,
  FaGitAlt,
} from "react-icons/fa";

import {
  SiExpress,
  SiMongodb,
  SiTailwindcss,
  SiPostman,
  SiGithub,
  SiVercel,
} from "react-icons/si";

import SkillCard from "./SkillCard";

const skills = [
  {
    name: "HTML5",
    icon: FaHtml5,
    color: "text-orange-500",
    level: 95,
  },
  {
    name: "CSS3",
    icon: FaCss3Alt,
    color: "text-blue-500",
    level: 90,
  },
  {
    name: "JavaScript",
    icon: FaJs,
    color: "text-yellow-400",
    level: 90,
  },
  {
    name: "React.js",
    icon: FaReact,
    color: "text-cyan-400",
    level: 90,
  },
  {
    name: "Node.js",
    icon: FaNodeJs,
    color: "text-green-500",
    level: 85,
  },
  {
    name: "Express.js",
    icon: SiExpress,
    color: "text-gray-300",
    level: 85,
  },
  {
    name: "MongoDB",
    icon: SiMongodb,
    color: "text-green-600",
    level: 85,
  },
  {
    name: "Tailwind CSS",
    icon: SiTailwindcss,
    color: "text-sky-400",
    level: 95,
  },
  {
    name: "Git",
    icon: FaGitAlt,
    color: "text-red-500",
    level: 90,
  },
  {
    name: "GitHub",
    icon: SiGithub,
    color: "text-white",
    level: 90,
  },
  {
    name: "Postman",
    icon: SiPostman,
    color: "text-orange-500",
    level: 85,
  },
  {
    name: "Vercel",
    icon: SiVercel,
    color: "text-white",
    level: 85,
  },
];

const SkillsGrid = () => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {skills.map((skill) => (
        <SkillCard key={skill.name} skill={skill} />
      ))}
    </div>
  );
};

export default SkillsGrid;
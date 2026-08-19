import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaNodeJs,
  FaGitAlt,
  FaGithub,
  FaBootstrap,
} from 'react-icons/fa';
import { SiMongodb, SiExpress, SiTailwindcss, SiRedux, SiPostman } from 'react-icons/si';

const skills = [
  { name: 'HTML5', icon: FaHtml5, color: 'text-orange-500' },
  { name: 'CSS3', icon: FaCss3Alt, color: 'text-blue-500' },
  { name: 'JavaScript', icon: FaJs, color: 'text-yellow-500' },
  { name: 'React.js', icon: FaReact, color: 'text-cyan-500' },
  { name: 'Redux Toolkit', icon: SiRedux, color: 'text-purple-500' },
  { name: 'Tailwind CSS', icon: SiTailwindcss, color: 'text-sky-500' },
  { name: 'Bootstrap', icon: FaBootstrap, color: 'text-violet-500' },
  { name: 'Node.js', icon: FaNodeJs, color: 'text-green-600' },
  { name: 'Express.js', icon: SiExpress, color: 'text-gray-700 dark:text-gray-300' },
  { name: 'MongoDB', icon: SiMongodb, color: 'text-green-500' },
  { name: 'Git', icon: FaGitAlt, color: 'text-orange-600' },
  { name: 'GitHub', icon: FaGithub, color: 'text-gray-900 dark:text-white' },
  { name: 'Postman', icon: SiPostman, color: 'text-orange-500' },
];

function Skills() {
  return (
    <section id="skills" className="py-24 px-6 bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 text-center">
          Skills & Technologies
        </h2>
        <div className="w-16 h-1 bg-indigo-500 mx-auto mb-12"></div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {skills.map((skill) => {
            const Icon = skill.icon;
            return (
              <div
                key={skill.name}
                className="flex flex-col items-center justify-center gap-3 bg-white dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 p-6 rounded-lg transition-colors group shadow-sm dark:shadow-none"
              >
                <Icon className={`text-4xl ${skill.color} group-hover:scale-110 transition-transform`} />
                <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">{skill.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Skills;
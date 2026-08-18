import { FaCode, FaGraduationCap, FaLightbulb } from 'react-icons/fa';

function About() {
  return (
    <section id="about" className="py-24 px-6 bg-white dark:bg-gray-900 transition-colors">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 text-center">About Me</h2>
        <div className="w-16 h-1 bg-indigo-500 mx-auto mb-12"></div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              I'm a passionate MERN Stack Developer with a strong foundation in building full-stack web applications. I love turning ideas into functional, well-designed products that solve real problems.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              My journey into web development started with curiosity about how websites work, and it has grown into a genuine passion for writing clean code and creating smooth user experiences.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              When I'm not coding, I enjoy learning new technologies, contributing to open source, and continuously improving my problem-solving skills.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4 bg-gray-100 dark:bg-gray-800/50 p-5 rounded-lg transition-colors">
              <FaCode className="text-indigo-500 dark:text-indigo-400 text-2xl mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-gray-900 dark:text-white font-semibold mb-1">Full Stack Development</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Building complete web applications using MongoDB, Express, React, and Node.js.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-gray-100 dark:bg-gray-800/50 p-5 rounded-lg transition-colors">
              <FaGraduationCap className="text-indigo-500 dark:text-indigo-400 text-2xl mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-gray-900 dark:text-white font-semibold mb-1">Continuous Learner</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Always exploring new tools, frameworks, and best practices in web development.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-gray-100 dark:bg-gray-800/50 p-5 rounded-lg transition-colors">
              <FaLightbulb className="text-indigo-500 dark:text-indigo-400 text-2xl mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-gray-900 dark:text-white font-semibold mb-1">Problem Solver</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">I enjoy breaking down complex problems into simple, elegant solutions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
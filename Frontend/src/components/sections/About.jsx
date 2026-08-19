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
              I am an MCA (AI & ML) student at Amity University Online and a MERN Stack Developer passionate about building scalable, responsive, and user-friendly web applications.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              My technical expertise includes React.js, JavaScript, HTML5, CSS3, Tailwind CSS, Node.js, Express.js, MongoDB, Git, GitHub, and REST APIs.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              I have completed professional MERN Stack training and internship programs, where I built real-world web applications, integrated REST APIs, and developed responsive user interfaces using modern development practices.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              I am actively seeking opportunities as a MERN Stack Developer, Full Stack Developer, or Software Engineer where I can contribute to impactful products while growing as a software engineer.
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
                <h3 className="text-gray-900 dark:text-white font-semibold mb-1">MCA (AI & ML) Student</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Pursuing Master of Computer Applications specializing in AI & ML at Amity University.</p>
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
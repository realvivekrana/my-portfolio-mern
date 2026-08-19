import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { HiArrowDown } from 'react-icons/hi';
import profileImg from '../../assets/profile.jpg';

function Hero() {
  return (
    <section id="home" className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-center px-6 pt-20 transition-colors">
      <img
        src={profileImg}
        alt="Vivek Kumar Rana"
        className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-indigo-500 mb-6 shadow-lg"
      />

      <p className="text-indigo-500 dark:text-indigo-400 font-medium mb-4 tracking-wide">Hi, my name is</p>

      <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">Vivek Kumar Rana</h1>

      <h2 className="text-xl md:text-3xl font-semibold text-gray-600 dark:text-gray-400 mb-6">
        MERN Stack Developer | React.js Developer
      </h2>

      <p className="text-gray-600 dark:text-gray-400 max-w-xl mb-8 leading-relaxed">
        I build scalable, responsive, and user-friendly web applications using React.js, Node.js, Express.js, and MongoDB. Passionate about clean code and great user experiences.
      </p>

      <div className="flex items-center gap-4 mb-10">
        <a href="#projects" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
          View My Work
        </a>
        <a href="/resume.pdf" download className="border border-gray-300 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400 text-gray-700 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 px-6 py-3 rounded-lg font-medium transition-colors">
          Download Resume
        </a>
      </div>

      <div className="flex items-center gap-6 text-gray-500 dark:text-gray-400 text-2xl">
        <a href="https://github.com/realvivekrana" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors" aria-label="GitHub">
          <FaGithub />
        </a>
        <a href="https://www.linkedin.com/in/mrvivekrana/" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors" aria-label="LinkedIn">
          <FaLinkedin />
        </a>
      </div>

      <a href="#about" className="absolute bottom-10 text-gray-400 dark:text-gray-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors animate-bounce" aria-label="Scroll down">
        <HiArrowDown size={24} />
      </a>
    </section>
  );
}

export default Hero;
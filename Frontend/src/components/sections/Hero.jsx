import { useEffect, useState } from 'react';

import API from '../../utils/axios';

import {
  FaGithub,
  FaLinkedin,
  FaReact,
  FaNodeJs,
} from 'react-icons/fa';

import {
  SiExpress,
  SiMongodb,
} from 'react-icons/si';

import {
  HiArrowRight,
  HiArrowDown,
  HiOutlineSparkles,
} from 'react-icons/hi';

import {
  FaDownload,
  FaFilePdf,
} from 'react-icons/fa6';

import profileImg from '../../assets/profile.jpg';

function Hero() {
  /*
  |--------------------------------------------------------------------------
  | Resume URL
  |--------------------------------------------------------------------------
  |
  | Backend se latest uploaded resume milega.
  |
  | Agar backend se resume nahi milta hai,
  | to /resume.pdf fallback rahega.
  |
  |--------------------------------------------------------------------------
  */

  const [resumeUrl, setResumeUrl] =
    useState('/resume.pdf');

  const [resumeFileName, setResumeFileName] =
    useState('Vivek-Rana-Resume.pdf');

  /*
  |--------------------------------------------------------------------------
  | Load Latest Resume From Backend
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const loadResume = async () => {
      try {
        /*
        |--------------------------------------------------------------------------
        | Get Complete Portfolio
        |--------------------------------------------------------------------------
        |
        | GET /api/portfolio
        |
        |--------------------------------------------------------------------------
        */

        const response =
          await API.get('/portfolio');

        const portfolio =
          response.data?.data ||
          response.data ||
          {};

        const resume =
          portfolio?.resume;

        /*
        |--------------------------------------------------------------------------
        | Check Resume
        |--------------------------------------------------------------------------
        */

        if (resume?.url) {
          setResumeUrl(
            resume.url
          );

          setResumeFileName(
            resume.originalName ||
              resume.fileName ||
              'Vivek-Rana-Resume.pdf'
          );
        }
      } catch (error) {
        /*
        |--------------------------------------------------------------------------
        | Fallback
        |--------------------------------------------------------------------------
        |
        | Agar backend unavailable hai,
        | to public/resume.pdf use hoga.
        |
        |--------------------------------------------------------------------------
        */

        console.warn(
          'Using fallback resume:',
          error
        );
      }
    };

    loadResume();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Tech Stack
  |--------------------------------------------------------------------------
  */

  const techStack = [
    {
      name: 'React',
      icon: <FaReact />,
      color: 'text-cyan-500',
    },
    {
      name: 'Node.js',
      icon: <FaNodeJs />,
      color: 'text-green-500',
    },
    {
      name: 'Express',
      icon: <SiExpress />,
      color:
        'text-gray-700 dark:text-gray-200',
    },
    {
      name: 'MongoDB',
      icon: <SiMongodb />,
      color: 'text-green-600',
    },
  ];

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden bg-white px-6 pt-28 text-gray-900 transition-colors duration-500 dark:bg-gray-950 dark:text-white"
    >
      {/* =====================================================
          BACKGROUND DECORATION
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-600/10" />

        <div className="absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-purple-200/30 blur-3xl dark:bg-purple-600/10" />

        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-100/20 blur-3xl dark:bg-blue-500/5" />
      </div>

      {/* =====================================================
          MAIN HERO CONTENT
      ====================================================== */}

      <div className="relative mx-auto flex min-h-[calc(100vh-112px)] max-w-7xl items-center justify-center">
        <div className="grid w-full items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">

          {/* =================================================
              LEFT CONTENT
          ================================================== */}

          <div className="order-2 text-center lg:order-1 lg:text-left">

            {/* Availability Badge */}

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 shadow-sm dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />

                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
              </span>

              Open to Work
            </div>

            {/* Small Introduction */}

            <p className="mb-4 flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 lg:justify-start">
              <HiOutlineSparkles className="text-lg" />

              Hello, I'm
            </p>

            {/* Name */}

            <h1 className="mb-4 text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Vivek kumar

              <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-purple-400 dark:to-blue-400">
                Rana
              </span>
            </h1>

            {/* Main Title */}

            <h2 className="mb-6 text-2xl font-bold text-gray-700 sm:text-3xl dark:text-gray-200">
              MERN Stack Developer
            </h2>

            {/* Description */}

            <p className="mx-auto mb-8 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg lg:mx-0 dark:text-gray-400">
              I build scalable, responsive, and user-focused web applications
              using modern JavaScript technologies. I love turning ideas into
              clean, functional, and engaging digital experiences.
            </p>

            {/* =================================================
                CTA BUTTONS
            ================================================== */}

            <div className="mb-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">

              {/* View My Work */}

              <a
                href="#projects"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/30 sm:w-auto"
              >
                View My Work

                <HiArrowRight className="text-xl transition-transform duration-300 group-hover:translate-x-1" />
              </a>

              {/* Download Resume */}

              <a
                href={resumeUrl}
                download={resumeFileName}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-7 py-3.5 font-semibold text-gray-800 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500 hover:text-indigo-600 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-indigo-400 dark:hover:text-indigo-400 sm:w-auto"
              >
                <FaDownload className="text-sm transition-transform duration-300 group-hover:-translate-y-0.5" />

                Download Resume
              </a>

              {/* View Resume */}

              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-7 py-3.5 font-semibold text-gray-700 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 dark:border-gray-800 dark:bg-gray-900/70 dark:text-gray-300 dark:hover:border-indigo-500/30 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400 sm:w-auto"
              >
                <FaFilePdf className="text-sm text-red-500 transition-transform duration-300 group-hover:scale-110" />

                View Resume
              </a>
            </div>

            {/* =================================================
                RESUME AVAILABILITY NOTE
            ================================================== */}

            <div className="mb-9 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500 lg:justify-start">
              <FaFilePdf className="text-red-500" />

              <span>
                Updated resume available for download
              </span>
            </div>

            {/* =================================================
                SOCIAL LINKS
            ================================================== */}

            <div className="mb-10 flex items-center justify-center gap-3 lg:justify-start">

              {/* GitHub */}

              <a
                href="https://github.com/realvivekrana"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="group flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-xl text-gray-700 transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:bg-gray-900 hover:text-white dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-white dark:hover:text-gray-900"
              >
                <FaGithub className="transition-transform duration-300 group-hover:scale-110" />
              </a>

              {/* LinkedIn */}

              <a
                href="https://www.linkedin.com/in/mrvivekrana/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="group flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-xl text-gray-700 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:bg-blue-600 hover:text-white dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-blue-600 dark:hover:text-white"
              >
                <FaLinkedin className="transition-transform duration-300 group-hover:scale-110" />
              </a>

              <span className="ml-2 h-6 w-px bg-gray-200 dark:bg-gray-800" />

              <span className="ml-1 text-sm text-gray-500 dark:text-gray-500">
                Based in India
              </span>
            </div>

            {/* =================================================
                TECH STACK
            ================================================== */}

            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500">
                Tech Stack
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                {techStack.map((tech) => (
                  <div
                    key={tech.name}
                    className="group inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-indigo-500/30"
                  >
                    <span
                      className={`text-lg transition-transform duration-300 group-hover:scale-110 ${tech.color}`}
                    >
                      {tech.icon}
                    </span>

                    {tech.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* =================================================
              RIGHT PROFILE SECTION
          ================================================== */}

          <div className="order-1 flex justify-center lg:order-2">
            <div className="relative">

              {/* Decorative Rings */}

              <div className="absolute -inset-5 rounded-[2rem] border border-indigo-200/60 dark:border-indigo-500/20" />

              <div className="absolute -inset-10 rounded-[2.5rem] border border-purple-200/40 dark:border-purple-500/10" />

              {/* Floating React Badge */}

              <div className="absolute -right-7 top-6 z-20 hidden animate-[bounce_4s_ease-in-out_infinite] rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-xl sm:block dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                    <FaReact className="text-xl" />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Building with
                    </p>

                    <p className="text-sm font-bold text-gray-800 dark:text-white">
                      React.js
                    </p>
                  </div>
                </div>
              </div>

              {/* Profile Image Card */}

              <div className="relative h-72 w-72 overflow-hidden rounded-[2rem] border border-gray-200 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-2 shadow-2xl shadow-indigo-500/10 sm:h-80 sm:w-80 dark:border-gray-800 dark:from-indigo-950/40 dark:via-gray-900 dark:to-purple-950/30">
                <div className="h-full w-full overflow-hidden rounded-[1.5rem] bg-gray-100 dark:bg-gray-800">
                  <img
                    src={profileImg}
                    alt="Vivek Rana - MERN Stack Developer"
                    width="320"
                    height="320"
                    loading="eager"
                    decoding="async"
                    className="h-full w-full object-cover object-center transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </div>

              {/* Bottom Floating Card */}

              <div className="absolute -bottom-6 -left-7 z-20 hidden rounded-2xl border border-gray-200 bg-white px-5 py-3 shadow-xl sm:block dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 dark:bg-green-500/10">
                    <span className="h-3 w-3 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.7)]" />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Currently
                    </p>

                    <p className="text-sm font-bold text-gray-800 dark:text-white">
                      Available for opportunities
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative Dots */}

              <div className="absolute -bottom-8 right-0 grid grid-cols-4 gap-1.5 opacity-60">
                {Array.from({
                  length: 16,
                }).map((_, index) => (
                  <span
                    key={index}
                    className="h-1.5 w-1.5 rounded-full bg-indigo-400 dark:bg-indigo-500"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          SCROLL DOWN
      ====================================================== */}

      <a
        href="#about"
        aria-label="Scroll to About section"
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-gray-400 transition-colors duration-300 hover:text-indigo-600 md:flex dark:text-gray-600 dark:hover:text-indigo-400"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em]">
          Scroll
        </span>

        <HiArrowDown className="animate-bounce text-xl" />
      </a>
    </section>
  );
}

export default Hero;
import { useEffect, useState } from 'react';

import API from '../../utils/axios';

import {
  FaGithub,
  FaLinkedin,
  FaReact,
  FaNodeJs,
  FaJs,
} from 'react-icons/fa';

import {
  SiExpress,
  SiMongodb,
  SiTailwindcss,
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
  | Resume
  |--------------------------------------------------------------------------
  */

  /*
  |--------------------------------------------------------------------------
  | Public Resume URL
  |--------------------------------------------------------------------------
  |
  | The backend protects direct /uploads/... access.
  | Public portfolio users must use the public-resume endpoint.
  |
  |--------------------------------------------------------------------------
  */

  const publicResumeBaseURL =
    API.defaults.baseURL || '';

  const publicResumeUrl =
    `${publicResumeBaseURL.endsWith('/')
      ? publicResumeBaseURL.slice(0, -1)
      : publicResumeBaseURL}/portfolio/upload/public-resume`;

  const [resumeUrl, setResumeUrl] =
    useState(publicResumeUrl);

  const [resumeFileName, setResumeFileName] =
    useState('Vivek-Rana-Resume.pdf');

  /*
  |--------------------------------------------------------------------------
  | Floating Skill Bubbles
  |--------------------------------------------------------------------------
  */

  const skills = [
    {
      name: 'React',
      icon: <FaReact />,
      color: 'text-cyan-400',
      glow: 'shadow-cyan-400/60',
      dotColor: 'bg-cyan-400 text-cyan-400',
      ring: 'from-cyan-400 via-sky-300 to-blue-500',
    },
    {
      name: 'Node.js',
      icon: <FaNodeJs />,
      color: 'text-green-500',
      glow: 'shadow-green-500/60',
      dotColor: 'bg-green-500 text-green-500',
      ring: 'from-green-500 via-emerald-400 to-lime-400',
    },
    {
      name: 'Express',
      icon: <SiExpress />,
      color: 'text-gray-700 dark:text-gray-100',
      glow: 'shadow-slate-400/50',
      dotColor: 'bg-gray-400 text-gray-400',
      ring: 'from-slate-500 via-gray-400 to-slate-600',
    },
    {
      name: 'MongoDB',
      icon: <SiMongodb />,
      color: 'text-green-500',
      glow: 'shadow-green-500/60',
      dotColor: 'bg-green-500 text-green-500',
      ring: 'from-green-600 via-green-500 to-emerald-400',
    },
    {
      name: 'JavaScript',
      icon: <FaJs />,
      color: 'text-yellow-500',
      glow: 'shadow-yellow-400/60',
      dotColor: 'bg-yellow-400 text-yellow-500',
      ring: 'from-yellow-400 via-amber-300 to-orange-400',
      hideOnMobile: true,
    },
    {
      name: 'Tailwind',
      icon: <SiTailwindcss />,
      color: 'text-sky-500',
      glow: 'shadow-sky-400/60',
      dotColor: 'bg-sky-400 text-sky-500',
      ring: 'from-sky-400 via-teal-300 to-cyan-400',
      hideOnMobile: true,
    },
  ];

  /*
  |--------------------------------------------------------------------------
  | Load Resume
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const loadResume = async () => {
      try {
        const response =
          await API.get('/portfolio');

        const portfolio =
          response.data?.data ||
          response.data ||
          {};

        const resume =
          portfolio?.resume;

        if (resume) {
          /*
           * Do NOT use resume.url here.
           *
           * resume.url points to the protected /uploads/... path.
           * The public portfolio must always use the public-resume
           * endpoint instead.
           */

          setResumeUrl(publicResumeUrl);

          setResumeFileName(
            resume.originalName ||
              resume.fileName ||
              'Vivek-Rana-Resume.pdf'
          );
        }
      } catch (error) {
        console.warn(
          'Using fallback resume:',
          error
        );
      }
    };

    loadResume();
  }, [publicResumeUrl]);

  /*
  |--------------------------------------------------------------------------
  | Download Resume
  |--------------------------------------------------------------------------
  |
  | Backend PDF URL cross-origin hone ki wajah se
  | normal <a download> browser mein PDF open kar sakta hai.
  |
  | Isliye PDF ko Blob ke through download karenge.
  |
  |--------------------------------------------------------------------------
  */

  const handleResumeDownload = async () => {
    if (!resumeUrl) {
      return;
    }

    try {
      const response = await fetch(resumeUrl);

      if (!response.ok) {
        throw new Error(
          `Resume download failed: ${response.status}`
        );
      }

      const blob = await response.blob();

      const blobUrl =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement('a');

      link.href = blobUrl;

      link.download =
        resumeFileName ||
        'Vivek-Rana-Resume.pdf';

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error(
        'Resume download error:',
        error
      );

      /*
      |--------------------------------------------------------------------------
      | Fallback
      |--------------------------------------------------------------------------
      |
      | Agar browser/server Blob download ko allow na kare,
      | resume normal URL par open ho jayega.
      |
      |--------------------------------------------------------------------------
      */

      window.open(
        publicResumeUrl,
        '_blank',
        'noopener,noreferrer'
      );
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden bg-white/85 px-6 pt-28 text-gray-900 backdrop-blur-[1px] transition-colors duration-500 dark:bg-gray-950/85 dark:text-white"
    >
      {/* =====================================================
          BACKGROUND ANIMATION
      ====================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        {/* Glow 1 */}

        <div className="absolute -left-32 top-20 h-72 w-72 animate-[heroGlowOne_12s_ease-in-out_infinite] rounded-full bg-indigo-300/20 blur-3xl dark:bg-indigo-600/15" />

        {/* Glow 2 */}

        <div className="absolute -right-32 bottom-10 h-80 w-80 animate-[heroGlowTwo_15s_ease-in-out_infinite] rounded-full bg-purple-300/20 blur-3xl dark:bg-purple-600/15" />

        {/* Glow 3 */}

        <div className="absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 animate-[heroGlowThree_18s_ease-in-out_infinite] rounded-full bg-blue-200/15 blur-3xl dark:bg-blue-500/10" />

        {/* Moving Light */}

        <div className="absolute left-0 top-[45%] h-px w-full overflow-hidden opacity-30 dark:opacity-40">
          <div className="h-full w-40 animate-[heroLightMove_9s_linear_infinite] bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_15px_rgba(99,102,241,0.7)]" />
        </div>
      </div>

      {/* =====================================================
          MAIN HERO CONTENT
      ====================================================== */}

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-112px)] max-w-7xl items-center justify-center">
        <div className="grid w-full items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">

          {/* =================================================
              LEFT CONTENT
          ================================================== */}

          <div className="order-2 text-center lg:order-1 lg:text-left">

            {/* Availability */}

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50/90 px-4 py-2 text-sm font-medium text-green-700 shadow-sm backdrop-blur-sm dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />

                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
              </span>

              Open to Work
            </div>

            {/* Introduction */}

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

            {/* Role */}

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

              {/* VIEW MY WORK */}

              <a
                href="#projects"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/30 sm:w-auto"
              >
                View My Work

                <HiArrowRight className="text-xl transition-transform duration-300 group-hover:translate-x-1" />
              </a>

              {/* =================================================
                  DOWNLOAD RESUME
              ================================================== */}

              <button
                type="button"
                onClick={handleResumeDownload}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white/90 px-7 py-3.5 font-semibold text-gray-800 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500 hover:text-indigo-600 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900/90 dark:text-gray-200 dark:hover:border-indigo-400 dark:hover:text-indigo-400 sm:w-auto"
              >
                <FaDownload className="text-sm transition-transform duration-300 group-hover:-translate-y-0.5" />

                Download Resume
              </button>

              {/* =================================================
                  VIEW RESUME
              ================================================== */}

              <a
                href={publicResumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50/90 px-7 py-3.5 font-semibold text-gray-700 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 dark:border-gray-800 dark:bg-gray-900/90 dark:text-gray-300 dark:hover:border-indigo-500/30 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400 sm:w-auto"
              >
                <FaFilePdf className="text-sm text-red-500 transition-transform duration-300 group-hover:scale-110" />

                View Resume
              </a>

            </div>

            {/* Resume Note */}

            <div className="mb-9 flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-500 lg:justify-start">
              <FaFilePdf className="text-red-500" />

              <span>
                Updated resume available for download
              </span>
            </div>

            {/* Social */}

            <div className="mb-10 flex items-center justify-center gap-3 lg:justify-start">

              {/* GitHub */}

              <a
                href="https://github.com/realvivekrana"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="group flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-gray-50/90 text-xl text-gray-700 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:bg-gray-900 hover:text-white dark:border-gray-800 dark:bg-gray-900/90 dark:text-gray-300 dark:hover:bg-white dark:hover:text-gray-900"
              >
                <FaGithub className="transition-transform duration-300 group-hover:scale-110" />
              </a>

              {/* LinkedIn */}

              <a
                href="https://www.linkedin.com/in/mrvivekrana/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="group flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-gray-50/90 text-xl text-gray-700 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:bg-blue-600 hover:text-white dark:border-gray-800 dark:bg-gray-900/90 dark:text-gray-300 dark:hover:bg-blue-600 dark:hover:text-white"
              >
                <FaLinkedin className="transition-transform duration-300 group-hover:scale-110" />
              </a>

              <span className="ml-2 h-6 w-px bg-gray-200 dark:bg-gray-800" />

              <span className="ml-1 text-sm text-gray-500 dark:text-gray-500">
                Based in India
              </span>
            </div>
          </div>

          {/* =================================================
              RIGHT PROFILE + FLOATING SKILLS
          ================================================== */}

          <div className="order-1 flex justify-center lg:order-2">

            <div className="relative h-[390px] w-[340px] sm:h-[470px] sm:w-[430px]">

              {/* =================================================
                  WATER EFFECT
              ================================================== */}

              <div
                aria-hidden="true"
                className="absolute inset-0"
              >
                <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/5 blur-3xl dark:bg-cyan-400/10" />

                <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 animate-[waterPulse_5s_ease-in-out_infinite] rounded-full border border-cyan-300/10 dark:border-cyan-400/10" />
              </div>

              {/* =================================================
                  PROFILE IMAGE
              ================================================== */}

              <div className="absolute left-1/2 top-1/2 z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 sm:h-80 sm:w-80">

                {/* Outer Ring */}

                <div className="absolute -inset-5 rounded-[2.5rem] border border-indigo-200/50 dark:border-indigo-500/20" />

                <div className="absolute -inset-10 rounded-[3rem] border border-purple-200/30 dark:border-purple-500/10" />

                {/* Image */}

                <div className="relative h-full w-full overflow-hidden rounded-[2rem] border border-gray-200 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-2 shadow-2xl shadow-indigo-500/10 dark:border-gray-800 dark:from-indigo-950/60 dark:via-gray-900 dark:to-purple-950/50">

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
              </div>

              {/* =================================================
                  FLOATING SKILL BADGES
                  Circular glass bubbles orbiting the photo, each
                  with a brand-colored glow + spinning gradient
                  ring, a gentle continuous float/drift, and the
                  skill name revealed as a pill on hover.
              ================================================== */}

              {skills.map((skill, index) => (
                <div
                  key={skill.name}
                  className={`skill-float group absolute z-20 ${
                    skill.hideOnMobile ? 'hidden sm:block' : ''
                  }`}
                  style={{
                    left: `${skillPositions[index].left}%`,
                    top: `${skillPositions[index].top}%`,
                    '--float-duration': `${skillPositions[index].duration}s`,
                    '--float-delay': `${skillPositions[index].delay}s`,
                  }}
                >
                  {/* Big soft color glow behind everything, breathing */}

                  <div
                    aria-hidden="true"
                    className={`absolute inset-0 -z-10 animate-[skillGlowPulse_4s_ease-in-out_infinite] rounded-full blur-2xl ${skill.glow}`}
                  />

                  {/* Slowly spinning gradient ring border */}

                  <div
                    aria-hidden="true"
                    className={`absolute -inset-[2.5px] -z-10 rounded-full bg-gradient-to-r ${skill.ring} opacity-90 blur-[0.5px]`}
                    style={{
                      animation: 'skillRingSpin 5s linear infinite',
                    }}
                  />

                  <div
                    className="skill-bubble relative flex h-14 w-14 flex-col items-center justify-center rounded-full border border-white/80 bg-white/95 shadow-xl backdrop-blur-md transition-all duration-300 ease-out group-hover:-translate-y-1.5 group-hover:scale-[1.15] group-hover:shadow-2xl sm:h-16 sm:w-16 dark:border-white/10 dark:bg-gray-900/95"
                  >
                    {/* Icon */}

                    <span
                      className={`text-2xl drop-shadow-sm sm:text-3xl ${skill.color}`}
                    >
                      {skill.icon}
                    </span>

                    {/* Tiny status dot — steady, no blinking */}

                    <span
                      className={`absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-gray-900 ${skill.dotColor}`}
                    />
                  </div>

                  {/* Name label — shows on hover as a floating pill */}

                  <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-full border border-white/80 bg-white/95 px-3 py-1 text-[11px] font-bold tracking-wide text-gray-700 opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 dark:border-white/10 dark:bg-gray-900/95 dark:text-gray-200">
                    {skill.name}
                  </span>
                </div>
              ))}

              {/* =================================================
                  SMALL WATER BUBBLES
              ================================================== */}

              <span className="absolute left-[12%] top-[38%] z-20 h-3 w-3 animate-[tinyBubbleOne_7s_ease-in-out_infinite] rounded-full border border-cyan-300/40 bg-cyan-200/20 backdrop-blur-sm dark:bg-cyan-400/10" />

              <span className="absolute right-[12%] top-[58%] z-20 h-2 w-2 animate-[tinyBubbleTwo_9s_ease-in-out_infinite] rounded-full border border-purple-300/40 bg-purple-200/20 backdrop-blur-sm dark:bg-purple-400/10" />

              <span className="absolute left-[28%] top-[15%] z-20 h-2 w-2 animate-[tinyBubbleThree_8s_ease-in-out_infinite] rounded-full border border-indigo-300/40 bg-indigo-200/20 backdrop-blur-sm dark:bg-indigo-400/10" />

              <span className="absolute bottom-[12%] right-[28%] z-20 h-3 w-3 animate-[tinyBubbleFour_10s_ease-in-out_infinite] rounded-full border border-blue-300/40 bg-blue-200/20 backdrop-blur-sm dark:bg-blue-500/10" />

              {/* =================================================
                  AVAILABILITY CARD
              ================================================== */}

              <div className="absolute -bottom-2 left-1/2 z-30 hidden -translate-x-1/2 rounded-2xl border border-gray-200 bg-white/90 px-5 py-3 shadow-xl backdrop-blur-md sm:block dark:border-gray-800 dark:bg-gray-900/90">

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
        className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-gray-400 transition-colors duration-300 hover:text-indigo-600 md:flex dark:text-gray-600 dark:hover:text-indigo-400"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em]">
          Scroll
        </span>

        <HiArrowDown className="animate-bounce text-xl" />
      </a>

      {/* =====================================================
          ANIMATION STYLES
      ====================================================== */}

      <style>
        {`
          @keyframes heroGlowOne {
            0%,
            100% {
              transform: translate3d(0, 0, 0) scale(1);
            }

            50% {
              transform: translate3d(120px, 50px, 0) scale(1.15);
            }
          }

          @keyframes heroGlowTwo {
            0%,
            100% {
              transform: translate3d(0, 0, 0) scale(1);
            }

            50% {
              transform: translate3d(-100px, -70px, 0) scale(1.12);
            }
          }

          @keyframes heroGlowThree {
            0%,
            100% {
              transform: translate3d(-50%, 0, 0) scale(1);
            }

            50% {
              transform: translate3d(-20%, 70px, 0) scale(1.2);
            }
          }

          @keyframes heroLightMove {
            0% {
              transform: translateX(-120%);
            }

            100% {
              transform: translateX(700%);
            }
          }

          /* ================================================
             SKILL BADGE FLOAT
             -------------------------------------------------
             Badge gently and continuously floats/drifts and
             wobbles around its spot — always visible, never
             vanishes. Each badge runs its own staggered
             duration/delay (set via --float-duration /
             --float-delay inline vars) so the whole ring feels
             organic instead of synchronized.
          ================================================= */

          @keyframes skillRingSpin {
            0%,
            100% {
              opacity: 0.6;
              filter: hue-rotate(0deg);
            }

            50% {
              opacity: 1;
              filter: hue-rotate(35deg);
            }
          }

          @keyframes skillGlowPulse {
            0%,
            100% {
              opacity: 0.55;
              transform: scale(0.9);
            }

            50% {
              opacity: 0.95;
              transform: scale(1.15);
            }
          }

          @keyframes skillFloat {
            0%,
            100% {
              transform: translateY(0px) translateX(0px) rotate(0deg);
            }

            25% {
              transform: translateY(-14px) translateX(4px) rotate(-3deg);
            }

            50% {
              transform: translateY(3px) translateX(-4px) rotate(2deg);
            }

            75% {
              transform: translateY(-9px) translateX(-3px) rotate(-2deg);
            }
          }

          .skill-float {
            animation: skillFloat var(--float-duration, 6s) ease-in-out
              var(--float-delay, 0s) infinite;
          }

          /* ================================================
             WATER PULSE
          ================================================= */

          @keyframes waterPulse {
            0%,
            100% {
              transform:
                translate(-50%, -50%)
                scale(0.95);
              opacity: 0.3;
            }

            50% {
              transform:
                translate(-50%, -50%)
                scale(1.08);
              opacity: 0.7;
            }
          }

          /* ================================================
             SMALL BUBBLES
          ================================================= */

          @keyframes tinyBubbleOne {
            0%,
            100% {
              transform:
                translate3d(0, 40px, 0)
                scale(0.5);
              opacity: 0;
            }

            30% {
              opacity: 0.8;
            }

            70% {
              transform:
                translate3d(20px, -70px, 0)
                scale(1.1);
              opacity: 0.7;
            }

            100% {
              transform:
                translate3d(-10px, -130px, 0)
                scale(0.2);
              opacity: 0;
            }
          }

          @keyframes tinyBubbleTwo {
            0%,
            100% {
              transform:
                translate3d(0, 30px, 0)
                scale(0.4);
              opacity: 0;
            }

            30% {
              opacity: 0.8;
            }

            70% {
              transform:
                translate3d(-25px, -80px, 0)
                scale(1);
              opacity: 0.6;
            }

            100% {
              transform:
                translate3d(15px, -150px, 0)
                scale(0.1);
              opacity: 0;
            }
          }

          @keyframes tinyBubbleThree {
            0%,
            100% {
              transform:
                translate3d(0, 30px, 0)
                scale(0.3);
              opacity: 0;
            }

            30% {
              opacity: 0.7;
            }

            70% {
              transform:
                translate3d(25px, -80px, 0)
                scale(1);
              opacity: 0.6;
            }

            100% {
              transform:
                translate3d(-15px, -140px, 0)
                scale(0.1);
              opacity: 0;
            }
          }

          @keyframes tinyBubbleFour {
            0%,
            100% {
              transform:
                translate3d(0, 30px, 0)
                scale(0.4);
              opacity: 0;
            }

            35% {
              opacity: 0.8;
            }

            70% {
              transform:
                translate3d(-20px, -90px, 0)
                scale(1.1);
              opacity: 0.7;
            }

            100% {
              transform:
                translate3d(20px, -150px, 0)
                scale(0.1);
              opacity: 0;
            }
          }

          @media (max-width: 640px) {
            .skill-bubble {
              padding-left: 0.55rem;
              padding-right: 0.55rem;
              padding-top: 0.35rem;
              padding-bottom: 0.35rem;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}
      </style>
    </section>
  );
}

/*
|--------------------------------------------------------------------------
| Skill Bubble Positions
|--------------------------------------------------------------------------
|
| Photo ke around bubbles ko alag-alag position aur speed di gayi hai.
|
|--------------------------------------------------------------------------
*/

const skillPositions = [
  // React — top-left
  {
    left: 0,
    top: 6,
    duration: 6,
    delay: 0,
  },

  // Node.js — top-right
  {
    left: 76,
    top: 6,
    duration: 6.5,
    delay: 0.8,
  },

  // Express — bottom-left
  {
    left: 0,
    top: 72,
    duration: 7,
    delay: 1.6,
  },

  // MongoDB — bottom-right
  {
    left: 76,
    top: 74,
    duration: 6.8,
    delay: 2.4,
  },

  // JavaScript — left-middle (hidden on mobile)
  {
    left: -8,
    top: 40,
    duration: 6.3,
    delay: 3.2,
  },

  // Tailwind — right-middle (hidden on mobile)
  {
    left: 84,
    top: 42,
    duration: 6.6,
    delay: 4,
  },
];

export default Hero;
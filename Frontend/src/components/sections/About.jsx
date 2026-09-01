import { useEffect, useState } from 'react';

import API from '../../utils/axios';

import {
  FaCode,
  FaGraduationCap,
  FaLightbulb,
  FaBriefcase,
  FaRocket,
  FaCheckCircle,
} from 'react-icons/fa';

const quickStats = [
  {
    value: '2+',
    label: 'Years Learning',
  },
  {
    value: '10+',
    label: 'Projects Built',
  },
  {
    value: 'MERN',
    label: 'Primary Stack',
  },
  {
    value: 'Open',
    label: 'To Opportunities',
  },
];

const expertise = [
  {
    icon: <FaCode />,
    title: 'MERN Stack Development',
    description:
      'Building modern full-stack applications using MongoDB, Express.js, React.js and Node.js.',
  },
  {
    icon: <FaLightbulb />,
    title: 'Modern Web Development',
    description:
      'Creating responsive, scalable and user-focused interfaces with clean and reusable components.',
  },
  {
    icon: <FaRocket />,
    title: 'Problem Solving',
    description:
      'Breaking complex requirements into practical, maintainable and effective technical solutions.',
  },
];

const strengths = [
  'Responsive Web Development',
  'React.js & Component Architecture',
  'REST API Integration',
  'Node.js & Express.js',
  'MongoDB & Database Integration',
  'Git & GitHub Workflow',
];

function About() {
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [heroName, setHeroName] = useState('Vivek Rana');
  const [heroRole, setHeroRole] = useState('MERN Stack Developer');

  useEffect(() => {
    let isMounted = true;

    const fetchAboutData = async () => {
      try {
        const response = await API.get('/portfolio', {
          params: { _t: Date.now() },
        });

        const portfolio =
          response?.data?.data ||
          response?.data ||
          {};

        const experienceData = Array.isArray(portfolio?.experience)
          ? portfolio.experience
          : [];

        const educationData = Array.isArray(portfolio?.education)
          ? portfolio.education
          : [];

        if (!isMounted) {
          return;
        }

        setExperiences(
          experienceData
            .filter((item) => item?.isVisible !== false)
            .sort(
              (a, b) =>
                Number(a?.displayOrder || 0) -
                Number(b?.displayOrder || 0)
            )
        );

        setEducation(
          educationData
            .filter((item) => item?.isVisible !== false)
            .sort(
              (a, b) =>
                Number(a?.displayOrder || 0) -
                Number(b?.displayOrder || 0)
            )
        );

        if (portfolio?.hero?.name) {
          setHeroName(portfolio.hero.name);
        }

        if (portfolio?.hero?.role) {
          setHeroRole(portfolio.hero.role);
        }
      } catch (error) {
        console.error('Failed to fetch About data:', error);

        if (!isMounted) {
          return;
        }

        setExperiences([]);
        setEducation([]);
      }
    };

    fetchAboutData();

    return () => {
      isMounted = false;
    };
  }, []);

  const currentExperience = experiences[0] || null;
  const currentEducation = education[0] || null;
  const previousEducation = education[1] || null;

  return (
    <section
      id="about"
      className="relative overflow-hidden bg-transparent px-4 py-16 text-white transition-colors duration-500 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      {/* =====================================================
          COSMIC BACKGROUND DECORATION
      ====================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-20 h-64 w-64 animate-[aboutOrbOne_14s_ease-in-out_infinite] rounded-full bg-indigo-600/10 blur-[100px] sm:h-80 sm:w-80"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-20 h-64 w-64 animate-[aboutOrbTwo_18s_ease-in-out_infinite] rounded-full bg-purple-600/10 blur-[100px] sm:h-80 sm:w-80"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 h-56 w-56 -translate-x-1/2 rounded-full bg-cyan-500/5 blur-[100px]"
      />

      {/* =====================================================
          SECTION CONTENT
      ====================================================== */}

      <div className="relative z-10 mx-auto w-full max-w-7xl">

        {/* =====================================================
            SECTION HEADER
        ====================================================== */}

        <div className="mb-10 text-center sm:mb-14 md:mb-16">

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-indigo-400 sm:text-sm sm:tracking-[0.2em]">
            Get To Know Me
          </p>

          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
            About{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Me
            </span>
          </h2>

          <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 shadow-[0_0_15px_rgba(99,102,241,0.5)] sm:mt-5 sm:w-16" />

          <p className="mx-auto mt-5 max-w-2xl px-1 text-sm leading-7 text-gray-400 sm:mt-6 sm:text-base sm:leading-8 md:text-lg">
            I'm a MERN Stack Developer focused on building modern, scalable
            and user-friendly web applications. I enjoy turning complex
            problems into clean and intuitive digital experiences.
          </p>
        </div>

        {/* =====================================================
            MAIN ABOUT GRID
        ====================================================== */}

        <div className="grid items-start gap-6 sm:gap-8 lg:grid-cols-[1.05fr_0.95fr]">

          {/* ===================================================
              LEFT — PROFESSIONAL INTRODUCTION
          ==================================================== */}

          <div className="group min-w-0 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 shadow-[0_0_40px_rgba(99,102,241,0.04)] backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-indigo-400/20 hover:bg-white/[0.04] hover:shadow-[0_0_50px_rgba(99,102,241,0.08)] sm:rounded-3xl sm:p-7 md:p-8">

            {/* Profile Heading */}

            <div className="mb-6 flex items-center gap-3 sm:mb-7 sm:gap-4">

              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 text-base font-extrabold text-white shadow-lg shadow-indigo-500/20 sm:h-14 sm:w-14 sm:rounded-2xl sm:text-lg">

                <div className="absolute -inset-1 -z-10 animate-pulse rounded-2xl bg-indigo-500/20 blur-md" />

                VR
              </div>

              <div className="min-w-0">

                <h3 className="text-lg font-extrabold text-white sm:text-xl">
                  {heroName}
                </h3>

                <p className="mt-1 text-xs font-semibold text-indigo-400 sm:text-sm">
                  {heroRole}
                </p>

              </div>
            </div>

            {/* Introduction */}

            <div className="space-y-4 text-sm leading-7 text-gray-400 sm:space-y-5 sm:text-[15px]">

              <p>
                I am a passionate{' '}
                <strong className="font-semibold text-gray-200">
                  MERN Stack Developer
                </strong>{' '}
                focused on developing responsive, scalable and user-friendly
                web applications using modern JavaScript technologies.
              </p>

              <p>
                My core specialization is{' '}
                <strong className="font-semibold text-gray-200">
                  frontend development with React.js
                </strong>
                , while I also work across the backend with Node.js,
                Express.js and MongoDB to build complete full-stack solutions.
              </p>

              <p>
                I have worked on multiple web development projects involving
                responsive interfaces, REST APIs, database integration,
                authentication and modern development workflows.
              </p>

              <p>
                My goal is to grow as a strong software engineer by working on
                real-world products, solving meaningful problems and
                continuously improving my development skills.
              </p>

            </div>

            {/* =================================================
                CURRENT ROLE
            ================================================== */}

            <div className="mt-7 rounded-2xl border border-indigo-400/10 bg-indigo-500/[0.05] p-4 shadow-inner shadow-indigo-500/[0.03] sm:mt-8 sm:p-5">

              <div className="flex items-start gap-3 sm:gap-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 sm:h-11 sm:w-11">
                  <FaBriefcase />
                </div>

                <div className="min-w-0">

                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-indigo-400 sm:text-xs">
                    Current Role
                  </p>

                  <h4 className="mt-1 text-sm font-bold leading-6 text-white sm:text-base">
                    {currentExperience?.role || 'No experience information available'}
                  </h4>

                  <p className="mt-1 text-xs font-medium leading-5 text-indigo-400 sm:text-sm">
                    {currentExperience
                      ? [
                          currentExperience.company,
                          currentExperience.duration,
                        ]
                          .filter(Boolean)
                          .join(' · ')
                      : 'Add experience from the admin dashboard'}
                  </p>

                  <p className="mt-2 text-xs leading-6 text-gray-400 sm:text-sm">
                    {currentExperience?.description ||
                      'Your latest professional experience will appear here automatically after it is saved from the admin dashboard.'}
                  </p>

                </div>
              </div>
            </div>

            {/* =================================================
                OPEN TO OPPORTUNITIES
            ================================================== */}

            <div className="mt-3 flex items-start gap-3 rounded-2xl border border-green-500/15 bg-green-500/[0.04] px-4 py-3.5 sm:mt-4 sm:px-5 sm:py-4">

              <span className="relative mt-1 flex h-3 w-3 shrink-0">

                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />

                <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)]" />

              </span>

              <div className="min-w-0">

                <p className="text-xs font-bold leading-5 text-green-400 sm:text-sm">
                  Open to Opportunities
                </p>

                <p className="mt-0.5 text-[11px] leading-5 text-green-400/60 sm:text-xs">
                  Interested in MERN, frontend and full-stack development roles.
                </p>

              </div>

            </div>

          </div>

          {/* ===================================================
              RIGHT — CAREER & EDUCATION
          ==================================================== */}

          <div className="min-w-0 space-y-5 sm:space-y-6">

            {/* =================================================
                EDUCATION
            ================================================== */}

            <div className="group rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 shadow-[0_0_35px_rgba(99,102,241,0.03)] backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-indigo-400/20 hover:bg-white/[0.04] hover:shadow-[0_0_45px_rgba(99,102,241,0.08)] sm:rounded-3xl sm:p-7">

              <div className="flex items-start gap-3 sm:gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-lg text-indigo-400 sm:h-12 sm:w-12 sm:rounded-2xl sm:text-xl">
                  <FaGraduationCap />
                </div>

                <div className="min-w-0">

                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-indigo-400 sm:text-xs">
                    Education
                  </p>

                  <h3 className="mt-2 break-words text-base font-extrabold leading-6 text-white sm:text-lg">
                    {currentEducation?.degree || 'No education information available'}
                  </h3>

                  <p className="mt-1 text-sm font-semibold text-gray-400">
                    {currentEducation?.institution ||
                      'Add education from the admin dashboard'}
                  </p>

                  <p className="mt-3 text-xs leading-6 text-gray-500 sm:text-sm">
                    {currentEducation?.description ||
                      'Your latest education information will appear here automatically after it is saved from the admin dashboard.'}
                  </p>

                  <div className="mt-4 inline-flex rounded-full border border-indigo-400/10 bg-indigo-500/[0.06] px-3 py-1.5 text-[11px] font-semibold text-indigo-300 sm:text-xs">
                    {currentEducation?.status || currentEducation?.duration || 'Education'}
                  </div>

                </div>
              </div>

            </div>

            {/* =================================================
                PREVIOUS EDUCATION
            ================================================== */}

            <div className="group rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 shadow-[0_0_35px_rgba(168,85,247,0.03)] backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-purple-400/20 hover:bg-white/[0.04] hover:shadow-[0_0_45px_rgba(168,85,247,0.08)] sm:rounded-3xl sm:p-7">

              <div className="flex items-start gap-3 sm:gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-lg text-purple-400 sm:h-12 sm:w-12 sm:rounded-2xl sm:text-xl">
                  <FaGraduationCap />
                </div>

                <div className="min-w-0">

                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-purple-400 sm:text-xs">
                    Bachelor's Degree
                  </p>

                  <h3 className="mt-2 break-words text-base font-extrabold leading-6 text-white sm:text-lg">
                    {previousEducation?.degree || 'Previous education'}
                  </h3>

                  <p className="mt-1 text-sm font-semibold text-gray-400">
                    {previousEducation?.institution ||
                      'Add education from the admin dashboard'}
                  </p>

                  <p className="mt-2 text-xs font-medium text-gray-500">
                    {previousEducation?.duration ||
                      previousEducation?.status ||
                      'Education details will appear here'}
                  </p>

                </div>
              </div>

            </div>

            {/* =================================================
                CAREER GOAL
            ================================================== */}

            <div className="group rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 shadow-[0_0_35px_rgba(34,197,94,0.03)] backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-green-400/20 hover:bg-white/[0.04] hover:shadow-[0_0_45px_rgba(34,197,94,0.08)] sm:rounded-3xl sm:p-7">

              <div className="flex items-start gap-3 sm:gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-lg text-green-400 sm:h-12 sm:w-12 sm:rounded-2xl sm:text-xl">
                  <FaRocket />
                </div>

                <div className="min-w-0">

                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-green-400 sm:text-xs">
                    Career Goal
                  </p>

                  <h3 className="mt-2 break-words text-base font-extrabold leading-6 text-white sm:text-lg">
                    Growing as a Software Engineer
                  </h3>

                  <p className="mt-2 text-xs leading-6 text-gray-500 sm:text-sm">
                    My goal is to contribute to impactful products, work with
                    strong engineering teams and build scalable software that
                    creates real value for users.
                  </p>

                </div>
              </div>

            </div>

          </div>
        </div>

        {/* =====================================================
            CORE EXPERTISE
        ====================================================== */}

        <div className="mt-12 sm:mt-16">

          <div className="mb-7 text-center sm:mb-8">

            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-400 sm:text-xs">
              What I Specialize In
            </p>

            <h3 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl">
              My Core Expertise
            </h3>

          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">

            {expertise.map((item) => (
              <div
                key={item.title}
                className="group relative min-w-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 shadow-[0_0_35px_rgba(99,102,241,0.03)] backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-indigo-400/20 hover:bg-white/[0.04] hover:shadow-[0_0_45px_rgba(99,102,241,0.1)] sm:rounded-3xl sm:p-6"
              >

                {/* Card Glow */}

                <div className="pointer-events-none absolute -right-12 -top-12 h-24 w-24 rounded-full bg-indigo-500/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative z-10">

                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10 text-lg text-indigo-400 transition-all duration-300 group-hover:scale-110 group-hover:bg-indigo-500/15 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] sm:mb-5 sm:h-12 sm:w-12 sm:rounded-2xl sm:text-xl">
                    {item.icon}
                  </div>

                  <h4 className="break-words text-base font-bold text-white sm:text-lg">
                    {item.title}
                  </h4>

                  <p className="mt-2.5 text-xs leading-6 text-gray-500 sm:mt-3 sm:text-sm">
                    {item.description}
                  </p>

                </div>
              </div>
            ))}

          </div>

        </div>

        {/* =====================================================
            DEVELOPMENT STRENGTHS
        ====================================================== */}

        <div className="mt-10 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 shadow-[0_0_40px_rgba(99,102,241,0.03)] backdrop-blur-md sm:mt-12 sm:rounded-3xl sm:p-7 md:p-8">

          <div className="mb-5 sm:mb-6">

            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-400 sm:text-xs">
              Development Strengths
            </p>

            <h3 className="mt-2 text-xl font-extrabold leading-tight text-white sm:text-2xl">
              What I Bring
            </h3>

          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">

            {strengths.map((strength) => (
              <div
                key={strength}
                className="group flex min-w-0 items-start gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] px-3.5 py-3 transition-all duration-300 hover:border-indigo-400/10 hover:bg-indigo-500/[0.05] sm:items-center sm:px-4"
              >

                <FaCheckCircle className="mt-0.5 shrink-0 text-sm text-indigo-400 transition-transform duration-300 group-hover:scale-110 sm:mt-0" />

                <span className="min-w-0 break-words text-xs font-medium leading-5 text-gray-400 sm:text-sm">
                  {strength}
                </span>

              </div>
            ))}

          </div>

        </div>

        {/* =====================================================
            QUICK STATISTICS
        ====================================================== */}

        <div className="mt-8 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] shadow-[0_0_40px_rgba(99,102,241,0.04)] backdrop-blur-md sm:mt-12 sm:rounded-3xl">

          <div className="grid grid-cols-2 md:grid-cols-4">

            {quickStats.map((stat, index) => (
              <div
                key={stat.label}
                className={`group relative overflow-hidden px-3 py-5 text-center transition-all duration-300 hover:bg-indigo-500/[0.04] sm:px-6 sm:py-7 ${
                  index < 2
                    ? 'border-b border-white/[0.06]'
                    : ''
                } ${
                  index % 2 === 0
                    ? 'border-r border-white/[0.06]'
                    : ''
                } md:border-b-0 md:border-r md:last:border-r-0`}
              >

                {/* Animated Glow */}

                <div className="pointer-events-none absolute left-1/2 top-0 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <p className="relative break-words text-2xl font-extrabold tracking-tight text-indigo-400 sm:text-3xl">
                  {stat.value}
                </p>

                <p className="relative mt-1.5 text-[11px] font-medium leading-5 text-gray-500 sm:mt-2 sm:text-sm">
                  {stat.label}
                </p>

              </div>
            ))}

          </div>

        </div>

      </div>

      {/* =====================================================
          ABOUT-SPECIFIC ANIMATIONS
      ====================================================== */}

      <style>
        {`
          @keyframes aboutOrbOne {
            0%,
            100% {
              transform: translate3d(0, 0, 0) scale(1);
            }

            50% {
              transform: translate3d(90px, 50px, 0) scale(1.15);
            }
          }

          @keyframes aboutOrbTwo {
            0%,
            100% {
              transform: translate3d(0, 0, 0) scale(1);
            }

            50% {
              transform: translate3d(-80px, -60px, 0) scale(1.12);
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

export default About;
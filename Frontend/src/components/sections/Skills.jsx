import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaNodeJs,
  FaGitAlt,
  FaGithub,
} from 'react-icons/fa';

import {
  SiTailwindcss,
  SiBootstrap,
  SiExpress,
  SiMongodb,
  SiMysql,
  SiPostman,
} from 'react-icons/si';

import {
  HiOutlineCode,
  HiOutlineServer,
  HiOutlineDatabase,
  HiOutlineCog,
} from 'react-icons/hi';

const skillCategories = [
  {
    title: 'Frontend',
    description:
      'Building responsive, interactive and user-friendly interfaces.',
    icon: <HiOutlineCode />,
    skills: [
      {
        name: 'HTML',
        icon: <FaHtml5 />,
        level: 'Advanced',
        progress: 90,
      },
      {
        name: 'CSS',
        icon: <FaCss3Alt />,
        level: 'Advanced',
        progress: 88,
      },
      {
        name: 'JavaScript',
        icon: <FaJs />,
        level: 'Advanced',
        progress: 85,
      },
      {
        name: 'React',
        icon: <FaReact />,
        level: 'Advanced',
        progress: 85,
      },
      {
        name: 'Tailwind CSS',
        icon: <SiTailwindcss />,
        level: 'Intermediate',
        progress: 78,
      },
      {
        name: 'Bootstrap',
        icon: <SiBootstrap />,
        level: 'Intermediate',
        progress: 75,
      },
    ],
  },

  {
    title: 'Backend',
    description:
      'Developing server-side applications and RESTful APIs.',
    icon: <HiOutlineServer />,
    skills: [
      {
        name: 'Node.js',
        icon: <FaNodeJs />,
        level: 'Intermediate',
        progress: 75,
      },
      {
        name: 'Express.js',
        icon: <SiExpress />,
        level: 'Intermediate',
        progress: 75,
      },
      {
        name: 'REST APIs',
        icon: <HiOutlineServer />,
        level: 'Intermediate',
        progress: 72,
      },
    ],
  },

  {
    title: 'Database',
    description:
      'Managing application data and database-driven solutions.',
    icon: <HiOutlineDatabase />,
    skills: [
      {
        name: 'MongoDB',
        icon: <SiMongodb />,
        level: 'Intermediate',
        progress: 78,
      },
      {
        name: 'MySQL',
        icon: <SiMysql />,
        level: 'Intermediate',
        progress: 68,
      },
    ],
  },

  {
    title: 'Tools',
    description:
      'Development tools and workflows used in everyday projects.',
    icon: <HiOutlineCog />,
    skills: [
      {
        name: 'Git',
        icon: <FaGitAlt />,
        level: 'Intermediate',
        progress: 80,
      },
      {
        name: 'GitHub',
        icon: <FaGithub />,
        level: 'Intermediate',
        progress: 82,
      },
      {
        name: 'Postman',
        icon: <SiPostman />,
        level: 'Intermediate',
        progress: 75,
      },
      {
        name: 'VS Code',
        icon: <HiOutlineCode />,
        level: 'Advanced',
        progress: 90,
      },
    ],
  },
];

function Skills() {
  return (
    <section
      id="skills"
      className="relative overflow-hidden bg-transparent px-4 py-16 text-white transition-colors duration-500 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      {/* =====================================================
          LOCAL COSMIC GLOW
      ====================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-20 h-72 w-72 animate-[skillsOrbOne_15s_ease-in-out_infinite] rounded-full bg-indigo-600/10 blur-[110px] sm:h-96 sm:w-96"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-20 h-72 w-72 animate-[skillsOrbTwo_18s_ease-in-out_infinite] rounded-full bg-purple-600/10 blur-[110px] sm:h-96 sm:w-96"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/5 blur-[120px]"
      />

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* =====================================================
            SECTION HEADER
        ====================================================== */}

        <div className="mb-12 text-center sm:mb-16">

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-indigo-400 sm:text-sm">
            My Tech Stack
          </p>

          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
            Skills &{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Technologies
            </span>
          </h2>

          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 shadow-[0_0_18px_rgba(99,102,241,0.5)]" />

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base sm:leading-8 md:text-lg">
            A collection of technologies and tools I use to build modern,
            responsive and scalable web applications.
          </p>

        </div>

        {/* =====================================================
            SKILL CATEGORIES
        ====================================================== */}

        <div className="grid gap-5 sm:gap-6 lg:grid-cols-2">

          {skillCategories.map((category) => (
            <div
              key={category.title}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 shadow-[0_0_40px_rgba(99,102,241,0.03)] backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-indigo-400/20 hover:bg-white/[0.04] hover:shadow-[0_0_50px_rgba(99,102,241,0.08)] sm:rounded-3xl sm:p-6"
            >

              {/* Card Glow */}

              <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              {/* =================================================
                  CATEGORY HEADER
              ================================================== */}

              <div className="relative z-10 mb-6 flex items-start gap-3 sm:mb-7 sm:gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-xl text-indigo-400 transition-all duration-300 group-hover:scale-105 group-hover:bg-indigo-500/15 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] sm:h-12 sm:w-12 sm:rounded-2xl sm:text-2xl">
                  {category.icon}
                </div>

                <div className="min-w-0">

                  <h3 className="text-lg font-bold text-white sm:text-xl">
                    {category.title}
                  </h3>

                  <p className="mt-1 text-xs leading-6 text-gray-500 sm:text-sm">
                    {category.description}
                  </p>

                </div>

              </div>

              {/* =================================================
                  SKILLS
              ================================================== */}

              <div className="relative z-10 grid gap-3 sm:grid-cols-2 sm:gap-4">

                {category.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="group/skill relative overflow-hidden rounded-2xl border border-white/[0.07] bg-black/40 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/20 hover:bg-white/[0.035] hover:shadow-[0_0_25px_rgba(99,102,241,0.07)]"
                  >

                    {/* Skill Glow */}

                    <div className="pointer-events-none absolute -right-8 -top-8 h-16 w-16 rounded-full bg-indigo-500/10 blur-2xl opacity-0 transition-opacity duration-300 group-hover/skill:opacity-100" />

                    {/* =================================================
                        SKILL TOP
                    ================================================== */}

                    <div className="relative flex items-center justify-between gap-3">

                      <div className="flex min-w-0 items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.035] text-xl text-gray-300 transition-all duration-300 group-hover/skill:scale-110 group-hover/skill:border-indigo-400/20 group-hover/skill:text-indigo-400">
                          {skill.icon}
                        </div>

                        <div className="min-w-0">

                          <p className="truncate text-sm font-bold text-gray-200">
                            {skill.name}
                          </p>

                          <p className="mt-0.5 text-[11px] font-medium text-gray-500">
                            {skill.level}
                          </p>

                        </div>

                      </div>

                      <span className="shrink-0 text-xs font-bold text-indigo-400">
                        {skill.progress}%
                      </span>

                    </div>

                    {/* =================================================
                        PROGRESS BAR
                    ================================================== */}

                    <div className="relative mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">

                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 shadow-[0_0_10px_rgba(99,102,241,0.4)] transition-all duration-1000 ease-out group-hover/skill:shadow-[0_0_16px_rgba(99,102,241,0.7)]"
                        style={{
                          width: `${skill.progress}%`,
                        }}
                      />

                    </div>

                  </div>
                ))}

              </div>

            </div>
          ))}

        </div>

        {/* =====================================================
            MERN STACK SUMMARY
        ====================================================== */}

        <div className="relative mt-8 overflow-hidden rounded-2xl border border-indigo-400/10 bg-gradient-to-r from-indigo-500/[0.06] via-purple-500/[0.04] to-cyan-500/[0.05] p-5 shadow-[0_0_45px_rgba(99,102,241,0.04)] backdrop-blur-md sm:mt-10 sm:rounded-3xl sm:p-7 md:p-8">

          {/* Animated Glow */}

          <div className="pointer-events-none absolute -left-20 top-1/2 h-40 w-40 -translate-y-1/2 animate-[mernGlow_8s_ease-in-out_infinite] rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative flex flex-col items-center justify-between gap-6 lg:flex-row">

            {/* Text */}

            <div className="text-center lg:text-left">

              <p className="text-base font-bold text-white sm:text-lg">
                MERN Stack Developer
              </p>

              <p className="mt-1 max-w-xl text-xs leading-6 text-gray-500 sm:text-sm">
                My primary development stack for creating complete,
                production-ready web applications.
              </p>

            </div>

            {/* Technologies */}

            <div className="flex flex-wrap justify-center gap-2">

              {[
                'MongoDB',
                'Express.js',
                'React',
                'Node.js',
              ].map((technology) => (
                <span
                  key={technology}
                  className="rounded-full border border-indigo-400/10 bg-indigo-500/[0.08] px-3.5 py-2 text-[11px] font-bold text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/25 hover:bg-indigo-500/[0.14] hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] sm:px-4 sm:text-xs"
                >
                  {technology}
                </span>
              ))}

            </div>

          </div>

        </div>

        {/* =====================================================
            SKILLS FOOTER
        ====================================================== */}

        <div className="mt-7 text-center sm:mt-8">

          <p className="text-xs text-gray-600 sm:text-sm">
            Always learning, improving and exploring new technologies.
          </p>

        </div>

      </div>

      {/* =====================================================
          SKILLS ANIMATIONS
      ====================================================== */}

      <style>
        {`
          @keyframes skillsOrbOne {
            0%,
            100% {
              transform: translate3d(0, 0, 0) scale(1);
            }

            50% {
              transform: translate3d(100px, 50px, 0) scale(1.15);
            }
          }

          @keyframes skillsOrbTwo {
            0%,
            100% {
              transform: translate3d(0, 0, 0) scale(1);
            }

            50% {
              transform: translate3d(-100px, -60px, 0) scale(1.12);
            }
          }

          @keyframes mernGlow {
            0%,
            100% {
              transform: translateY(-50%) translateX(0);
              opacity: 0.4;
            }

            50% {
              transform: translateY(-50%) translateX(120px);
              opacity: 0.8;
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

export default Skills;
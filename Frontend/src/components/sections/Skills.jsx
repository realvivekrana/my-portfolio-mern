import { useEffect, useState } from 'react';

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

import API from '../../utils/axios';

/*
|--------------------------------------------------------------------------
| ICON MAP
|--------------------------------------------------------------------------
| Backend se icon ka naam string ke form mein aayega.
|
| Example:
|
| "react"
| "mongodb"
| "node"
|
| Frontend par us string ko actual React Icon mein convert karenge.
|--------------------------------------------------------------------------
*/

const skillIconMap = {
  html: <FaHtml5 />,
  css: <FaCss3Alt />,
  javascript: <FaJs />,
  react: <FaReact />,

  tailwind: <SiTailwindcss />,
  bootstrap: <SiBootstrap />,

  node: <FaNodeJs />,
  express: <SiExpress />,

  mongodb: <SiMongodb />,
  mysql: <SiMysql />,

  git: <FaGitAlt />,
  github: <FaGithub />,

  postman: <SiPostman />,

  server: <HiOutlineServer />,
  database: <HiOutlineDatabase />,
  tools: <HiOutlineCog />,
  code: <HiOutlineCode />,
};

/*
|--------------------------------------------------------------------------
| CATEGORY ICON MAP
|--------------------------------------------------------------------------
*/

const categoryIconMap = {
  code: <HiOutlineCode />,
  server: <HiOutlineServer />,
  database: <HiOutlineDatabase />,
  tools: <HiOutlineCog />,
};

/*
|--------------------------------------------------------------------------
| DEFAULT ICON
|--------------------------------------------------------------------------
*/

const getSkillIcon = (icon) => {
  return (
    skillIconMap[icon] ||
    skillIconMap.code
  );
};

/*
|--------------------------------------------------------------------------
| DEFAULT CATEGORY ICON
|--------------------------------------------------------------------------
*/

const getCategoryIcon = (icon) => {
  return (
    categoryIconMap[icon] ||
    categoryIconMap.code
  );
};

/*
|--------------------------------------------------------------------------
| DEFAULT SKILLS
|--------------------------------------------------------------------------
| Agar API temporarily unavailable ho to UI completely blank nahi hogi.
|--------------------------------------------------------------------------
*/

const defaultSkillCategories = [
  {
    title: 'Frontend',
    description:
      'Building responsive, interactive and user-friendly interfaces.',
    icon: 'code',
    skills: [
      {
        name: 'HTML',
        icon: 'html',
        level: 'Advanced',
        progress: 90,
      },
      {
        name: 'CSS',
        icon: 'css',
        level: 'Advanced',
        progress: 88,
      },
      {
        name: 'JavaScript',
        icon: 'javascript',
        level: 'Advanced',
        progress: 85,
      },
      {
        name: 'React',
        icon: 'react',
        level: 'Advanced',
        progress: 85,
      },
      {
        name: 'Tailwind CSS',
        icon: 'tailwind',
        level: 'Intermediate',
        progress: 78,
      },
      {
        name: 'Bootstrap',
        icon: 'bootstrap',
        level: 'Intermediate',
        progress: 75,
      },
    ],
  },

  {
    title: 'Backend',
    description:
      'Developing server-side applications and RESTful APIs.',
    icon: 'server',
    skills: [
      {
        name: 'Node.js',
        icon: 'node',
        level: 'Intermediate',
        progress: 75,
      },
      {
        name: 'Express.js',
        icon: 'express',
        level: 'Intermediate',
        progress: 75,
      },
      {
        name: 'REST APIs',
        icon: 'server',
        level: 'Intermediate',
        progress: 72,
      },
    ],
  },

  {
    title: 'Database',
    description:
      'Managing application data and database-driven solutions.',
    icon: 'database',
    skills: [
      {
        name: 'MongoDB',
        icon: 'mongodb',
        level: 'Intermediate',
        progress: 78,
      },
      {
        name: 'MySQL',
        icon: 'mysql',
        level: 'Intermediate',
        progress: 68,
      },
    ],
  },

  {
    title: 'Tools',
    description:
      'Development tools and workflows used in everyday projects.',
    icon: 'tools',
    skills: [
      {
        name: 'Git',
        icon: 'git',
        level: 'Intermediate',
        progress: 80,
      },
      {
        name: 'GitHub',
        icon: 'github',
        level: 'Intermediate',
        progress: 82,
      },
      {
        name: 'Postman',
        icon: 'postman',
        level: 'Intermediate',
        progress: 75,
      },
      {
        name: 'VS Code',
        icon: 'code',
        level: 'Advanced',
        progress: 90,
      },
    ],
  },
];

/*
|--------------------------------------------------------------------------
| Skills
|--------------------------------------------------------------------------
*/

function Skills() {
  /*
  |--------------------------------------------------------------------------
  | STATE
  |--------------------------------------------------------------------------
  */

  const [
    skillCategories,
    setSkillCategories,
  ] = useState(
    defaultSkillCategories
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  /*
  |--------------------------------------------------------------------------
  | FETCH SKILLS FROM BACKEND
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let mounted = true;

    const fetchSkills = async () => {
      try {
        const response =
          await API.get(
            '/portfolio'
          );

        if (!mounted) {
          return;
        }

        const portfolio =
          response?.data?.data ||
          response?.data ||
          {};

        const backendSkills =
          Array.isArray(
            portfolio.skills
          )
            ? portfolio.skills
            : [];

        /*
        |--------------------------------------------------------------------------
        | Only use backend skills if available
        |--------------------------------------------------------------------------
        */

        if (
          backendSkills.length > 0
        ) {
          /*
          |----------------------------------------------------------------------
          | Filter hidden categories
          |----------------------------------------------------------------------
          */

          const visibleCategories =
            backendSkills
              .filter(
                (category) =>
                  category?.isVisible !==
                  false
              )
              .sort(
                (a, b) =>
                  (
                    Number(
                      a?.displayOrder
                    ) || 0
                  ) -
                  (
                    Number(
                      b?.displayOrder
                    ) || 0
                  )
              )
              .map(
                (category) => ({
                  ...category,

                  /*
                  |----------------------------------------------------------------
                  | Filter hidden/invalid skills
                  |----------------------------------------------------------------
                  */

                  skills:
                    Array.isArray(
                      category?.skills
                    )
                      ? category.skills
                          .filter(
                            (skill) =>
                              skill &&
                              skill.name &&
                              skill.isVisible !==
                                false
                          )
                          .sort(
                            (a, b) =>
                              (
                                Number(
                                  a?.displayOrder
                                ) || 0
                              ) -
                              (
                                Number(
                                  b?.displayOrder
                                ) || 0
                              )
                          )
                      : [],
                })
              );

          setSkillCategories(
            visibleCategories
          );
        }
      } catch (error) {
        /*
        |--------------------------------------------------------------------------
        | Keep default skills if API fails
        |--------------------------------------------------------------------------
        */

        console.error(
          'Failed to load skills:',
          error
        );

        if (mounted) {
          setSkillCategories(
            defaultSkillCategories
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchSkills();

    return () => {
      mounted = false;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <section
        id="skills"
        className="relative overflow-hidden bg-transparent px-4 py-16 text-white transition-colors duration-500 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
      >
        <div className="relative z-10 mx-auto max-w-7xl">

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

            <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400" />

          </div>

          <div className="grid gap-5 sm:gap-6 lg:grid-cols-2">

            {defaultSkillCategories.map(
              (category) => (
                <div
                  key={
                    category.title
                  }
                  className="animate-pulse rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 sm:rounded-3xl sm:p-6"
                >

                  <div className="flex items-center gap-4">

                    <div className="h-12 w-12 rounded-2xl bg-white/10" />

                    <div className="flex-1">

                      <div className="h-5 w-32 rounded bg-white/10" />

                      <div className="mt-2 h-3 w-56 max-w-full rounded bg-white/5" />

                    </div>

                  </div>

                  <div className="mt-7 grid gap-4 sm:grid-cols-2">

                    {category.skills.map(
                      (
                        skill
                      ) => (
                        <div
                          key={
                            skill.name
                          }
                          className="rounded-2xl border border-white/[0.07] bg-black/40 p-4"
                        >
                          <div className="h-10 rounded bg-white/5" />

                          <div className="mt-4 h-1.5 rounded-full bg-white/5" />
                        </div>
                      )
                    )}

                  </div>

                </div>
              )
            )}

          </div>

        </div>
      </section>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | MAIN UI
  |--------------------------------------------------------------------------
  */

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
            EMPTY STATE
        ====================================================== */}

        {skillCategories.length ===
          0 && (
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-10 text-center">

            <HiOutlineCode className="mx-auto text-4xl text-gray-500" />

            <h3 className="mt-4 text-xl font-bold text-white">
              Skills coming soon
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Skills information will be updated soon.
            </p>

          </div>
        )}

        {/* =====================================================
            SKILL CATEGORIES
        ====================================================== */}

        <div className="grid gap-5 sm:gap-6 lg:grid-cols-2">

          {skillCategories.map(
            (category) => (
              <div
                key={
                  category._id ||
                  category.title
                }
                className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 shadow-[0_0_40px_rgba(99,102,241,0.03)] backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-indigo-400/20 hover:bg-white/[0.04] hover:shadow-[0_0_50px_rgba(99,102,241,0.08)] sm:rounded-3xl sm:p-6"
              >

                <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {/* =================================================
                    CATEGORY HEADER
                ================================================== */}

                <div className="relative z-10 mb-6 flex items-start gap-3 sm:mb-7 sm:gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-xl text-indigo-400 transition-all duration-300 group-hover:scale-105 group-hover:bg-indigo-500/15 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] sm:h-12 sm:w-12 sm:rounded-2xl sm:text-2xl">
                    {getCategoryIcon(
                      category.icon
                    )}
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

                  {(
                    category.skills ||
                    []
                  ).map(
                    (skill) => (
                      <div
                        key={
                          skill._id ||
                          skill.name
                        }
                        className="group/skill relative overflow-hidden rounded-2xl border border-white/[0.07] bg-black/40 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/20 hover:bg-white/[0.035] hover:shadow-[0_0_25px_rgba(99,102,241,0.07)]"
                      >

                        <div className="pointer-events-none absolute -right-8 -top-8 h-16 w-16 rounded-full bg-indigo-500/10 blur-2xl opacity-0 transition-opacity duration-300 group-hover/skill:opacity-100" />

                        <div className="relative flex items-center justify-between gap-3">

                          <div className="flex min-w-0 items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.035] text-xl text-gray-300 transition-all duration-300 group-hover/skill:scale-110 group-hover/skill:border-indigo-400/20 group-hover/skill:text-indigo-400">
                              {getSkillIcon(
                                skill.icon
                              )}
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
                            {Math.min(
                              100,
                              Math.max(
                                0,
                                Number(
                                  skill.progress
                                ) ||
                                  0
                              )
                            )}
                            %
                          </span>

                        </div>

                        {/* =================================================
                            PROGRESS BAR
                        ================================================== */}

                        <div className="relative mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">

                          <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 shadow-[0_0_10px_rgba(99,102,241,0.4)] transition-all duration-1000 ease-out group-hover/skill:shadow-[0_0_16px_rgba(99,102,241,0.7)]"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.max(
                                  0,
                                  Number(
                                    skill.progress
                                  ) ||
                                    0
                                )
                              )}%`,
                            }}
                          />

                        </div>

                      </div>
                    )
                  )}

                </div>

              </div>
            )
          )}

        </div>

        {/* =====================================================
            MERN STACK SUMMARY
        ====================================================== */}

        <div className="relative mt-8 overflow-hidden rounded-2xl border border-indigo-400/10 bg-gradient-to-r from-indigo-500/[0.06] via-purple-500/[0.04] to-cyan-500/[0.05] p-5 shadow-[0_0_45px_rgba(99,102,241,0.04)] backdrop-blur-md sm:mt-10 sm:rounded-3xl sm:p-7 md:p-8">

          <div className="pointer-events-none absolute -left-20 top-1/2 h-40 w-40 -translate-y-1/2 animate-[mernGlow_8s_ease-in-out_infinite] rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative flex flex-col items-center justify-between gap-6 lg:flex-row">

            <div className="text-center lg:text-left">

              <p className="text-base font-bold text-white sm:text-lg">
                MERN Stack Developer
              </p>

              <p className="mt-1 max-w-xl text-xs leading-6 text-gray-500 sm:text-sm">
                My primary development stack for creating complete,
                production-ready web applications.
              </p>

            </div>

            <div className="flex flex-wrap justify-center gap-2">

              {[
                'MongoDB',
                'Express.js',
                'React',
                'Node.js',
              ].map(
                (technology) => (
                  <span
                    key={
                      technology
                    }
                    className="rounded-full border border-indigo-400/10 bg-indigo-500/[0.08] px-3.5 py-2 text-[11px] font-bold text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/25 hover:bg-indigo-500/[0.14] hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] sm:px-4 sm:text-xs"
                  >
                    {technology}
                  </span>
                )
              )}

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
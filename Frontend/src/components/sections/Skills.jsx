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
      className="relative overflow-hidden bg-white px-6 py-24 transition-colors duration-500 dark:bg-gray-950"
    >
      {/* =====================================================
          BACKGROUND DECORATION
      ====================================================== */}

      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-indigo-200/20 blur-3xl dark:bg-indigo-600/5" />

      <div className="pointer-events-none absolute -right-40 bottom-20 h-80 w-80 rounded-full bg-purple-200/20 blur-3xl dark:bg-purple-600/5" />

      <div className="relative mx-auto max-w-7xl">

        {/* =================================================
            SECTION HEADER
        ================================================== */}

        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
            My Tech Stack
          </p>

          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
            Skills &{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
              Technologies
            </span>
          </h2>

          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg dark:text-gray-400">
            A collection of technologies and tools I use to build modern,
            responsive and scalable web applications.
          </p>
        </div>

        {/* =================================================
            SKILL CATEGORIES
        ================================================== */}

        <div className="grid gap-6 lg:grid-cols-2">
          {skillCategories.map((category) => (
            <div
              key={category.title}
              className="group rounded-3xl border border-gray-200 bg-gray-50/70 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900/60 dark:hover:border-indigo-500/30"
            >
              {/* =================================================
                  CATEGORY HEADER
              ================================================== */}

              <div className="mb-7 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-2xl text-indigo-600 transition-transform duration-300 group-hover:scale-105 dark:bg-indigo-500/10 dark:text-indigo-400">
                  {category.icon}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {category.title}
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
                    {category.description}
                  </p>
                </div>
              </div>

              {/* =================================================
                  SKILLS
              ================================================== */}

              <div className="grid gap-4 sm:grid-cols-2">
                {category.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="group/skill rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-950 dark:hover:border-indigo-500/30"
                  >
                    {/* =================================================
                        SKILL TOP
                    ================================================== */}

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-xl text-gray-700 transition-transform duration-300 group-hover/skill:scale-110 dark:bg-gray-900 dark:text-gray-300">
                          {skill.icon}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-gray-800 dark:text-gray-200">
                            {skill.name}
                          </p>

                          <p className="mt-0.5 text-[11px] font-medium text-gray-400">
                            {skill.level}
                          </p>
                        </div>
                      </div>

                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {skill.progress}%
                      </span>
                    </div>

                    {/* =================================================
                        PROGRESS BAR
                    ================================================== */}

                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 ease-out group-hover/skill:from-indigo-400 group-hover/skill:to-purple-400"
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

        {/* =================================================
            MERN STACK SUMMARY
        ================================================== */}

        <div className="mt-10 rounded-3xl border border-gray-200 bg-gray-50 p-7 dark:border-gray-800 dark:bg-gray-900/60 sm:p-8">
          <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">

            <div className="text-center lg:text-left">
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                MERN Stack Developer
              </p>

              <p className="mt-1 max-w-xl text-sm leading-6 text-gray-500 dark:text-gray-400">
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
              ].map((technology) => (
                <span
                  key={technology}
                  className="rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-700 dark:border-indigo-500/10 dark:bg-indigo-500/10 dark:text-indigo-400"
                >
                  {technology}
                </span>
              ))}
            </div>

          </div>
        </div>

        {/* =================================================
            SKILLS FOOTER
        ================================================== */}

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Always learning, improving and exploring new technologies.
          </p>
        </div>

      </div>
    </section>
  );
}

export default Skills;
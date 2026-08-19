import {
  FaBriefcase,
  FaCode,
  FaLayerGroup,
  FaRocket,
  FaUsers,
} from 'react-icons/fa';

const experiences = [
  {
    role: 'Frontend Developer Intern',
    company: 'Athenura',
    duration: 'Feb 2026 – Present',
    type: 'Internship',
    location: 'Remote',
    description:
      'Working on modern web interfaces and production-focused frontend experiences using React.js and modern UI development practices.',
    responsibilities: [
      {
        icon: <FaCode />,
        text: 'Developed responsive and user-friendly React interfaces for modern web applications.',
      },
      {
        icon: <FaLayerGroup />,
        text: 'Built reusable and scalable UI components to maintain consistency across the application.',
      },
      {
        icon: <FaRocket />,
        text: 'Worked on improving website performance, usability and overall frontend experience.',
      },
      {
        icon: <FaUsers />,
        text: 'Collaborated with the development team to deliver production features and solve frontend challenges.',
      },
    ],
    technologies: [
      'React.js',
      'JavaScript',
      'HTML5',
      'CSS3',
      'Tailwind CSS',
      'Git',
      'GitHub',
    ],
  },
];

function Experience() {
  return (
    <section
      id="experience"
      className="relative overflow-hidden bg-white px-4 py-16 transition-colors duration-500 sm:px-6 sm:py-20 lg:py-24 dark:bg-gray-950"
    >
      {/* =====================================================
          BACKGROUND DECORATION
      ====================================================== */}

      <div className="pointer-events-none absolute -left-32 top-16 h-56 w-56 rounded-full bg-indigo-200/20 blur-3xl sm:-left-40 sm:top-20 sm:h-80 sm:w-80 dark:bg-indigo-600/5" />

      <div className="pointer-events-none absolute -right-32 bottom-16 h-56 w-56 rounded-full bg-purple-200/20 blur-3xl sm:-right-40 sm:bottom-20 sm:h-80 sm:w-80 dark:bg-purple-600/5" />

      <div className="relative mx-auto w-full max-w-5xl">

        {/* =====================================================
            SECTION HEADER
        ====================================================== */}

        <div className="mb-10 text-center sm:mb-14 md:mb-16">

          <p className="mb-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-indigo-600 sm:text-sm sm:tracking-[0.2em] dark:text-indigo-400">
            <FaBriefcase className="text-sm" />
            Career Journey
          </p>

          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl md:text-5xl dark:text-white">
            Experience &{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
              Work
            </span>
          </h2>

          <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 sm:mt-5 sm:w-16" />

          <p className="mx-auto mt-5 max-w-2xl px-1 text-sm leading-7 text-gray-600 sm:mt-6 sm:text-base sm:leading-8 md:text-lg dark:text-gray-400">
            Professional experience and hands-on work that have shaped my
            development journey.
          </p>
        </div>

        {/* =====================================================
            TIMELINE
        ====================================================== */}

        <div className="relative">

          {/* Desktop Timeline Line */}

          <div className="absolute bottom-0 left-6 top-0 hidden w-px bg-gradient-to-b from-indigo-500 via-purple-500 to-transparent md:block" />

          <div className="space-y-7 sm:space-y-10">

            {experiences.map((experience) => (
              <div
                key={`${experience.company}-${experience.role}`}
                className="relative md:pl-20"
              >

                {/* =================================================
                    DESKTOP TIMELINE DOT
                ================================================== */}

                <div className="absolute left-0 top-8 hidden h-12 w-12 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/20 md:flex dark:border-gray-950">
                  <FaBriefcase className="text-sm" />
                </div>

                {/* =================================================
                    EXPERIENCE CARD
                ================================================== */}

                <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-gray-50/70 shadow-sm transition-all duration-500 hover:border-indigo-200 hover:shadow-xl sm:rounded-3xl md:hover:-translate-y-1 dark:border-gray-800 dark:bg-gray-900/60 dark:hover:border-indigo-500/30">

                  {/* =================================================
                      CARD HEADER
                  ================================================== */}

                  <div className="border-b border-gray-200 bg-white p-5 sm:p-6 md:p-7 dark:border-gray-800 dark:bg-gray-950">

                    <div className="flex flex-col gap-5 sm:gap-6 md:flex-row md:items-start md:justify-between">

                      {/* Role Information */}

                      <div className="min-w-0">

                        {/* Mobile Icon */}

                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 sm:h-11 sm:w-11 md:hidden dark:bg-indigo-500/10 dark:text-indigo-400">
                          <FaBriefcase />
                        </div>

                        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-600 sm:text-xs dark:text-indigo-400">
                          {experience.type}
                        </p>

                        <h3 className="break-words text-xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-2xl dark:text-white">
                          {experience.role}
                        </h3>

                        <p className="mt-1.5 text-base font-bold text-gray-700 sm:text-lg dark:text-gray-300">
                          {experience.company}
                        </p>
                      </div>

                      {/* Duration */}

                      <div className="w-full sm:w-auto md:shrink-0">

                        <span className="inline-flex max-w-full items-center rounded-full border border-indigo-100 bg-indigo-50 px-3.5 py-2 text-[11px] font-bold leading-4 text-indigo-700 sm:px-4 sm:text-xs dark:border-indigo-500/10 dark:bg-indigo-500/10 dark:text-indigo-400">
                          {experience.duration}
                        </span>

                        <p className="mt-2 text-left text-xs font-medium text-gray-400 md:text-right">
                          {experience.location}
                        </p>

                      </div>
                    </div>

                    {/* Description */}

                    <p className="mt-5 text-sm leading-7 text-gray-600 sm:mt-6 dark:text-gray-400">
                      {experience.description}
                    </p>

                  </div>

                  {/* =================================================
                      RESPONSIBILITIES
                  ================================================== */}

                  <div className="p-5 sm:p-6 md:p-7">

                    <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400 sm:mb-5 sm:text-xs dark:text-gray-500">
                      Key Responsibilities
                    </p>

                    <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">

                      {experience.responsibilities.map(
                        (responsibility) => (
                          <div
                            key={responsibility.text}
                            className="group/item flex min-w-0 gap-3 rounded-xl border border-gray-200 bg-white p-3.5 transition-all duration-300 hover:border-indigo-200 hover:shadow-md sm:gap-4 sm:rounded-2xl sm:p-4 sm:hover:-translate-y-0.5 dark:border-gray-800 dark:bg-gray-950 dark:hover:border-indigo-500/20"
                          >

                            {/* Responsibility Icon */}

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-sm text-indigo-600 transition-transform duration-300 group-hover/item:scale-110 dark:bg-indigo-500/10 dark:text-indigo-400">
                              {responsibility.icon}
                            </div>

                            {/* Responsibility Text */}

                            <p className="min-w-0 text-xs leading-6 text-gray-600 sm:text-sm dark:text-gray-400">
                              {responsibility.text}
                            </p>

                          </div>
                        )
                      )}

                    </div>

                    {/* =================================================
                        TECHNOLOGIES
                    ================================================== */}

                    <div className="mt-6 border-t border-gray-200 pt-5 sm:mt-7 sm:pt-6 dark:border-gray-800">

                      <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400 sm:text-xs dark:text-gray-500">
                        Technologies Used
                      </p>

                      <div className="flex flex-wrap gap-2">

                        {experience.technologies.map((technology) => (
                          <span
                            key={technology}
                            className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-gray-600 transition-all duration-300 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 sm:px-3.5 sm:py-2 sm:text-xs dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400 dark:hover:border-indigo-500/20 dark:hover:bg-indigo-500/5 dark:hover:text-indigo-400"
                          >
                            {technology}
                          </span>
                        ))}

                      </div>

                    </div>

                  </div>
                </article>
              </div>
            ))}

          </div>
        </div>

        {/* =====================================================
            EXPERIENCE SUMMARY
        ====================================================== */}

        <div className="mt-8 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-5 text-center sm:mt-12 sm:rounded-3xl sm:p-7 md:p-8 dark:border-indigo-500/10 dark:from-indigo-950/30 dark:via-gray-950 dark:to-purple-950/20">

          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 sm:h-12 sm:w-12 sm:rounded-2xl dark:bg-indigo-500/10 dark:text-indigo-400">
            <FaRocket />
          </div>

          <h3 className="mt-4 text-lg font-extrabold text-gray-900 sm:text-xl dark:text-white">
            Building. Learning. Improving.
          </h3>

          <p className="mx-auto mt-2 max-w-2xl text-sm leading-7 text-gray-600 dark:text-gray-400">
            I continuously work on improving my development skills by building
            real-world projects, learning modern technologies and contributing
            to production-focused applications.
          </p>

        </div>

      </div>
    </section>
  );
}

export default Experience;
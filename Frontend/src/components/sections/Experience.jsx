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
      className="relative overflow-hidden bg-transparent px-4 py-16 text-white transition-colors duration-500 sm:px-6 sm:py-20 lg:py-24"
    >
      {/* =====================================================
          LOCAL COSMIC GLOW
      ====================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-16 h-60 w-60 animate-[experienceOrbOne_16s_ease-in-out_infinite] rounded-full bg-indigo-600/10 blur-[100px] sm:-left-40 sm:top-20 sm:h-80 sm:w-80"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-16 h-60 w-60 animate-[experienceOrbTwo_20s_ease-in-out_infinite] rounded-full bg-purple-600/10 blur-[100px] sm:-right-40 sm:bottom-20 sm:h-80 sm:w-80"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/5 blur-[110px]"
      />

      <div className="relative z-10 mx-auto w-full max-w-5xl">

        {/* =====================================================
            SECTION HEADER
        ====================================================== */}

        <div className="mb-10 text-center sm:mb-14 md:mb-16">

          <p className="mb-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-indigo-400 sm:text-sm sm:tracking-[0.2em]">
            <FaBriefcase className="text-sm" />
            Career Journey
          </p>

          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
            Experience &{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Work
            </span>
          </h2>

          <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 shadow-[0_0_18px_rgba(99,102,241,0.5)] sm:mt-5 sm:w-16" />

          <p className="mx-auto mt-5 max-w-2xl px-1 text-sm leading-7 text-gray-400 sm:mt-6 sm:text-base sm:leading-8 md:text-lg">
            Professional experience and hands-on work that have shaped my
            development journey.
          </p>

        </div>

        {/* =====================================================
            TIMELINE
        ====================================================== */}

        <div className="relative">

          {/* ===================================================
              DESKTOP TIMELINE LINE
          ==================================================== */}

          <div className="absolute bottom-0 left-6 top-0 hidden w-px bg-gradient-to-b from-indigo-500/80 via-purple-500/50 to-transparent md:block" />

          <div className="space-y-7 sm:space-y-10">

            {experiences.map((experience) => (
              <div
                key={`${experience.company}-${experience.role}`}
                className="relative md:pl-20"
              >

                {/* =================================================
                    DESKTOP TIMELINE DOT
                ================================================== */}

                <div className="absolute left-0 top-8 hidden h-12 w-12 items-center justify-center rounded-2xl border border-indigo-400/20 bg-black text-white shadow-[0_0_25px_rgba(99,102,241,0.25)] md:flex">

                  <div className="absolute inset-1 animate-pulse rounded-xl bg-indigo-500/10" />

                  <FaBriefcase className="relative z-10 text-sm text-indigo-400" />

                </div>

                {/* =================================================
                    EXPERIENCE CARD
                ================================================== */}

                <article className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] shadow-[0_0_45px_rgba(99,102,241,0.03)] backdrop-blur-md transition-all duration-500 hover:border-indigo-400/20 hover:bg-white/[0.04] hover:shadow-[0_0_55px_rgba(99,102,241,0.08)] md:hover:-translate-y-1 sm:rounded-3xl">

                  {/* Card Glow */}

                  <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* =================================================
                      CARD HEADER
                  ================================================== */}

                  <div className="relative border-b border-white/[0.07] bg-black/30 p-5 sm:p-6 md:p-7">

                    <div className="flex flex-col gap-5 sm:gap-6 md:flex-row md:items-start md:justify-between">

                      {/* =================================================
                          ROLE INFORMATION
                      ================================================== */}

                      <div className="min-w-0">

                        {/* Mobile Icon */}

                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-400/10 bg-indigo-500/10 text-indigo-400 sm:h-11 sm:w-11 md:hidden">
                          <FaBriefcase />
                        </div>

                        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-400 sm:text-xs">
                          {experience.type}
                        </p>

                        <h3 className="break-words text-xl font-extrabold leading-tight tracking-tight text-white sm:text-2xl">
                          {experience.role}
                        </h3>

                        <p className="mt-1.5 text-base font-bold text-gray-300 sm:text-lg">
                          {experience.company}
                        </p>

                      </div>

                      {/* =================================================
                          DURATION
                      ================================================== */}

                      <div className="w-full sm:w-auto md:shrink-0">

                        <span className="inline-flex max-w-full items-center rounded-full border border-indigo-400/10 bg-indigo-500/[0.08] px-3.5 py-2 text-[11px] font-bold leading-4 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.05)] sm:px-4 sm:text-xs">
                          {experience.duration}
                        </span>

                        <p className="mt-2 text-left text-xs font-medium text-gray-500 md:text-right">
                          {experience.location}
                        </p>

                      </div>

                    </div>

                    {/* =================================================
                        DESCRIPTION
                    ================================================== */}

                    <p className="mt-5 text-sm leading-7 text-gray-400 sm:mt-6">
                      {experience.description}
                    </p>

                  </div>

                  {/* =================================================
                      RESPONSIBILITIES
                  ================================================== */}

                  <div className="relative p-5 sm:p-6 md:p-7">

                    <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-500 sm:mb-5 sm:text-xs">
                      Key Responsibilities
                    </p>

                    <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">

                      {experience.responsibilities.map(
                        (responsibility) => (
                          <div
                            key={responsibility.text}
                            className="group/item flex min-w-0 gap-3 rounded-xl border border-white/[0.07] bg-black/30 p-3.5 transition-all duration-300 hover:border-indigo-400/15 hover:bg-indigo-500/[0.04] hover:shadow-[0_0_25px_rgba(99,102,241,0.05)] sm:gap-4 sm:rounded-2xl sm:p-4 sm:hover:-translate-y-0.5"
                          >

                            {/* Responsibility Icon */}

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-sm text-indigo-400 transition-all duration-300 group-hover/item:scale-110 group-hover/item:bg-indigo-500/15 group-hover/item:shadow-[0_0_15px_rgba(99,102,241,0.15)]">
                              {responsibility.icon}
                            </div>

                            {/* Responsibility Text */}

                            <p className="min-w-0 text-xs leading-6 text-gray-400 sm:text-sm">
                              {responsibility.text}
                            </p>

                          </div>
                        )
                      )}

                    </div>

                    {/* =================================================
                        TECHNOLOGIES
                    ================================================== */}

                    <div className="mt-6 border-t border-white/[0.07] pt-5 sm:mt-7 sm:pt-6">

                      <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-500 sm:text-xs">
                        Technologies Used
                      </p>

                      <div className="flex flex-wrap gap-2">

                        {experience.technologies.map((technology) => (
                          <span
                            key={technology}
                            className="rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5 text-[11px] font-semibold text-gray-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-400/20 hover:bg-indigo-500/[0.07] hover:text-indigo-300 hover:shadow-[0_0_15px_rgba(99,102,241,0.08)] sm:px-3.5 sm:py-2 sm:text-xs"
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

        <div className="relative mt-8 overflow-hidden rounded-2xl border border-indigo-400/10 bg-gradient-to-br from-indigo-500/[0.07] via-black/40 to-purple-500/[0.06] p-5 text-center shadow-[0_0_45px_rgba(99,102,241,0.04)] backdrop-blur-md sm:mt-12 sm:rounded-3xl sm:p-7 md:p-8">

          {/* Moving Glow */}

          <div className="pointer-events-none absolute -left-16 top-1/2 h-32 w-32 -translate-y-1/2 animate-[experienceGlow_8s_ease-in-out_infinite] rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative z-10">

            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-400/10 bg-indigo-500/10 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.1)] sm:h-12 sm:w-12 sm:rounded-2xl">
              <FaRocket />
            </div>

            <h3 className="mt-4 text-lg font-extrabold text-white sm:text-xl">
              Building. Learning. Improving.
            </h3>

            <p className="mx-auto mt-2 max-w-2xl text-sm leading-7 text-gray-400">
              I continuously work on improving my development skills by building
              real-world projects, learning modern technologies and contributing
              to production-focused applications.
            </p>

          </div>

        </div>

      </div>

      {/* =====================================================
          EXPERIENCE ANIMATIONS
      ====================================================== */}

      <style>
        {`
          @keyframes experienceOrbOne {
            0%,
            100% {
              transform: translate3d(0, 0, 0) scale(1);
            }

            50% {
              transform: translate3d(90px, 50px, 0) scale(1.15);
            }
          }

          @keyframes experienceOrbTwo {
            0%,
            100% {
              transform: translate3d(0, 0, 0) scale(1);
            }

            50% {
              transform: translate3d(-90px, -60px, 0) scale(1.12);
            }
          }

          @keyframes experienceGlow {
            0%,
            100% {
              transform: translateY(-50%) translateX(0);
              opacity: 0.35;
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

export default Experience;
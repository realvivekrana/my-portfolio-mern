import {
  FaGraduationCap,
  FaUniversity,
  FaBookOpen,
  FaBrain,
} from 'react-icons/fa';

const education = [
  {
    degree: 'MCA — Artificial Intelligence & Machine Learning',
    institution: 'Amity University Online',
    duration: 'Current',
    status: 'Postgraduate',
    description:
      'Pursuing a Master of Computer Applications with a specialization in Artificial Intelligence and Machine Learning, while strengthening my software development and problem-solving skills.',
    highlights: [
      'Artificial Intelligence & Machine Learning',
      'Advanced Computer Applications',
      'Software Development',
    ],
    icon: <FaBrain />,
  },
  {
    degree: 'Bachelor of Computer Applications',
    institution: 'Vinoba Bhave University',
    duration: '2021 – 2024',
    status: 'Completed',
    description:
      'Completed my Bachelor of Computer Applications with a strong foundation in programming, computer science fundamentals and software development.',
    highlights: [
      'Computer Applications',
      'Programming Fundamentals',
      'Software Development',
    ],
    icon: <FaBookOpen />,
  },
];

function Education() {
  return (
    <section
      id="education"
      className="relative overflow-hidden bg-transparent px-4 py-16 text-white transition-colors duration-500 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      {/* =====================================================
          LOCAL COSMIC GLOW
      ====================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-20 h-60 w-60 animate-[educationOrbOne_16s_ease-in-out_infinite] rounded-full bg-indigo-600/10 blur-[100px] sm:-left-40 sm:h-80 sm:w-80"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-20 h-60 w-60 animate-[educationOrbTwo_20s_ease-in-out_infinite] rounded-full bg-purple-600/10 blur-[100px] sm:-right-40 sm:h-80 sm:w-80"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/5 blur-[110px]"
      />

      <div className="relative z-10 mx-auto max-w-5xl">

        {/* =====================================================
            SECTION HEADER
        ====================================================== */}

        <div className="mb-10 text-center sm:mb-14 md:mb-16">

          <p className="mb-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-indigo-400 sm:text-sm sm:tracking-[0.2em]">
            <FaGraduationCap className="text-sm" />
            Academic Journey
          </p>

          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
            Education &{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Learning
            </span>
          </h2>

          <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 shadow-[0_0_18px_rgba(99,102,241,0.5)] sm:mt-5 sm:w-16" />

          <p className="mx-auto mt-5 max-w-2xl px-1 text-sm leading-7 text-gray-400 sm:mt-6 sm:text-base sm:leading-8 md:text-lg">
            My academic background and the knowledge that continues to shape
            my journey as a software developer.
          </p>

        </div>

        {/* =====================================================
            EDUCATION TIMELINE
        ====================================================== */}

        <div className="relative">

          {/* ===================================================
              TIMELINE LINE
          ==================================================== */}

          <div className="absolute bottom-10 left-6 top-10 hidden w-px bg-gradient-to-b from-indigo-500 via-purple-500 to-transparent md:block" />

          <div className="space-y-7 sm:space-y-8">

            {education.map((item) => (
              <article
                key={`${item.degree}-${item.institution}`}
                className="relative md:pl-20"
              >

                {/* =================================================
                    DESKTOP TIMELINE ICON
                ================================================== */}

                <div className="absolute left-0 top-7 hidden h-12 w-12 items-center justify-center rounded-2xl border border-indigo-400/20 bg-black text-indigo-400 shadow-[0_0_25px_rgba(99,102,241,0.25)] md:flex">

                  <div className="absolute inset-1 rounded-xl bg-indigo-500/10" />

                  <span className="relative z-10">
                    {item.icon}
                  </span>

                </div>

                {/* =================================================
                    EDUCATION CARD
                ================================================== */}

                <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] shadow-[0_0_45px_rgba(99,102,241,0.03)] backdrop-blur-md transition-all duration-500 hover:border-indigo-400/20 hover:bg-white/[0.04] hover:shadow-[0_0_55px_rgba(99,102,241,0.08)] md:hover:-translate-y-1 sm:rounded-3xl">

                  {/* Card Glow */}

                  <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* =================================================
                      CARD TOP
                  ================================================== */}

                  <div className="relative border-b border-white/[0.07] bg-black/30 p-5 sm:p-6 md:p-7">

                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start sm:gap-6">

                      {/* =================================================
                          DEGREE INFORMATION
                      ================================================== */}

                      <div className="min-w-0">

                        {/* Mobile Icon */}

                        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-400/10 bg-indigo-500/10 text-indigo-400 md:hidden">
                          {item.icon}
                        </div>

                        {/* Status */}

                        <div className="mb-3 flex flex-wrap items-center gap-2">

                          <span className="rounded-full border border-indigo-400/10 bg-indigo-500/[0.08] px-3 py-1 text-xs font-bold text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.05)]">
                            {item.status}
                          </span>

                        </div>

                        {/* Degree */}

                        <h3 className="break-words text-xl font-extrabold leading-tight tracking-tight text-white sm:text-2xl">
                          {item.degree}
                        </h3>

                        {/* Institution */}

                        <div className="mt-3 flex min-w-0 items-start gap-2 text-sm font-semibold text-gray-400">

                          <FaUniversity className="mt-0.5 shrink-0 text-indigo-400" />

                          <span className="min-w-0 break-words">
                            {item.institution}
                          </span>

                        </div>

                      </div>

                      {/* =================================================
                          DURATION
                      ================================================== */}

                      <div className="shrink-0">

                        <span className="inline-flex items-center rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs font-bold text-gray-400">
                          {item.duration}
                        </span>

                      </div>

                    </div>

                    {/* =================================================
                        DESCRIPTION
                    ================================================== */}

                    <p className="mt-5 text-sm leading-7 text-gray-400">
                      {item.description}
                    </p>

                  </div>

                  {/* =================================================
                      ACADEMIC HIGHLIGHTS
                  ================================================== */}

                  <div className="relative p-5 sm:p-6 md:p-7">

                    <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-500 sm:text-xs">
                      Academic Focus
                    </p>

                    <div className="flex flex-wrap gap-2">

                      {item.highlights.map((highlight) => (
                        <span
                          key={highlight}
                          className="rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5 text-xs font-semibold text-gray-400 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-400/20 hover:bg-indigo-500/[0.07] hover:text-indigo-300 hover:shadow-[0_0_15px_rgba(99,102,241,0.08)] sm:px-3.5 sm:py-2"
                        >
                          {highlight}
                        </span>
                      ))}

                    </div>

                  </div>

                </div>

              </article>
            ))}

          </div>

        </div>

        {/* =====================================================
            EDUCATION SUMMARY
        ====================================================== */}

        <div className="relative mt-8 overflow-hidden rounded-2xl border border-indigo-400/10 bg-gradient-to-br from-indigo-500/[0.07] via-black/40 to-purple-500/[0.06] p-5 text-center shadow-[0_0_45px_rgba(99,102,241,0.04)] backdrop-blur-md sm:mt-10 sm:rounded-3xl sm:p-7 md:p-8">

          {/* Moving Cosmic Glow */}

          <div className="pointer-events-none absolute -left-16 top-1/2 h-32 w-32 -translate-y-1/2 animate-[educationGlow_8s_ease-in-out_infinite] rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative z-10">

            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-400/10 bg-indigo-500/10 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.1)] sm:h-12 sm:w-12 sm:rounded-2xl">
              <FaGraduationCap />
            </div>

            <h3 className="mt-4 text-lg font-extrabold text-white sm:text-xl">
              Continuous Learning
            </h3>

            <p className="mx-auto mt-2 max-w-2xl text-sm leading-7 text-gray-400">
              Beyond formal education, I continuously learn through practical
              projects, development practice and exploring modern technologies
              to stay current with the evolving software industry.
            </p>

          </div>

        </div>

      </div>

      {/* =====================================================
          EDUCATION ANIMATIONS
      ====================================================== */}

      <style>
        {`
          @keyframes educationOrbOne {
            0%,
            100% {
              transform: translate3d(0, 0, 0) scale(1);
            }

            50% {
              transform: translate3d(90px, 50px, 0) scale(1.15);
            }
          }

          @keyframes educationOrbTwo {
            0%,
            100% {
              transform: translate3d(0, 0, 0) scale(1);
            }

            50% {
              transform: translate3d(-90px, -60px, 0) scale(1.12);
            }
          }

          @keyframes educationGlow {
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

export default Education;
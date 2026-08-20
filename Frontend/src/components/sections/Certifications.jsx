import {
  FaCertificate,
  FaExternalLinkAlt,
  FaCode,
  FaReact,
  FaDatabase,
  FaBrain,
  FaFileExcel,
} from 'react-icons/fa';

const certifications = [
  {
    title: 'JavaScript',
    issuer: 'JavaScript Certification',
    description:
      'Certification demonstrating knowledge of JavaScript fundamentals, programming concepts and modern JavaScript development.',
    icon: <FaCode />,
    skills: ['JavaScript', 'ES6+', 'Programming'],
    certificateLink: '',
  },
  {
    title: 'React.js',
    issuer: 'React.js Certification',
    description:
      'Certification focused on React.js fundamentals, component-based development and building modern user interfaces.',
    icon: <FaReact />,
    skills: ['React.js', 'Components', 'Frontend'],
    certificateLink: '',
  },
  {
    title: 'MongoDB & Node.js',
    issuer: 'MongoDB & Node.js Certification',
    description:
      'Certification covering backend development concepts, Node.js and MongoDB database integration.',
    icon: <FaDatabase />,
    skills: ['Node.js', 'MongoDB', 'Backend'],
    certificateLink: '',
  },
  {
    title: 'Basics of AI',
    issuer: 'Amity University Online',
    description:
      'Certification covering foundational concepts of Artificial Intelligence and its applications.',
    icon: <FaBrain />,
    skills: ['Artificial Intelligence', 'AI Fundamentals'],
    certificateLink: '',
  },
  {
    title: 'Advanced Excel',
    issuer: 'Amity University Online',
    description:
      'Certification focused on advanced spreadsheet skills, data handling and productivity using Microsoft Excel.',
    icon: <FaFileExcel />,
    skills: ['Excel', 'Data Analysis', 'Productivity'],
    certificateLink: '',
  },
];

function Certifications() {
  return (
    <section
      id="certifications"
      className="relative overflow-hidden bg-transparent px-4 py-16 text-white transition-colors duration-500 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      {/* =====================================================
          LOCAL COSMIC GLOW
      ====================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-20 h-60 w-60 animate-[certOrbOne_16s_ease-in-out_infinite] rounded-full bg-indigo-600/10 blur-[100px] sm:-left-40 sm:h-80 sm:w-80"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-20 h-60 w-60 animate-[certOrbTwo_20s_ease-in-out_infinite] rounded-full bg-purple-600/10 blur-[100px] sm:-right-40 sm:h-80 sm:w-80"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/5 blur-[110px]"
      />

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* =====================================================
            SECTION HEADER
        ====================================================== */}

        <div className="mb-10 text-center sm:mb-14 md:mb-16">

          <p className="mb-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-indigo-400 sm:text-sm sm:tracking-[0.2em]">
            <FaCertificate className="text-sm" />
            Credentials
          </p>

          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
            Certifications &{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Learning
            </span>
          </h2>

          <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 shadow-[0_0_18px_rgba(99,102,241,0.5)] sm:mt-5 sm:w-16" />

          <p className="mx-auto mt-5 max-w-2xl px-1 text-sm leading-7 text-gray-400 sm:mt-6 sm:text-base sm:leading-8 md:text-lg">
            Certifications and learning milestones that support my technical
            skills and continuous professional growth.
          </p>

        </div>

        {/* =====================================================
            CERTIFICATION CARDS
        ====================================================== */}

        <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">

          {certifications.map((certificate) => (
            <article
              key={certificate.title}
              className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] shadow-[0_0_40px_rgba(99,102,241,0.03)] backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-indigo-400/20 hover:bg-white/[0.04] hover:shadow-[0_0_55px_rgba(99,102,241,0.1)] sm:rounded-3xl"
            >

              {/* =================================================
                  TOP GRADIENT
              ================================================== */}

              <div className="relative h-1 w-full overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400">

                <div className="absolute inset-0 animate-[certificateLine_5s_linear_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />

              </div>

              {/* =================================================
                  CARD CONTENT
              ================================================== */}

              <div className="relative flex flex-1 flex-col p-5 sm:p-6">

                {/* Card Glow */}

                <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {/* =================================================
                    ICON + BADGE
                ================================================== */}

                <div className="relative z-10 mb-5 flex items-start justify-between gap-4 sm:mb-6">

                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-indigo-400/10 bg-indigo-500/10 text-xl text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.08)] transition-all duration-300 group-hover:scale-110 group-hover:border-indigo-400/20 group-hover:bg-indigo-500/15 group-hover:shadow-[0_0_25px_rgba(99,102,241,0.18)] sm:h-14 sm:w-14 sm:rounded-2xl sm:text-2xl">

                    <div className="absolute -inset-1 rounded-2xl bg-indigo-500/10 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />

                    <span className="relative z-10">
                      {certificate.icon}
                    </span>

                  </div>

                  <div className="shrink-0 rounded-full border border-indigo-400/10 bg-indigo-500/[0.08] px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider text-indigo-300 sm:px-3 sm:text-[10px]">
                    Certified
                  </div>

                </div>

                {/* =================================================
                    CERTIFICATE TITLE
                ================================================== */}

                <h3 className="relative z-10 break-words text-lg font-extrabold tracking-tight text-white transition-colors duration-300 group-hover:text-indigo-300 sm:text-xl">
                  {certificate.title}
                </h3>

                {/* =================================================
                    ISSUER
                ================================================== */}

                <p className="relative z-10 mt-2 text-xs font-semibold text-gray-500 sm:text-sm">
                  {certificate.issuer}
                </p>

                {/* =================================================
                    DESCRIPTION
                ================================================== */}

                <p className="relative z-10 mt-4 text-xs leading-6 text-gray-400 sm:text-sm sm:leading-7">
                  {certificate.description}
                </p>

                {/* =================================================
                    SKILLS
                ================================================== */}

                <div className="relative z-10 mt-5 flex flex-wrap gap-2">

                  {certificate.skills.map((skill) => (
                    <span
                      key={`${certificate.title}-${skill}`}
                      className="rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5 text-[11px] font-semibold text-gray-400 transition-all duration-300 group-hover:border-indigo-400/10 group-hover:bg-indigo-500/[0.05] group-hover:text-indigo-300 sm:text-xs"
                    >
                      {skill}
                    </span>
                  ))}

                </div>

                {/* =================================================
                    BOTTOM ACTION
                ================================================== */}

                <div className="relative z-10 mt-auto pt-6 sm:pt-7">

                  {certificate.certificateLink ? (
                    <a
                      href={certificate.certificateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-400/20 bg-indigo-500/10 px-5 py-3 text-xs font-semibold text-indigo-300 transition-all duration-300 hover:border-indigo-400/30 hover:bg-indigo-500/20 hover:text-white hover:shadow-[0_0_25px_rgba(99,102,241,0.15)] sm:text-sm"
                    >
                      <FaExternalLinkAlt className="text-[10px]" />
                      View Certificate
                    </a>
                  ) : (
                    <span className="inline-flex w-full cursor-default items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-5 py-3 text-xs font-semibold text-gray-500 sm:text-sm">
                      <FaCertificate className="text-sm" />
                      Certificate Available
                    </span>
                  )}

                </div>

              </div>

            </article>
          ))}

        </div>

        {/* =====================================================
            BOTTOM MESSAGE
        ====================================================== */}

        <div className="relative mt-8 overflow-hidden rounded-2xl border border-indigo-400/10 bg-gradient-to-br from-indigo-500/[0.07] via-black/40 to-purple-500/[0.06] p-5 text-center shadow-[0_0_45px_rgba(99,102,241,0.04)] backdrop-blur-md sm:mt-12 sm:rounded-3xl sm:p-7 md:p-8">

          {/* Moving Glow */}

          <div className="pointer-events-none absolute -left-16 top-1/2 h-32 w-32 -translate-y-1/2 animate-[certGlow_8s_ease-in-out_infinite] rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="relative z-10">

            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-400/10 bg-indigo-500/10 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.1)] sm:h-12 sm:w-12 sm:rounded-2xl">
              <FaCertificate />
            </div>

            <h3 className="mt-4 text-lg font-extrabold text-white sm:text-xl">
              Always Learning
            </h3>

            <p className="mx-auto mt-2 max-w-2xl text-sm leading-7 text-gray-400">
              I believe continuous learning is an important part of becoming a
              better developer, so I regularly explore new technologies and
              strengthen my existing skills.
            </p>

          </div>

        </div>

      </div>

      {/* =====================================================
          CERTIFICATION ANIMATIONS
      ====================================================== */}

      <style>
        {`
          @keyframes certOrbOne {
            0%,
            100% {
              transform: translate3d(0, 0, 0) scale(1);
            }

            50% {
              transform: translate3d(90px, 50px, 0) scale(1.15);
            }
          }

          @keyframes certOrbTwo {
            0%,
            100% {
              transform: translate3d(0, 0, 0) scale(1);
            }

            50% {
              transform: translate3d(-90px, -60px, 0) scale(1.12);
            }
          }

          @keyframes certificateLine {
            0% {
              transform: translateX(-100%);
            }

            100% {
              transform: translateX(300%);
            }
          }

          @keyframes certGlow {
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

export default Certifications;
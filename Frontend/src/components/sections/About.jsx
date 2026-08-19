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
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-gray-50 px-4 py-16 transition-colors duration-500 sm:px-6 sm:py-20 lg:px-8 lg:py-24 dark:bg-gray-900"
    >
      {/* =====================================================
          BACKGROUND DECORATION
      ====================================================== */}

      <div className="pointer-events-none absolute -left-32 top-16 h-56 w-56 rounded-full bg-indigo-200/20 blur-3xl sm:-left-40 sm:top-20 sm:h-80 sm:w-80 dark:bg-indigo-600/5" />

      <div className="pointer-events-none absolute -right-32 bottom-16 h-56 w-56 rounded-full bg-purple-200/20 blur-3xl sm:-right-40 sm:bottom-20 sm:h-80 sm:w-80 dark:bg-purple-600/5" />

      <div className="relative mx-auto w-full max-w-7xl">

        {/* =====================================================
            SECTION HEADER
        ====================================================== */}

        <div className="mb-10 text-center sm:mb-14 md:mb-16">

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-indigo-600 sm:text-sm sm:tracking-[0.2em] dark:text-indigo-400">
            Get To Know Me
          </p>

          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-4xl md:text-5xl dark:text-white">
            About{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
              Me
            </span>
          </h2>

          <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 sm:mt-5 sm:w-16" />

          <p className="mx-auto mt-5 max-w-2xl px-1 text-sm leading-7 text-gray-600 sm:mt-6 sm:text-base sm:leading-8 md:text-lg dark:text-gray-400">
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

          <div className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-xl sm:rounded-3xl sm:p-7 md:p-8 dark:border-gray-800 dark:bg-gray-950">

            {/* Profile Heading */}

            <div className="mb-6 flex items-center gap-3 sm:mb-7 sm:gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-base font-extrabold text-white shadow-lg shadow-indigo-600/20 sm:h-14 sm:w-14 sm:rounded-2xl sm:text-lg">
                VR
              </div>

              <div className="min-w-0">

                <h3 className="text-lg font-extrabold text-gray-900 sm:text-xl dark:text-white">
                  Vivek Rana
                </h3>

                <p className="mt-1 text-xs font-semibold text-indigo-600 sm:text-sm dark:text-indigo-400">
                  MERN Stack Developer
                </p>

              </div>

            </div>

            {/* Introduction */}

            <div className="space-y-4 text-sm leading-7 text-gray-600 sm:space-y-5 sm:text-[15px] dark:text-gray-400">

              <p>
                I am a passionate{' '}
                <strong className="font-semibold text-gray-900 dark:text-gray-200">
                  MERN Stack Developer
                </strong>{' '}
                focused on developing responsive, scalable and user-friendly
                web applications using modern JavaScript technologies.
              </p>

              <p>
                My core specialization is{' '}
                <strong className="font-semibold text-gray-900 dark:text-gray-200">
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

            <div className="mt-7 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4 sm:mt-8 sm:p-5 dark:border-indigo-500/10 dark:bg-indigo-500/5">

              <div className="flex items-start gap-3 sm:gap-4">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 sm:h-11 sm:w-11 dark:bg-indigo-500/10 dark:text-indigo-400">
                  <FaBriefcase />
                </div>

                <div className="min-w-0">

                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-indigo-500 sm:text-xs dark:text-indigo-400">
                    Current Role
                  </p>

                  <h4 className="mt-1 text-sm font-bold leading-6 text-gray-900 sm:text-base dark:text-white">
                    Frontend Developer Intern
                  </h4>

                  <p className="mt-1 text-xs font-medium leading-5 text-indigo-600 sm:text-sm dark:text-indigo-400">
                    Athenura · Feb 2026 – Present
                  </p>

                  <p className="mt-2 text-xs leading-6 text-gray-600 sm:text-sm dark:text-gray-400">
                    Working with React.js to develop modern user interfaces,
                    reusable components and production-focused web experiences.
                  </p>

                </div>

              </div>

            </div>

            {/* =================================================
                OPEN TO OPPORTUNITIES
            ================================================== */}

            <div className="mt-3 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3.5 sm:mt-4 sm:px-5 sm:py-4 dark:border-green-500/20 dark:bg-green-500/5">

              <span className="relative mt-1 flex h-3 w-3 shrink-0">

                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />

                <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />

              </span>

              <div className="min-w-0">

                <p className="text-xs font-bold leading-5 text-green-800 sm:text-sm dark:text-green-400">
                  Open to Opportunities
                </p>

                <p className="mt-0.5 text-[11px] leading-5 text-green-700/80 sm:text-xs dark:text-green-400/70">
                  Interested in MERN, frontend and full-stack development roles.
                </p>

              </div>

            </div>

          </div>

          {/* ===================================================
              RIGHT — CAREER & EDUCATION
          ==================================================== */}

          <div className="min-w-0 space-y-5 sm:space-y-6">

            {/* Education */}

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-xl sm:rounded-3xl sm:p-7 sm:hover:-translate-y-1 dark:border-gray-800 dark:bg-gray-950">

              <div className="flex items-start gap-3 sm:gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-lg text-indigo-600 sm:h-12 sm:w-12 sm:rounded-2xl sm:text-xl dark:bg-indigo-500/10 dark:text-indigo-400">
                  <FaGraduationCap />
                </div>

                <div className="min-w-0">

                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-indigo-600 sm:text-xs dark:text-indigo-400">
                    Education
                  </p>

                  <h3 className="mt-2 break-words text-base font-extrabold leading-6 text-gray-900 sm:text-lg dark:text-white">
                    MCA — Artificial Intelligence & Machine Learning
                  </h3>

                  <p className="mt-1 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Amity University Online
                  </p>

                  <p className="mt-3 text-xs leading-6 text-gray-500 sm:text-sm dark:text-gray-500">
                    Building a strong foundation in computer applications,
                    software development and emerging AI/ML technologies.
                  </p>

                  <div className="mt-4 inline-flex rounded-full bg-gray-100 px-3 py-1.5 text-[11px] font-semibold text-gray-600 sm:text-xs dark:bg-gray-900 dark:text-gray-400">
                    Postgraduate
                  </div>

                </div>

              </div>

            </div>

            {/* Previous Education */}

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-xl sm:rounded-3xl sm:p-7 sm:hover:-translate-y-1 dark:border-gray-800 dark:bg-gray-950">

              <div className="flex items-start gap-3 sm:gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-lg text-purple-600 sm:h-12 sm:w-12 sm:rounded-2xl sm:text-xl dark:bg-purple-500/10 dark:text-purple-400">
                  <FaGraduationCap />
                </div>

                <div className="min-w-0">

                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-purple-600 sm:text-xs dark:text-purple-400">
                    Bachelor&apos;s Degree
                  </p>

                  <h3 className="mt-2 break-words text-base font-extrabold leading-6 text-gray-900 sm:text-lg dark:text-white">
                    Bachelor of Computer Applications
                  </h3>

                  <p className="mt-1 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Vinoba Bhave University
                  </p>

                  <p className="mt-2 text-xs font-medium text-gray-400">
                    2021 – 2024
                  </p>

                </div>

              </div>

            </div>

            {/* Career Goal */}

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-xl sm:rounded-3xl sm:p-7 sm:hover:-translate-y-1 dark:border-gray-800 dark:bg-gray-950">

              <div className="flex items-start gap-3 sm:gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-lg text-green-600 sm:h-12 sm:w-12 sm:rounded-2xl sm:text-xl dark:bg-green-500/10 dark:text-green-400">
                  <FaRocket />
                </div>

                <div className="min-w-0">

                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-green-600 sm:text-xs dark:text-green-400">
                    Career Goal
                  </p>

                  <h3 className="mt-2 break-words text-base font-extrabold leading-6 text-gray-900 sm:text-lg dark:text-white">
                    Growing as a Software Engineer
                  </h3>

                  <p className="mt-2 text-xs leading-6 text-gray-500 sm:text-sm dark:text-gray-400">
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

            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-600 sm:text-xs dark:text-indigo-400">
              What I Specialize In
            </p>

            <h3 className="text-2xl font-extrabold leading-tight text-gray-900 sm:text-3xl dark:text-white">
              My Core Expertise
            </h3>

          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">

            {expertise.map((item) => (
              <div
                key={item.title}
                className="group min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-indigo-200 hover:shadow-xl sm:rounded-3xl sm:p-6 sm:hover:-translate-y-1 dark:border-gray-800 dark:bg-gray-950 dark:hover:border-indigo-500/30"
              >

                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-lg text-indigo-600 transition-transform duration-300 group-hover:scale-110 sm:mb-5 sm:h-12 sm:w-12 sm:rounded-2xl sm:text-xl dark:bg-indigo-500/10 dark:text-indigo-400">
                  {item.icon}
                </div>

                <h4 className="break-words text-base font-bold text-gray-900 sm:text-lg dark:text-white">
                  {item.title}
                </h4>

                <p className="mt-2.5 text-xs leading-6 text-gray-500 sm:mt-3 sm:text-sm dark:text-gray-400">
                  {item.description}
                </p>

              </div>
            ))}

          </div>

        </div>

        {/* =====================================================
            DEVELOPMENT STRENGTHS
        ====================================================== */}

        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:mt-12 sm:rounded-3xl sm:p-7 md:p-8 dark:border-gray-800 dark:bg-gray-950">

          <div className="mb-5 sm:mb-6">

            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-600 sm:text-xs dark:text-indigo-400">
              Development Strengths
            </p>

            <h3 className="mt-2 text-xl font-extrabold leading-tight text-gray-900 sm:text-2xl dark:text-white">
              What I Bring
            </h3>

          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">

            {strengths.map((strength) => (
              <div
                key={strength}
                className="flex min-w-0 items-start gap-3 rounded-xl bg-gray-50 px-3.5 py-3 transition-colors duration-300 hover:bg-indigo-50 sm:items-center sm:px-4 dark:bg-gray-900 dark:hover:bg-indigo-500/5"
              >

                <FaCheckCircle className="mt-0.5 shrink-0 text-sm text-indigo-600 sm:mt-0 dark:text-indigo-400" />

                <span className="min-w-0 break-words text-xs font-medium leading-5 text-gray-700 sm:text-sm dark:text-gray-300">
                  {strength}
                </span>

              </div>
            ))}

          </div>

        </div>

        {/* =====================================================
            QUICK STATISTICS
        ====================================================== */}

        <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm sm:mt-12 sm:rounded-3xl dark:border-gray-800 dark:bg-gray-950">

          <div className="grid grid-cols-2 md:grid-cols-4">

            {quickStats.map((stat, index) => (
              <div
                key={stat.label}
                className={`px-3 py-5 text-center sm:px-6 sm:py-7 ${
                  index < 2
                    ? 'border-b border-gray-200 dark:border-gray-800'
                    : ''
                } ${
                  index % 2 === 0
                    ? 'border-r border-gray-200 dark:border-gray-800'
                    : ''
                } md:border-b-0 md:border-r md:last:border-r-0`}
              >

                <p className="break-words text-2xl font-extrabold tracking-tight text-indigo-600 sm:text-3xl dark:text-indigo-400">
                  {stat.value}
                </p>

                <p className="mt-1.5 text-[11px] font-medium leading-5 text-gray-500 sm:mt-2 sm:text-sm dark:text-gray-400">
                  {stat.label}
                </p>

              </div>
            ))}

          </div>

        </div>

      </div>
    </section>
  );
}

export default About;
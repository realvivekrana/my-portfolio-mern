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
      className="relative overflow-hidden bg-gray-50 px-6 py-24 transition-colors duration-500 dark:bg-gray-900"
    >
      {/* Background Decoration */}
      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-indigo-200/20 blur-3xl dark:bg-indigo-600/5" />

      <div className="pointer-events-none absolute -right-40 bottom-20 h-80 w-80 rounded-full bg-purple-200/20 blur-3xl dark:bg-purple-600/5" />

      <div className="relative mx-auto max-w-5xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <p className="mb-3 flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
            <FaGraduationCap className="text-sm" />
            Academic Journey
          </p>

          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
            Education &{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
              Learning
            </span>
          </h2>

          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg dark:text-gray-400">
            My academic background and the knowledge that continues to shape
            my journey as a software developer.
          </p>
        </div>

        {/* Education Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute bottom-10 left-6 top-10 hidden w-px bg-gradient-to-b from-indigo-500 via-purple-500 to-transparent md:block" />

          <div className="space-y-8">
            {education.map((item) => (
              <article
                key={`${item.degree}-${item.institution}`}
                className="relative md:pl-20"
              >
                {/* Timeline Icon */}
                <div className="absolute left-0 top-7 hidden h-12 w-12 items-center justify-center rounded-2xl border-4 border-gray-50 bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/20 md:flex dark:border-gray-900">
                  {item.icon}
                </div>

                {/* Education Card */}
                <div className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl dark:border-gray-800 dark:bg-gray-950 dark:hover:border-indigo-500/30">
                  {/* Card Top */}
                  <div className="border-b border-gray-200 p-6 dark:border-gray-800 sm:p-7">
                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                      <div>
                        {/* Mobile Icon */}
                        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 md:hidden dark:bg-indigo-500/10 dark:text-indigo-400">
                          {item.icon}
                        </div>

                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 dark:border-indigo-500/10 dark:bg-indigo-500/10 dark:text-indigo-400">
                            {item.status}
                          </span>
                        </div>

                        <h3 className="text-xl font-extrabold tracking-tight text-gray-900 sm:text-2xl dark:text-white">
                          {item.degree}
                        </h3>

                        <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400">
                          <FaUniversity className="shrink-0 text-indigo-500 dark:text-indigo-400" />

                          <span>{item.institution}</span>
                        </div>
                      </div>

                      {/* Duration */}
                      <div className="shrink-0">
                        <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-bold text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
                          {item.duration}
                        </span>
                      </div>
                    </div>

                    <p className="mt-5 text-sm leading-7 text-gray-600 dark:text-gray-400">
                      {item.description}
                    </p>
                  </div>

                  {/* Highlights */}
                  <div className="p-6 sm:p-7">
                    <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500">
                      Academic Focus
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {item.highlights.map((highlight) => (
                        <span
                          key={highlight}
                          className="rounded-full border border-gray-200 bg-gray-50 px-3.5 py-2 text-xs font-semibold text-gray-600 transition-all duration-300 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-indigo-500/20 dark:hover:bg-indigo-500/5 dark:hover:text-indigo-400"
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

        {/* Education Summary */}
        <div className="mt-10 rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-7 text-center dark:border-indigo-500/10 dark:from-indigo-950/30 dark:via-gray-950 dark:to-purple-950/20 sm:p-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            <FaGraduationCap />
          </div>

          <h3 className="mt-4 text-xl font-extrabold text-gray-900 dark:text-white">
            Continuous Learning
          </h3>

          <p className="mx-auto mt-2 max-w-2xl text-sm leading-7 text-gray-600 dark:text-gray-400">
            Beyond formal education, I continuously learn through practical
            projects, development practice and exploring modern technologies
            to stay current with the evolving software industry.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Education;
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
      className="relative overflow-hidden bg-white px-6 py-24 transition-colors duration-500 dark:bg-gray-950"
    >
      {/* Background Decoration */}
      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-indigo-200/20 blur-3xl dark:bg-indigo-600/5" />

      <div className="pointer-events-none absolute -right-40 bottom-20 h-80 w-80 rounded-full bg-purple-200/20 blur-3xl dark:bg-purple-600/5" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <p className="mb-3 flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
            <FaCertificate className="text-sm" />
            Credentials
          </p>

          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
            Certifications &{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
              Learning
            </span>
          </h2>

          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg dark:text-gray-400">
            Certifications and learning milestones that support my technical
            skills and continuous professional growth.
          </p>
        </div>

        {/* Certification Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {certifications.map((certificate) => (
            <article
              key={certificate.title}
              className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-gray-50/70 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-indigo-200 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900/60 dark:hover:border-indigo-500/30"
            >
              {/* Top Gradient */}
              <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-80 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="flex flex-1 flex-col p-6">
                {/* Icon + Certificate Badge */}
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl text-indigo-600 transition-transform duration-300 group-hover:scale-110 dark:bg-indigo-500/10 dark:text-indigo-400">
                    {certificate.icon}
                  </div>

                  <div className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:border-indigo-500/10 dark:bg-indigo-500/10 dark:text-indigo-400">
                    Certified
                  </div>
                </div>

                {/* Certificate Title */}
                <h3 className="text-xl font-extrabold tracking-tight text-gray-900 transition-colors duration-300 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                  {certificate.title}
                </h3>

                {/* Issuer */}
                <p className="mt-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
                  {certificate.issuer}
                </p>

                {/* Description */}
                <p className="mt-4 text-sm leading-7 text-gray-600 dark:text-gray-400">
                  {certificate.description}
                </p>

                {/* Skills */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {certificate.skills.map((skill) => (
                    <span
                      key={`${certificate.title}-${skill}`}
                      className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 transition-colors duration-300 group-hover:border-indigo-100 group-hover:bg-indigo-50 group-hover:text-indigo-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400 dark:group-hover:border-indigo-500/20 dark:group-hover:bg-indigo-500/5 dark:group-hover:text-indigo-400"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Bottom Action */}
                <div className="mt-auto pt-7">
                  {certificate.certificateLink ? (
                    <a
                      href={certificate.certificateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20"
                    >
                      <FaExternalLinkAlt className="text-xs" />
                      View Certificate
                    </a>
                  ) : (
                    <span className="inline-flex w-full cursor-default items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-400 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-500">
                      <FaCertificate className="text-sm" />
                      Certificate Available
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom Message */}
        <div className="mt-12 rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-7 text-center dark:border-indigo-500/10 dark:from-indigo-950/30 dark:via-gray-950 dark:to-purple-950/20 sm:p-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            <FaCertificate />
          </div>

          <h3 className="mt-4 text-xl font-extrabold text-gray-900 dark:text-white">
            Always Learning
          </h3>

          <p className="mx-auto mt-2 max-w-2xl text-sm leading-7 text-gray-600 dark:text-gray-400">
            I believe continuous learning is an important part of becoming a
            better developer, so I regularly explore new technologies and
            strengthen my existing skills.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Certifications;
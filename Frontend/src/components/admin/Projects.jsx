import { useEffect, useMemo, useState } from 'react';
import {
  FaGithub,
  FaExternalLinkAlt,
  FaStar,
  FaEye,
  FaCheckCircle,
} from 'react-icons/fa';

import API from '../../utils/axios';
import Loader from '../ui/Loader';

const FEATURED_TYPES = [
  'Major Full-Stack Project',
  'AI / React Project',
  'MERN Business Project',
];

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await API.get('/projects');

        const projectData = Array.isArray(res.data?.data)
          ? res.data.data
          : [];

        setProjects(projectData);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            'Failed to load projects. Please try again later.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (!selectedProject) {
      document.body.style.overflow = '';
      return undefined;
    }

    document.body.style.overflow = 'hidden';

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setSelectedProject(null);
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [selectedProject]);

  /*
    Featured section:
    Maximum 3 projects.
    Order:
    1. Major Full-Stack Project
    2. AI / React Project
    3. MERN Business Project
  */
  const featuredProjects = useMemo(() => {
    const selected = [];

    FEATURED_TYPES.forEach((type) => {
      const project = projects.find(
        (item) =>
          item.featured === true &&
          item.featuredType === type
      );

      if (project) {
        selected.push(project);
      }
    });

    return selected.slice(0, 3);
  }, [projects]);

  const featuredProjectIds = useMemo(
    () => new Set(featuredProjects.map((project) => project._id)),
    [featuredProjects]
  );

  const regularProjects = useMemo(
    () =>
      projects.filter(
        (project) => !featuredProjectIds.has(project._id)
      ),
    [projects, featuredProjectIds]
  );

  const getFeaturedNumber = (project) => {
    const index = FEATURED_TYPES.indexOf(project.featuredType);

    return index >= 0 ? index + 1 : null;
  };

  const renderProjectCard = (
    project,
    isFeatured = false
  ) => {
    const techStack = Array.isArray(project.techStack)
      ? project.techStack
      : [];

    const keyFeatures = Array.isArray(project.keyFeatures)
      ? project.keyFeatures
      : [];

    const featuredNumber = getFeaturedNumber(project);

    return (
      <article
        key={project._id}
        className={`group relative overflow-hidden rounded-3xl border bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:bg-gray-950 ${
          isFeatured
            ? 'border-indigo-200 shadow-indigo-500/5 dark:border-indigo-500/20'
            : 'border-gray-200 dark:border-gray-800'
        }`}
      >
        {/* Featured Number */}
        {isFeatured && featuredNumber && (
          <div className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-gray-950/80 text-sm font-extrabold text-white shadow-lg backdrop-blur-md">
            0{featuredNumber}
          </div>
        )}

        {/* Project Image */}
        <div className="relative h-56 overflow-hidden bg-gray-100 dark:bg-gray-900 sm:h-60">
          {project.image ? (
            <img
              src={project.image}
              alt={`${project.title} project screenshot`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950/40 dark:via-gray-900 dark:to-purple-950/30">
              <div className="text-5xl font-black text-indigo-300 dark:text-indigo-500/40">
                &lt;/&gt;
              </div>
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/10 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-90" />

          {/* Featured Label */}
          {isFeatured && (
            <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-gray-950/80 px-3 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur-md">
              <FaStar className="text-yellow-400" />
              Featured
            </div>
          )}

          {/* Category */}
          {project.category && (
            <span className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-white/90 px-3 py-1.5 text-xs font-bold text-gray-800 shadow-lg backdrop-blur-md dark:bg-gray-900/90 dark:text-gray-200">
              {project.category}
            </span>
          )}

          {/* Details */}
          <button
            type="button"
            onClick={() => setSelectedProject(project)}
            className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-xl border border-white/20 bg-gray-950/80 px-3.5 py-2 text-xs font-bold text-white opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 group-hover:opacity-100 hover:bg-indigo-600"
          >
            <FaEye />
            View Details
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Featured Type */}
          {isFeatured && project.featuredType && (
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-indigo-600 dark:text-indigo-400">
              {project.featuredType}
            </p>
          )}

          {/* Title */}
          <h3 className="mb-3 text-xl font-extrabold tracking-tight text-gray-900 transition-colors duration-300 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
            {project.title}
          </h3>

          {/* Description */}
          <p className="mb-5 line-clamp-3 text-sm leading-7 text-gray-600 dark:text-gray-400">
            {project.description}
          </p>

          {/* Tech Stack */}
          {techStack.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <span
                  key={`${project._id}-${tech}`}
                  className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-600 transition-all duration-300 group-hover:border-indigo-100 group-hover:bg-indigo-50 group-hover:text-indigo-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:group-hover:border-indigo-500/20 dark:group-hover:bg-indigo-500/5 dark:group-hover:text-indigo-400"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* Key Features */}
          {keyFeatures.length > 0 && (
            <div className="mb-6">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-gray-400 dark:text-gray-500">
                Key Features
              </p>

              <div className="space-y-2">
                {keyFeatures.slice(0, 3).map((feature) => (
                  <div
                    key={`${project._id}-${feature}`}
                    className="flex items-start gap-2 text-xs leading-5 text-gray-600 dark:text-gray-400"
                  >
                    <FaCheckCircle className="mt-0.5 shrink-0 text-indigo-500 dark:text-indigo-400" />

                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {keyFeatures.length > 3 && (
                <button
                  type="button"
                  onClick={() => setSelectedProject(project)}
                  className="mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  + {keyFeatures.length - 3} more features
                </button>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 pt-5 dark:border-gray-800">
            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20"
              >
                <FaExternalLinkAlt className="text-xs" />
                Live Demo
              </a>
            )}

            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-900 hover:bg-gray-900 hover:text-white dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-white dark:hover:bg-white dark:hover:text-gray-900"
              >
                <FaGithub className="text-base" />
                GitHub
              </a>
            )}

            <button
              type="button"
              onClick={() => setSelectedProject(project)}
              className="ml-auto inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-500 transition-colors hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
            >
              <FaEye className="text-sm" />
              Details
            </button>
          </div>
        </div>
      </article>
    );
  };

  return (
    <>
      <section
        id="projects"
        className="relative overflow-hidden bg-gray-50 px-6 py-24 transition-colors duration-500 dark:bg-gray-900"
      >
        {/* Background */}
        <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-indigo-200/20 blur-3xl dark:bg-indigo-600/5" />

        <div className="pointer-events-none absolute -right-40 bottom-20 h-80 w-80 rounded-full bg-purple-200/20 blur-3xl dark:bg-purple-600/5" />

        <div className="relative mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-16 text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
              My Work
            </p>

            <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
              Projects &{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
                Case Studies
              </span>
            </h2>

            <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg dark:text-gray-400">
              A selection of projects that demonstrate my experience with
              frontend, backend and full-stack development.
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex min-h-52 items-center justify-center">
              <Loader />
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-center dark:border-red-500/20 dark:bg-red-500/5">
              <p className="font-semibold text-red-600 dark:text-red-400">
                Unable to load projects
              </p>

              <p className="mt-1 text-sm text-red-500/80 dark:text-red-400/70">
                {error}
              </p>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && projects.length === 0 && (
            <div className="mx-auto max-w-xl rounded-3xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm dark:border-gray-800 dark:bg-gray-950">
              <div className="mx-auto mb-4 text-5xl font-black text-indigo-300 dark:text-indigo-500/40">
                &lt;/&gt;
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                No projects yet
              </h3>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Projects will appear here once they are added from the admin
                dashboard.
              </p>
            </div>
          )}

          {/* Projects */}
          {!loading && !error && projects.length > 0 && (
            <>
              {/* ================================================
                  FEATURED PROJECTS
              ================================================= */}
              {featuredProjects.length > 0 && (
                <div className="mb-20">
                  {/* Featured Header */}
                  <div className="mb-8 text-center">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-indigo-700 dark:border-indigo-500/10 dark:bg-indigo-500/10 dark:text-indigo-400">
                      <FaStar className="text-yellow-500" />
                      Recruiter Highlights
                    </div>

                    <h3 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
                      Featured Projects
                    </h3>

                    <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-gray-500 dark:text-gray-400">
                      My three strongest projects, selected to showcase
                      full-stack development, AI/React skills and real-world
                      business application development.
                    </p>
                  </div>

                  {/* Featured Cards */}
                  <div className="grid gap-7 lg:grid-cols-3">
                    {featuredProjects.map((project) =>
                      renderProjectCard(project, true)
                    )}
                  </div>
                </div>
              )}

              {/* ================================================
                  ALL PROJECTS
              ================================================= */}
              {regularProjects.length > 0 && (
                <div>
                  <div className="mb-7 flex items-end gap-4">
                    <div>
                      <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500">
                        More Work
                      </p>

                      <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                        All Projects
                      </h3>
                    </div>

                    <div className="mb-2 hidden h-px flex-1 bg-gray-200 sm:block dark:bg-gray-800" />
                  </div>

                  <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
                    {regularProjects.map((project) =>
                      renderProjectCard(project)
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* GitHub CTA */}
          {!loading && !error && projects.length > 0 && (
            <div className="mt-16 overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8 text-center dark:border-indigo-500/10 dark:from-indigo-950/30 dark:via-gray-950 dark:to-purple-950/20 sm:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-400">
                Explore More
              </p>

              <h3 className="mt-2 text-2xl font-extrabold text-gray-900 dark:text-white">
                Want to see more of my work?
              </h3>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-600 dark:text-gray-400">
                Explore my GitHub repositories for more projects, experiments
                and development work.
              </p>

              <a
                href="https://github.com/realvivekrana"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-indigo-600 hover:shadow-indigo-600/20 dark:bg-white dark:text-gray-900 dark:hover:bg-indigo-500 dark:hover:text-white"
              >
                <FaGithub className="text-lg" />
                Explore GitHub
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ================================================
          PROJECT DETAILS MODAL
      ================================================= */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950/80 px-4 py-6 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedProject(null);
            }
          }}
        >
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-950">
            {/* Close */}
            <button
              type="button"
              onClick={() => setSelectedProject(null)}
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-gray-950/80 text-xl text-white shadow-lg backdrop-blur-md transition-colors hover:bg-red-600"
              aria-label="Close project details"
            >
              ×
            </button>

            {/* Image */}
            <div className="relative h-56 overflow-hidden sm:h-72">
              {selectedProject.image ? (
                <img
                  src={selectedProject.image}
                  alt={`${selectedProject.title} project screenshot`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950/40 dark:via-gray-900 dark:to-purple-950/30">
                  <div className="text-5xl font-black text-indigo-300 dark:text-indigo-500/40">
                    &lt;/&gt;
                  </div>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />

              {selectedProject.category && (
                <span className="absolute bottom-5 left-5 rounded-full border border-white/20 bg-white/90 px-3 py-1.5 text-xs font-bold text-gray-800 backdrop-blur-md dark:bg-gray-900/90 dark:text-gray-200">
                  {selectedProject.category}
                </span>
              )}
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8">
              <div className="mb-7">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
                    {selectedProject.title}
                  </h3>

                  {selectedProject.featured && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-bold text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400">
                      <FaStar />
                      Featured
                    </span>
                  )}
                </div>

                {selectedProject.featuredType && (
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-indigo-600 dark:text-indigo-400">
                    {selectedProject.featuredType}
                  </p>
                )}

                <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base dark:text-gray-400">
                  {selectedProject.description}
                </p>
              </div>

              {/* Technologies */}
              {Array.isArray(selectedProject.techStack) &&
                selectedProject.techStack.length > 0 && (
                  <div className="mb-8">
                    <h4 className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-gray-400 dark:text-gray-500">
                      Technologies
                    </h4>

                    <div className="flex flex-wrap gap-2">
                      {selectedProject.techStack.map((tech) => (
                        <span
                          key={`${selectedProject._id}-modal-${tech}`}
                          className="rounded-full border border-indigo-100 bg-indigo-50 px-3.5 py-2 text-xs font-bold text-indigo-700 dark:border-indigo-500/10 dark:bg-indigo-500/10 dark:text-indigo-400"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Features */}
              {Array.isArray(selectedProject.keyFeatures) &&
                selectedProject.keyFeatures.length > 0 && (
                  <div className="mb-8">
                    <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.14em] text-gray-400 dark:text-gray-500">
                      Key Features
                    </h4>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {selectedProject.keyFeatures.map((feature) => (
                        <div
                          key={`${selectedProject._id}-feature-${feature}`}
                          className="flex items-start gap-3 rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-900"
                        >
                          <FaCheckCircle className="mt-0.5 shrink-0 text-indigo-500 dark:text-indigo-400" />

                          <span className="text-sm leading-6 text-gray-600 dark:text-gray-400">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Actions */}
              <div className="flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row dark:border-gray-800">
                {selectedProject.liveLink && (
                  <a
                    href={selectedProject.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20"
                  >
                    <FaExternalLinkAlt className="text-xs" />
                    Live Demo
                  </a>
                )}

                {selectedProject.githubLink && (
                  <a
                    href={selectedProject.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-800 transition-all duration-300 hover:border-gray-900 hover:bg-gray-900 hover:text-white dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-white dark:hover:bg-white dark:hover:text-gray-900"
                  >
                    <FaGithub className="text-lg" />
                    GitHub Repository
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Projects;
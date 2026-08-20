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

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | FETCH PROJECTS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError('');

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

  /*
  |--------------------------------------------------------------------------
  | PROJECT MODAL
  |--------------------------------------------------------------------------
  */

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

      window.removeEventListener(
        'keydown',
        handleEscape
      );
    };
  }, [selectedProject]);

  /*
  |--------------------------------------------------------------------------
  | FEATURED PROJECTS
  |--------------------------------------------------------------------------
  */

  const featuredProjects = useMemo(
    () =>
      projects.filter(
        (project) => project.featured
      ),
    [projects]
  );

  /*
  |--------------------------------------------------------------------------
  | REGULAR PROJECTS
  |--------------------------------------------------------------------------
  */

  const regularProjects = useMemo(
    () =>
      projects.filter(
        (project) => !project.featured
      ),
    [projects]
  );

  /*
  |--------------------------------------------------------------------------
  | PROJECT CARD
  |--------------------------------------------------------------------------
  */

  const renderProjectCard = (
    project,
    isFeatured = false
  ) => {
    const techStack = Array.isArray(
      project.techStack
    )
      ? project.techStack
      : [];

    const keyFeatures = Array.isArray(
      project.keyFeatures
    )
      ? project.keyFeatures
      : [];

    return (
      <article
        key={project._id}
        className={`group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border bg-white/[0.025] shadow-[0_0_40px_rgba(99,102,241,0.03)] backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.045] hover:shadow-[0_0_60px_rgba(99,102,241,0.1)] sm:rounded-3xl ${
          isFeatured
            ? 'border-indigo-400/20 shadow-[0_0_45px_rgba(99,102,241,0.05)]'
            : 'border-white/[0.08]'
        }`}
      >
        {/* =====================================================
            CARD COSMIC GLOW
        ====================================================== */}

        <div className="pointer-events-none absolute -right-24 -top-24 z-10 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* =====================================================
            FEATURED BADGE
        ====================================================== */}

        {isFeatured && (
          <div className="absolute left-4 top-4 z-30 inline-flex items-center gap-1.5 rounded-full border border-yellow-400/20 bg-black/75 px-3 py-1.5 text-[10px] font-bold text-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.08)] backdrop-blur-md sm:text-xs">
            <FaStar className="text-yellow-400" />

            Featured
          </div>
        )}

        {/* =====================================================
            PROJECT IMAGE
        ====================================================== */}

        <div className="relative h-52 overflow-hidden bg-black sm:h-60">

          {project.image ? (
            <img
              src={project.image}
              alt={`${project.title} project screenshot`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-950/40 via-black to-purple-950/40">
              <FaCodeFallback />
            </div>
          )}

          {/* Image Overlay */}

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-90" />

          {/* Moving Image Glow */}

          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <div className="absolute -left-1/2 top-0 h-full w-1/3 rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-sm animate-[projectShine_4s_linear_infinite]" />
          </div>

          {/* =================================================
              CATEGORY
          ================================================== */}

          {project.category && (
            <span className="absolute bottom-4 left-4 rounded-full border border-white/15 bg-black/70 px-3 py-1.5 text-[10px] font-bold text-gray-200 shadow-lg backdrop-blur-md sm:text-xs">
              {project.category}
            </span>
          )}

          {/* =================================================
              VIEW DETAILS
          ================================================== */}

          <button
            type="button"
            onClick={() =>
              setSelectedProject(project)
            }
            className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-black/75 px-3.5 py-2 text-xs font-bold text-white opacity-100 shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-indigo-600 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] sm:opacity-0 sm:group-hover:opacity-100"
          >
            <FaEye />

            View Details
          </button>
        </div>

        {/* =====================================================
            PROJECT CONTENT
        ====================================================== */}

        <div className="relative flex flex-1 flex-col p-5 sm:p-6">

          {/* =================================================
              TITLE
          ================================================== */}

          <h3 className="mb-3 break-words text-lg font-extrabold tracking-tight text-white transition-colors duration-300 group-hover:text-indigo-300 sm:text-xl">
            {project.title}
          </h3>

          {/* =================================================
              DESCRIPTION
          ================================================== */}

          <p className="mb-5 line-clamp-3 text-xs leading-6 text-gray-400 sm:text-sm sm:leading-7">
            {project.description}
          </p>

          {/* =================================================
              TECH STACK
          ================================================== */}

          {techStack.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-2">

              {techStack.map((tech) => (
                <span
                  key={`${project._id}-${tech}`}
                  className="rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5 text-[10px] font-semibold text-gray-400 transition-all duration-300 group-hover:border-indigo-400/15 group-hover:bg-indigo-500/[0.05] group-hover:text-indigo-300 sm:text-xs"
                >
                  {tech}
                </span>
              ))}

            </div>
          )}

          {/* =================================================
              KEY FEATURES
          ================================================== */}

          {keyFeatures.length > 0 && (
            <div className="mb-6">

              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-gray-500 sm:text-xs">
                Key Features
              </p>

              <div className="space-y-2">

                {keyFeatures
                  .slice(0, 3)
                  .map((feature) => (
                    <div
                      key={`${project._id}-${feature}`}
                      className="flex items-start gap-2 text-xs leading-5 text-gray-400"
                    >
                      <FaCheckCircle className="mt-0.5 shrink-0 text-indigo-400" />

                      <span className="min-w-0 break-words">
                        {feature}
                      </span>
                    </div>
                  ))}

              </div>

              {keyFeatures.length > 3 && (
                <button
                  type="button"
                  onClick={() =>
                    setSelectedProject(project)
                  }
                  className="mt-3 text-xs font-bold text-indigo-400 transition-colors hover:text-indigo-300"
                >
                  + {keyFeatures.length - 3} more features
                </button>
              )}

            </div>
          )}

          {/* =================================================
              PROJECT ACTIONS
          ================================================== */}

          <div className="mt-auto flex flex-wrap items-center gap-2.5 border-t border-white/[0.07] pt-5 sm:gap-3">

            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link inline-flex items-center gap-2 rounded-xl border border-indigo-400/15 bg-indigo-500/10 px-3.5 py-2.5 text-xs font-semibold text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-400/30 hover:bg-indigo-500/20 hover:text-white hover:shadow-[0_0_25px_rgba(99,102,241,0.15)] sm:px-4 sm:text-sm"
              >
                <FaExternalLinkAlt className="text-[10px] transition-transform duration-300 group-hover/link:translate-x-0.5" />

                Live Demo
              </a>
            )}

            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3.5 py-2.5 text-xs font-semibold text-gray-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.08] hover:text-white sm:px-4 sm:text-sm"
              >
                <FaGithub className="text-sm transition-transform duration-300 group-hover/link:scale-110" />

                GitHub
              </a>
            )}

            <button
              type="button"
              onClick={() =>
                setSelectedProject(project)
              }
              className="ml-auto inline-flex items-center gap-2 rounded-xl px-2.5 py-2.5 text-xs font-semibold text-gray-500 transition-colors hover:text-indigo-300 sm:text-sm"
            >
              <FaEye className="text-sm" />

              Details
            </button>

          </div>

        </div>
      </article>
    );
  };

  /*
  |--------------------------------------------------------------------------
  | RETURN
  |--------------------------------------------------------------------------
  */

  return (
    <>
      <section
        id="projects"
        className="relative overflow-hidden bg-transparent px-4 py-16 text-white transition-colors duration-500 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
      >

        {/* =====================================================
            LOCAL COSMIC GLOW
        ====================================================== */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 top-20 h-60 w-60 animate-[projectsOrbOne_16s_ease-in-out_infinite] rounded-full bg-indigo-600/10 blur-[100px] sm:-left-40 sm:h-80 sm:w-80"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 bottom-20 h-60 w-60 animate-[projectsOrbTwo_20s_ease-in-out_infinite] rounded-full bg-purple-600/10 blur-[100px] sm:-right-40 sm:h-80 sm:w-80"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/5 blur-[120px]"
        />

        <div className="relative z-10 mx-auto max-w-7xl">

          {/* ===================================================
              SECTION HEADER
          ==================================================== */}

          <div className="mb-10 text-center sm:mb-14 md:mb-16">

            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-indigo-400 sm:text-sm sm:tracking-[0.2em]">
              My Work
            </p>

            <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              Projects &{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Case Studies
              </span>
            </h2>

            <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 shadow-[0_0_18px_rgba(99,102,241,0.5)] sm:mt-5 sm:w-16" />

            <p className="mx-auto mt-5 max-w-2xl px-1 text-sm leading-7 text-gray-400 sm:mt-6 sm:text-base sm:leading-8 md:text-lg">
              A selection of projects that demonstrate my experience with
              frontend, backend and full-stack development.
            </p>

          </div>

          {/* ===================================================
              LOADING
          ==================================================== */}

          {loading && (
            <div className="flex min-h-52 items-center justify-center">
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] px-8 py-8 backdrop-blur-md">
                <Loader />
              </div>
            </div>
          )}

          {/* ===================================================
              ERROR
          ==================================================== */}

          {!loading && error && (
            <div className="mx-auto max-w-xl rounded-2xl border border-red-400/15 bg-red-500/[0.05] px-6 py-6 text-center backdrop-blur-md">

              <p className="font-semibold text-red-400">
                Unable to load projects
              </p>

              <p className="mt-2 text-sm leading-6 text-red-400/70">
                {error}
              </p>

            </div>
          )}

          {/* ===================================================
              EMPTY STATE
          ==================================================== */}

          {!loading &&
            !error &&
            projects.length === 0 && (
              <div className="mx-auto max-w-xl rounded-3xl border border-white/[0.08] bg-white/[0.025] px-6 py-12 text-center shadow-[0_0_40px_rgba(99,102,241,0.03)] backdrop-blur-md">

                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-400/10 bg-indigo-500/10 text-indigo-400">
                  <FaCodeFallback />
                </div>

                <h3 className="text-xl font-bold text-white">
                  No projects yet
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Projects will appear here once they are added from the admin
                  dashboard.
                </p>

              </div>
            )}

          {/* ===================================================
              PROJECTS
          ==================================================== */}

          {!loading &&
            !error &&
            projects.length > 0 && (
              <>
                {/* =============================================
                    FEATURED PROJECTS
                ============================================== */}

                {featuredProjects.length > 0 && (
                  <div className="mb-14 sm:mb-20">

                    <div className="mb-6 flex items-end gap-4 sm:mb-7">

                      <div>
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-400 sm:text-xs">
                          Top Work
                        </p>

                        <h3 className="text-xl font-extrabold text-white sm:text-2xl">
                          Featured Projects
                        </h3>
                      </div>

                      <div className="mb-2 hidden h-px flex-1 bg-white/[0.08] sm:block" />

                    </div>

                    <div className="grid gap-5 sm:gap-7 md:grid-cols-2 lg:grid-cols-3">
                      {featuredProjects.map(
                        (project) =>
                          renderProjectCard(
                            project,
                            true
                          )
                      )}
                    </div>

                  </div>
                )}

                {/* =============================================
                    ALL PROJECTS
                ============================================== */}

                {regularProjects.length > 0 && (
                  <div>

                    <div className="mb-6 flex items-end gap-4 sm:mb-7">

                      <div>
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-500 sm:text-xs">
                          More Work
                        </p>

                        <h3 className="text-xl font-extrabold text-white sm:text-2xl">
                          All Projects
                        </h3>
                      </div>

                      <div className="mb-2 hidden h-px flex-1 bg-white/[0.08] sm:block" />

                    </div>

                    <div className="grid gap-5 sm:gap-7 md:grid-cols-2 lg:grid-cols-3">
                      {regularProjects.map(
                        (project) =>
                          renderProjectCard(
                            project
                          )
                      )}
                    </div>

                  </div>
                )}

              </>
            )}

          {/* ===================================================
              GITHUB CTA
          ==================================================== */}

          {!loading &&
            !error &&
            projects.length > 0 && (
              <div className="relative mt-12 overflow-hidden rounded-2xl border border-indigo-400/10 bg-gradient-to-br from-indigo-500/[0.07] via-black/40 to-purple-500/[0.06] p-6 text-center shadow-[0_0_45px_rgba(99,102,241,0.04)] backdrop-blur-md sm:mt-16 sm:rounded-3xl sm:p-10">

                {/* Moving Glow */}

                <div className="pointer-events-none absolute -left-16 top-1/2 h-32 w-32 -translate-y-1/2 animate-[projectsGlow_8s_ease-in-out_infinite] rounded-full bg-indigo-500/10 blur-3xl" />

                <div className="relative z-10">

                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-400 sm:text-xs">
                    Explore More
                  </p>

                  <h3 className="mt-2 text-xl font-extrabold text-white sm:text-2xl">
                    Want to see more of my work?
                  </h3>

                  <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-400">
                    Explore my GitHub repositories for more projects,
                    experiments and development work.
                  </p>

                  <a
                    href="https://github.com/realvivekrana"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 rounded-xl border border-indigo-400/15 bg-indigo-500/10 px-6 py-3 text-sm font-semibold text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/30 hover:bg-indigo-500/20 hover:text-white hover:shadow-[0_0_30px_rgba(99,102,241,0.18)]"
                  >
                    <FaGithub className="text-lg" />

                    Explore GitHub
                  </a>

                </div>

              </div>
            )}

        </div>

        {/* =====================================================
            PROJECT SECTION ANIMATIONS
        ====================================================== */}

        <style>
          {`
            @keyframes projectsOrbOne {
              0%,
              100% {
                transform: translate3d(0, 0, 0) scale(1);
              }

              50% {
                transform: translate3d(90px, 50px, 0) scale(1.15);
              }
            }

            @keyframes projectsOrbTwo {
              0%,
              100% {
                transform: translate3d(0, 0, 0) scale(1);
              }

              50% {
                transform: translate3d(-90px, -60px, 0) scale(1.12);
              }
            }

            @keyframes projectsGlow {
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

            @keyframes projectShine {
              0% {
                transform: translateX(-250%) rotate(12deg);
              }

              100% {
                transform: translateX(600%) rotate(12deg);
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

      {/* =======================================================
          PROJECT DETAILS MODAL
      ======================================================== */}

      {selectedProject && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 px-3 py-4 backdrop-blur-md sm:px-4 sm:py-6"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setSelectedProject(null);
            }
          }}
        >

          <div className="relative max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/[0.1] bg-black shadow-[0_0_80px_rgba(99,102,241,0.12)] sm:max-h-[90vh] sm:rounded-3xl">

            {/* =================================================
                MODAL COSMIC GLOW
            ================================================== */}

            <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl" />

            {/* =================================================
                CLOSE
            ================================================== */}

            <button
              type="button"
              onClick={() =>
                setSelectedProject(null)
              }
              className="absolute right-3 top-3 z-30 flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-black/80 text-xl text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-red-600 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] sm:right-4 sm:top-4"
              aria-label="Close project details"
            >
              ×
            </button>

            {/* =================================================
                MODAL IMAGE
            ================================================== */}

            <div className="relative h-52 overflow-hidden bg-black sm:h-72">

              {selectedProject.image ? (
                <img
                  src={selectedProject.image}
                  alt={`${selectedProject.title} project screenshot`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-950/40 via-black to-purple-950/40">
                  <FaCodeFallback />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              {selectedProject.category && (
                <span className="absolute bottom-5 left-4 rounded-full border border-white/15 bg-black/70 px-3 py-1.5 text-xs font-bold text-gray-200 backdrop-blur-md sm:left-5">
                  {selectedProject.category}
                </span>
              )}

            </div>

            {/* =================================================
                MODAL CONTENT
            ================================================== */}

            <div className="relative p-5 sm:p-8">

              {/* =================================================
                  TITLE
              ================================================== */}

              <div className="mb-7">

                <div className="flex items-start gap-3">

                  <div className="flex-1">

                    <div className="flex flex-wrap items-center gap-2">

                      <h3 className="break-words text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                        {selectedProject.title}
                      </h3>

                      {selectedProject.featured && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-yellow-400/10 bg-yellow-500/10 px-2.5 py-1 text-xs font-bold text-yellow-400">
                          <FaStar />

                          Featured
                        </span>
                      )}

                    </div>

                  </div>

                </div>

                <p className="mt-4 text-sm leading-7 text-gray-400 sm:text-base">
                  {selectedProject.description}
                </p>

              </div>

              {/* =================================================
                  TECH STACK
              ================================================== */}

              {Array.isArray(
                selectedProject.techStack
              ) &&
                selectedProject.techStack.length >
                  0 && (
                  <div className="mb-8">

                    <h4 className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-gray-500 sm:text-xs">
                      Technologies
                    </h4>

                    <div className="flex flex-wrap gap-2">

                      {selectedProject.techStack.map(
                        (tech) => (
                          <span
                            key={`${selectedProject._id}-modal-${tech}`}
                            className="rounded-full border border-indigo-400/10 bg-indigo-500/[0.08] px-3.5 py-2 text-xs font-bold text-indigo-300"
                          >
                            {tech}
                          </span>
                        )
                      )}

                    </div>

                  </div>
                )}

              {/* =================================================
                  KEY FEATURES
              ================================================== */}

              {Array.isArray(
                selectedProject.keyFeatures
              ) &&
                selectedProject.keyFeatures.length >
                  0 && (
                  <div className="mb-8">

                    <h4 className="mb-4 text-[10px] font-bold uppercase tracking-[0.14em] text-gray-500 sm:text-xs">
                      Key Features
                    </h4>

                    <div className="grid gap-3 sm:grid-cols-2">

                      {selectedProject.keyFeatures.map(
                        (feature) => (
                          <div
                            key={`${selectedProject._id}-feature-${feature}`}
                            className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 transition-all duration-300 hover:border-indigo-400/15 hover:bg-indigo-500/[0.04]"
                          >

                            <FaCheckCircle className="mt-0.5 shrink-0 text-indigo-400" />

                            <span className="text-sm leading-6 text-gray-400">
                              {feature}
                            </span>

                          </div>
                        )
                      )}

                    </div>

                  </div>
                )}

              {/* =================================================
                  ACTIONS
              ================================================== */}

              <div className="flex flex-col gap-3 border-t border-white/[0.08] pt-6 sm:flex-row">

                {selectedProject.liveLink && (
                  <a
                    href={
                      selectedProject.liveLink
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-indigo-400/15 bg-indigo-500/10 px-5 py-3 text-sm font-semibold text-indigo-300 transition-all duration-300 hover:border-indigo-400/30 hover:bg-indigo-500/20 hover:text-white hover:shadow-[0_0_25px_rgba(99,102,241,0.15)]"
                  >
                    <FaExternalLinkAlt className="text-xs" />

                    Live Demo
                  </a>
                )}

                {selectedProject.githubLink && (
                  <a
                    href={
                      selectedProject.githubLink
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-5 py-3 text-sm font-semibold text-gray-300 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
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

/*
|--------------------------------------------------------------------------
| SIMPLE FALLBACK ICON
|--------------------------------------------------------------------------
*/

function FaCodeFallback() {
  return (
    <div className="text-5xl font-black text-indigo-400/40 drop-shadow-[0_0_20px_rgba(99,102,241,0.3)]">
      &lt;/&gt;
    </div>
  );
}

export default Projects;
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import {
  FaArrowLeft,
  FaGithub,
  FaExternalLinkAlt,
  FaLightbulb,
  FaTools,
  FaExclamationTriangle,
  FaCode,
} from 'react-icons/fa';

import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import AnimatedBackground from '../components/ui/AnimatedBackground';

import API from '../utils/axios';
import { optimizeImageUrl } from '../utils/optimizeImage';

/*
|--------------------------------------------------------------------------
| Project Case Study Page — /projects/:slug
|--------------------------------------------------------------------------
|
| Har project ka apna detailed page: problem, solution, tech decisions,
| challenges, aur screenshots.
|
*/

function ProjectCaseStudy() {
  const { slug } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await API.get(`/projects/case-study/${slug}`);
        setProject(response?.data?.data || null);
      } catch (err) {
        console.error('Failed to fetch case study:', err);
        setError('This case study could not be found.');
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
    window.scrollTo(0, 0);
  }, [slug]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-black text-white">
      <AnimatedBackground />

      <div className="relative z-50">
        <Navbar />
      </div>

      <main className="relative z-10 mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <Link
          to="/#projects"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-gray-400 transition-colors hover:text-indigo-300"
        >
          <FaArrowLeft className="text-xs" />
          Back to Projects
        </Link>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-400 border-t-transparent" />
          </div>
        )}

        {!loading && (error || !project) && (
          <div className="rounded-2xl border border-red-400/10 bg-red-500/[0.05] p-10 text-center">
            <FaExclamationTriangle className="mx-auto text-3xl text-red-400" />
            <h1 className="mt-4 text-xl font-bold text-white">Case Study Not Found</h1>
            <p className="mt-2 text-sm text-gray-400">
              {error || 'This project may not have a detailed case study yet.'}
            </p>
          </div>
        )}

        {!loading && project && (
          <article>
            {/* Category */}
            <span className="inline-flex rounded-full bg-indigo-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-indigo-300">
              {project.category}
            </span>

            {/* Title */}
            <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              {project.title}
            </h1>

            <p className="mt-4 text-base leading-7 text-gray-400 sm:text-lg">
              {project.description}
            </p>

            {/* Links */}
            <div className="mt-6 flex flex-wrap gap-3">
              {project.githubLink && (
                <a
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/[0.08]"
                >
                  <FaGithub />
                  Source Code
                </a>
              )}

              {project.liveLink && (
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-indigo-400/20 bg-indigo-500/10 px-5 py-2.5 text-sm font-semibold text-indigo-300 transition-colors hover:bg-indigo-500/20 hover:text-white"
                >
                  <FaExternalLinkAlt className="text-xs" />
                  Live Demo
                </a>
              )}
            </div>

            {/* Cover Image */}
            {project.image && (
              <img
                src={optimizeImageUrl(project.image, { width: 1000 })}
                alt={project.title}
                className="mt-10 w-full rounded-2xl border border-white/[0.08] object-cover sm:rounded-3xl"
                loading="lazy"
              />
            )}

            {/* Tech Stack */}
            {project.techStack?.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-xs font-semibold text-gray-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            {/* Problem */}
            {project.problem && (
              <CaseStudySection
                icon={<FaExclamationTriangle />}
                title="The Problem"
                content={project.problem}
              />
            )}

            {/* Solution */}
            {project.solution && (
              <CaseStudySection
                icon={<FaLightbulb />}
                title="The Solution"
                content={project.solution}
              />
            )}

            {/* Tech Decisions */}
            {project.techDecisions?.length > 0 && (
              <CaseStudyList
                icon={<FaCode />}
                title="Tech Decisions"
                items={project.techDecisions}
              />
            )}

            {/* Challenges */}
            {project.challenges?.length > 0 && (
              <CaseStudyList
                icon={<FaTools />}
                title="Challenges Faced"
                items={project.challenges}
              />
            )}

            {/* Key Features */}
            {project.keyFeatures?.length > 0 && (
              <CaseStudyList
                icon={<FaLightbulb />}
                title="Key Features"
                items={project.keyFeatures}
              />
            )}

            {/* Screenshots */}
            {project.screenshots?.length > 0 && (
              <div className="mt-14">
                <h2 className="mb-6 text-2xl font-extrabold text-white">
                  Screenshots
                </h2>

                <div className="grid gap-4 sm:grid-cols-2">
                  {project.screenshots.map((shot, index) => (
                    <img
                      key={index}
                      src={optimizeImageUrl(shot, { width: 700 })}
                      alt={`${project.title} screenshot ${index + 1}`}
                      className="w-full rounded-xl border border-white/[0.08] object-cover"
                      loading="lazy"
                    />
                  ))}
                </div>
              </div>
            )}
          </article>
        )}
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}

function CaseStudySection({ icon, title, content }) {
  return (
    <div className="mt-12">
      <h2 className="mb-4 flex items-center gap-2.5 text-2xl font-extrabold text-white">
        <span className="text-indigo-400">{icon}</span>
        {title}
      </h2>

      <p className="text-base leading-8 text-gray-300">{content}</p>
    </div>
  );
}

function CaseStudyList({ icon, title, items }) {
  return (
    <div className="mt-12">
      <h2 className="mb-4 flex items-center gap-2.5 text-2xl font-extrabold text-white">
        <span className="text-indigo-400">{icon}</span>
        {title}
      </h2>

      <ul className="space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex gap-3 text-base leading-7 text-gray-300">
            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProjectCaseStudy;
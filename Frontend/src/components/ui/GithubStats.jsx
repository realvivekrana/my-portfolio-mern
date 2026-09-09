import { useEffect, useState } from 'react';

import {
  FaGithub,
  FaStar,
  FaCodeBranch,
  FaExternalLinkAlt,
} from 'react-icons/fa';

/*
|--------------------------------------------------------------------------
| GitHub Stats Widget
|--------------------------------------------------------------------------
|
| Public GitHub REST API se live pinned-style repos (top repos by
| stars) aur profile summary dikhata hai. Koi backend/API key nahi
| chahiye — GitHub ka public, unauthenticated API use hota hai
| (rate-limited to 60 req/hr per IP, jo ek portfolio ke liye kaafi hai).
|
| Prop:
|   username — GitHub username (required)
|
|--------------------------------------------------------------------------
*/

function GithubStats({ username }) {
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!username) {
      setLoading(false);
      setError('GitHub username not configured.');
      return;
    }

    const controller = new AbortController();

    const fetchGithubData = async () => {
      try {
        setLoading(true);
        setError('');

        const [profileRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`, {
            signal: controller.signal,
          }),
          fetch(
            `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
            { signal: controller.signal }
          ),
        ]);

        if (!profileRes.ok || !reposRes.ok) {
          throw new Error('GitHub API request failed');
        }

        const profileData = await profileRes.json();
        const reposData = await reposRes.json();

        const topRepos = Array.isArray(reposData)
          ? [...reposData]
              .filter((repo) => !repo.fork)
              .sort((a, b) => b.stargazers_count - a.stargazers_count)
              .slice(0, 6)
          : [];

        setProfile(profileData);
        setRepos(topRepos);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Failed to fetch GitHub stats:', err);
          setError('Unable to load GitHub stats right now.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGithubData();

    return () => controller.abort();
  }, [username]);

  if (loading) {
    return (
      <section id="github-stats" className="relative overflow-hidden bg-transparent px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="relative z-10 mx-auto flex max-w-6xl justify-center">
          <div
            className="h-10 w-10 animate-spin rounded-full border-4 border-purple-400 border-t-transparent"
            aria-label="Loading GitHub stats"
          />
        </div>
      </section>
    );
  }

  if (error || !profile) {
    return null;
  }

  return (
    <section
      id="github-stats"
      className="relative overflow-hidden bg-transparent px-4 py-16 text-white transition-colors duration-500 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-24 h-60 w-60 rounded-full bg-cyan-600/10 blur-[100px] sm:-left-40 sm:h-80 sm:w-80"
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10 text-center sm:mb-14 md:mb-16">
          <p className="mb-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-300 sm:text-sm sm:tracking-[0.2em]">
            <FaGithub className="text-sm" />
            Open Source
          </p>

          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
            GitHub{' '}
            <span className="bg-gradient-to-r from-[#A78BFA] via-[#8B5CF6] to-[#3B82F6] bg-clip-text text-transparent">
              Activity
            </span>
          </h2>

          <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#A78BFA] to-[#3B82F6] sm:mt-5 sm:w-16" />
        </div>

        {/* Profile Summary */}
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          <StatCard label="Public Repos" value={profile.public_repos} />
          <StatCard label="Followers" value={profile.followers} />
          <StatCard label="Following" value={profile.following} />
        </div>

        {/* Contribution graph image (GitHub renders this live, no API key needed) */}
        <div className="mb-10 overflow-x-auto rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 backdrop-blur-md sm:rounded-3xl sm:p-6">
          <img
            src={`https://ghchart.rshah.org/6366f1/${username}`}
            alt={`${username}'s GitHub contribution graph`}
            className="mx-auto min-w-[600px]"
            loading="lazy"
          />
        </div>

        {/* Top Repos */}
        {repos.length > 0 && (
          <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {repos.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-purple-400/25 hover:bg-white/[0.04] sm:rounded-3xl sm:p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="truncate text-base font-bold text-white group-hover:text-purple-200 sm:text-lg">
                    {repo.name}
                  </h3>

                  <FaExternalLinkAlt className="mt-1 shrink-0 text-xs text-gray-500 group-hover:text-purple-200" />
                </div>

                <p className="mt-2 line-clamp-2 flex-1 text-xs leading-6 text-gray-400 sm:text-sm">
                  {repo.description || 'No description provided.'}
                </p>

                <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                  {repo.language && (
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-purple-400" />
                      {repo.language}
                    </span>
                  )}

                  <span className="inline-flex items-center gap-1">
                    <FaStar className="text-[10px]" />
                    {repo.stargazers_count}
                  </span>

                  <span className="inline-flex items-center gap-1">
                    <FaCodeBranch className="text-[10px]" />
                    {repo.forks_count}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 text-center backdrop-blur-md sm:rounded-3xl">
      <p className="text-3xl font-extrabold text-white sm:text-4xl">
        {value ?? 0}
      </p>

      <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
        {label}
      </p>
    </div>
  );
}

export default GithubStats;
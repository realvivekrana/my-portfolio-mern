import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  FaRegNewspaper,
  FaRegClock,
  FaTag,
} from 'react-icons/fa';

import Navbar from '../components/layout/Navbar';
import BackButton from '../components/ui/BackButton';
import Footer from '../components/layout/Footer';
import AnimatedBackground from '../components/ui/AnimatedBackground';

import API from '../utils/axios';
import { optimizeImageUrl } from '../utils/optimizeImage';
import useSeo from '../utils/useSeo';

/*
|--------------------------------------------------------------------------
| Blog Archive Page — /blog
|--------------------------------------------------------------------------
|
| Full listing of published posts with tag filter + pagination.
|
*/

function BlogArchive() {
  useSeo({
    title: 'Blog - MERN Stack, React & Node.js Articles',
    description:
      'Articles by Vivek Rana on MERN stack development, React, Node.js, Express and MongoDB.',
    path: '/blog',
  });

  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [activeTag, setActiveTag] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    API.get('/blog/tags')
      .then((res) => setTags(Array.isArray(res?.data?.data) ? res.data.data : []))
      .catch(() => setTags([]));
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await API.get('/blog', {
          params: {
            page,
            limit: 9,
            ...(activeTag ? { tag: activeTag } : {}),
          },
        });

        setPosts(Array.isArray(response?.data?.data) ? response.data.data : []);
        setPagination(response?.data?.pagination || { pages: 1 });
      } catch (err) {
        console.error('Failed to fetch blog posts:', err);
        setError('Unable to load blog posts right now.');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, activeTag]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-black text-white">
      <AnimatedBackground />

      <div className="relative z-50">
        <Navbar />
      </div>

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center sm:mb-14">
          <BackButton
            fallback="/"
            label="Back"
            className="mb-6"
          />

          <p className="mb-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-300 sm:text-sm">
            <FaRegNewspaper className="text-sm" />
            Blog
          </p>

          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
            All{' '}
            <span className="bg-gradient-to-r from-[#A78BFA] via-[#8B5CF6] to-[#3B82F6] bg-clip-text text-transparent">
              Articles
            </span>
          </h1>
        </div>

        {/* Tag Filter */}
        {tags.length > 0 && (
          <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => {
                setActiveTag('');
                setPage(1);
              }}
              className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                activeTag === ''
                  ? 'border-purple-400/35 bg-purple-500/20 text-white'
                  : 'border-white/[0.08] bg-white/[0.025] text-gray-400 hover:text-white'
              }`}
            >
              All
            </button>

            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setActiveTag(tag);
                  setPage(1);
                }}
                className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                  activeTag === tag
                    ? 'border-purple-400/35 bg-purple-500/20 text-white'
                    : 'border-white/[0.08] bg-white/[0.025] text-gray-400 hover:text-white'
                }`}
              >
                <FaTag className="text-[10px]" />
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-400 border-t-transparent" />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mx-auto max-w-2xl rounded-2xl border border-red-400/10 bg-red-500/[0.05] p-8 text-center">
            <p className="text-sm text-gray-400">{error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && posts.length === 0 && (
          <div className="mx-auto max-w-2xl rounded-2xl border border-white/[0.08] bg-white/[0.025] p-10 text-center backdrop-blur-md">
            <FaRegNewspaper className="mx-auto text-4xl text-purple-300" />
            <h3 className="mt-5 text-xl font-extrabold text-white">No Articles Yet</h3>
            <p className="mt-3 text-sm leading-7 text-gray-400">
              Check back soon for new posts.
            </p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && posts.length > 0 && (
          <>
            <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post._id}
                  to={`/blog/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-purple-400/25 hover:bg-white/[0.04] sm:rounded-3xl"
                >
                  {post.coverImage && (
                    <div className="overflow-hidden border-b border-white/[0.06]">
                      <img
                        src={optimizeImageUrl(post.coverImage, { width: 480 })}
                        alt={post.title}
                        className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    {post.tags?.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-2">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-purple-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-purple-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <h3 className="text-lg font-extrabold text-white transition-colors group-hover:text-purple-200 sm:text-xl">
                      {post.title}
                    </h3>

                    <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-gray-400">
                      {post.excerpt}
                    </p>

                    <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1.5">
                        <FaRegClock className="text-[10px]" />
                        {post.readTime} min read
                      </span>

                      <span>{post.views || 0} views</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                {Array.from({ length: pagination.pages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`h-10 w-10 rounded-lg text-sm font-semibold transition-colors ${
                      page === i + 1
                        ? 'bg-purple-500 text-white'
                        : 'bg-white/[0.025] text-gray-400 hover:bg-white/[0.06]'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}

export default BlogArchive;
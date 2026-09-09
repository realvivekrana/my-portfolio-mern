import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

import {
  FaRegNewspaper,
  FaRegClock,
  FaArrowRight,
} from 'react-icons/fa';

import API from '../../utils/axios';
import { optimizeImageUrl } from '../../utils/optimizeImage';

/*
|--------------------------------------------------------------------------
| Blog Preview Section (Home Page)
|--------------------------------------------------------------------------
|
| Latest / featured articles ka ek chhota preview dikhata hai, poora
| archive /blog par hai. Agar koi published post nahi hai to section
| render hi nahi hota.
|
*/

function Blog() {
  const { t } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await API.get('/blog/featured');
        const data = response?.data?.data;

        setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch featured blog posts:', err);
        setError('Unable to load blog posts right now.');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPosts();
  }, []);

  if (loading) {
    return (
      <section id="blog" className="relative overflow-hidden bg-transparent px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="relative z-10 mx-auto flex max-w-7xl justify-center">
          <div
            className="h-10 w-10 animate-spin rounded-full border-4 border-purple-400 border-t-transparent"
            aria-label="Loading blog posts"
          />
        </div>
      </section>
    );
  }

  if (error || posts.length === 0) {
    return null;
  }

  return (
    <section
      id="blog"
      className="relative overflow-hidden bg-transparent px-4 py-16 text-white transition-colors duration-500 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-24 h-60 w-60 rounded-full bg-purple-600/10 blur-[100px] sm:-right-40 sm:h-80 sm:w-80"
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 flex flex-col items-center gap-4 text-center sm:mb-14 md:mb-16">
          <p className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-300 sm:text-sm sm:tracking-[0.2em]">
            <FaRegNewspaper className="text-sm" />
            {t('blog.eyebrow')}
          </p>

          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
            {t('blog.heading')}{' '}
            <span className="bg-gradient-to-r from-[#A78BFA] via-[#8B5CF6] to-[#3B82F6] bg-clip-text text-transparent">
              {t('blog.headingHighlight')}
            </span>
          </h2>

          <div className="h-1 w-14 rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#A78BFA] to-[#3B82F6] sm:w-16" />
        </div>

        {/* Grid */}
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

                <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-gray-400">
                  {post.excerpt}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4 text-xs text-gray-500">
                  <span className="inline-flex items-center gap-1.5">
                    <FaRegClock className="text-[10px]" />
                    {post.readTime} min read
                  </span>

                  <span className="inline-flex items-center gap-1.5 font-semibold text-purple-200 group-hover:gap-2.5 transition-all">
                    Read
                    <FaArrowRight className="text-[10px]" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All */}
        <div className="mt-10 text-center sm:mt-12">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 rounded-xl border border-purple-400/25 bg-purple-500/10 px-6 py-3 text-sm font-semibold text-purple-200 transition-all duration-300 hover:border-purple-400/35 hover:bg-purple-500/20 hover:text-white"
          >
            View All Articles
            <FaArrowRight className="text-xs" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Blog;
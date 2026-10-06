import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import {
  FaRegClock,
  FaRegEye,
  FaTag,
  FaExclamationTriangle,
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
| Blog Post Page — /blog/:slug
|--------------------------------------------------------------------------
*/

function BlogPost() {
  const { slug } = useParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useSeo({
    title: post?.title,
    description: post?.excerpt,
    path: `/blog/${slug}`,
    image: post?.coverImage,
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await API.get(`/blog/${slug}`);
        setPost(response?.data?.data || null);
      } catch (err) {
        console.error('Failed to fetch blog post:', err);
        setError('This article could not be found.');
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
    window.scrollTo(0, 0);
  }, [slug]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-black text-white">
      <AnimatedBackground />

      <div className="relative z-50">
        <Navbar />
      </div>

      <main className="relative z-10 mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <BackButton
          fallback="/blog"
          label="Back"
          className="mb-8"
        />

        {loading && (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-400 border-t-transparent" />
          </div>
        )}

        {!loading && (error || !post) && (
          <div className="rounded-2xl border border-red-400/10 bg-red-500/[0.05] p-10 text-center">
            <FaExclamationTriangle className="mx-auto text-3xl text-red-400" />
            <h1 className="mt-4 text-xl font-bold text-white">Article Not Found</h1>
            <p className="mt-2 text-sm text-gray-400">
              {error || 'This article may have been removed or unpublished.'}
            </p>
          </div>
        )}

        {!loading && post && (
          <article>
            {/* Tags */}
            {post.tags?.length > 0 && (
              <div className="mb-5 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-purple-200"
                  >
                    <FaTag className="text-[9px]" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="mt-5 flex flex-wrap items-center gap-4 border-b border-white/[0.08] pb-6 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1.5">
                <FaRegClock className="text-xs" />
                {post.readTime} min read
              </span>

              <span className="inline-flex items-center gap-1.5">
                <FaRegEye className="text-xs" />
                {post.views} views
              </span>

              {post.publishedAt && (
                <span>
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              )}
            </div>

            {/* Cover Image */}
            {post.coverImage && (
              <img
                src={optimizeImageUrl(post.coverImage, { width: 1000 })}
                alt={post.title}
                className="mt-8 w-full rounded-2xl border border-white/[0.08] object-cover sm:rounded-3xl"
                loading="lazy"
              />
            )}

            {/* Markdown Content */}
            <div className="markdown-content mt-10">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
              </ReactMarkdown>
            </div>
          </article>
        )}
      </main>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}

export default BlogPost;
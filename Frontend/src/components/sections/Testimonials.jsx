import { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

import {
  FaQuoteLeft,
  FaStar,
  FaUserCircle,
  FaLinkedin,
  FaComments,
} from 'react-icons/fa';

import API from '../../utils/axios';
import { optimizeImageUrl } from '../../utils/optimizeImage';

/*
|--------------------------------------------------------------------------
| Testimonials Section
|--------------------------------------------------------------------------
|
| Clients / colleagues ke recommendations dikhata hai. Agar koi
| testimonial admin ne add nahi kiya hai to section render hi nahi
| hota (return null) — home page par khaali gap nahi dikhega.
|
*/

function Testimonials() {
  const { t } = useLanguage();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await API.get('/testimonials');
        const data = response?.data?.data;

        if (Array.isArray(data)) {
          setTestimonials(data);
        } else {
          setTestimonials([]);
        }
      } catch (err) {
        console.error('Failed to fetch testimonials:', err);
        setError('Unable to load testimonials right now.');
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <section id="testimonials" className="relative overflow-hidden bg-transparent px-4 py-6 text-white sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="relative z-10 mx-auto flex max-w-7xl justify-center">
          <div
            className="h-10 w-10 animate-spin rounded-full border-4 border-purple-400 border-t-transparent"
            aria-label="Loading testimonials"
          />
        </div>
      </section>
    );
  }

  // Error ya empty state par section chupa dete hain — public visitors ko
  // ek khaali/broken looking section nahi dikhna chahiye.
  if (error || testimonials.length === 0) {
    return null;
  }

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-transparent px-4 py-6 text-white transition-colors duration-500 sm:px-6 sm:py-10 lg:px-8 lg:py-12 premium-section premium-section-testimonials"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-20 h-60 w-60 rounded-full bg-purple-600/10 blur-[100px] sm:-left-40 sm:h-80 sm:w-80"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-20 h-60 w-60 rounded-full bg-[#8B5CF6]/12 blur-[100px] sm:-right-40 sm:h-80 sm:w-80"
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center sm:mb-10 md:mb-12">
          <p className="mb-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-300 sm:text-sm sm:tracking-[0.2em]">
            <FaComments className="text-sm" />
            {t('testimonials.eyebrow')}
          </p>

          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
            {t('testimonials.heading')}{' '}
            <span className="bg-gradient-to-r from-[#A78BFA] via-[#8B5CF6] to-[#3B82F6] bg-clip-text text-transparent">
              {t('testimonials.headingHighlight')}
            </span>
          </h2>

          <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#A78BFA] to-[#3B82F6] sm:mt-5 sm:w-16" />

          <p className="mx-auto mt-5 max-w-2xl px-1 text-sm leading-7 text-gray-400 sm:mt-6 sm:text-base sm:leading-8 md:text-lg">
            {t('testimonials.subtitle')}
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <article
              key={testimonial?._id || `${testimonial?.name}-${index}`}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-purple-400/25 hover:bg-white/[0.04] sm:rounded-3xl sm:p-7"
            >
              <FaQuoteLeft className="text-2xl text-purple-300/30" />

              {/* Rating */}
              <div className="mt-4 flex gap-1">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <FaStar
                    key={starIndex}
                    className={`text-xs ${
                      starIndex < (Number(testimonial?.rating) || 5)
                        ? 'text-yellow-400'
                        : 'text-gray-700'
                    }`}
                  />
                ))}
              </div>

              {/* Message */}
              <p className="relative z-10 mt-4 flex-1 text-sm leading-7 text-gray-300 sm:text-base">
                "{testimonial?.message}"
              </p>

              {/* Author */}
              <div className="relative z-10 mt-6 flex items-center gap-3 border-t border-white/[0.06] pt-5">
                {testimonial?.avatar ? (
                  <img
                    src={optimizeImageUrl(testimonial.avatar, { width: 96 })}
                    alt={testimonial?.name || 'Testimonial author'}
                    className="h-11 w-11 rounded-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <FaUserCircle className="h-11 w-11 text-gray-600" />
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-white">
                    {testimonial?.name || 'Anonymous'}
                  </p>

                  <p className="truncate text-xs text-gray-500">
                    {[testimonial?.role, testimonial?.company]
                      .filter(Boolean)
                      .join(' · ') || 'Client'}
                  </p>
                </div>

                {testimonial?.profileUrl && (
                  <a
                    href={testimonial.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${testimonial?.name}'s profile`}
                    className="shrink-0 text-lg text-gray-500 transition-colors hover:text-purple-300"
                  >
                    <FaLinkedin />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
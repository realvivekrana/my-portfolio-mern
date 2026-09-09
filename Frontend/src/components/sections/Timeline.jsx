import { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

import {
  FaBriefcase,
  FaGraduationCap,
  FaRoute,
} from 'react-icons/fa';

import API from '../../utils/axios';

/*
|--------------------------------------------------------------------------
| Extract a sortable year from a duration string
|--------------------------------------------------------------------------
|
| Duration strings look like "Jan 2023 - Present" or "2019 - 2021".
| We pull out the FIRST 4-digit year we find so items can be sorted
| chronologically (newest first) regardless of exact format.
|
*/

const extractStartYear = (duration = '') => {
  const match = String(duration).match(/(19|20)\d{2}/);
  return match ? Number(match[0]) : 0;
};

const isOngoing = (duration = '') =>
  /present|current|ongoing/i.test(String(duration));

/*
|--------------------------------------------------------------------------
| Timeline Section
|--------------------------------------------------------------------------
|
| Experience + Education ko ek hi unified vertical timeline mein
| chronologically (latest → oldest) dikhata hai.
|
*/

function Timeline() {
  const { t } = useLanguage();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await API.get('/portfolio', {
          params: { _t: Date.now() },
        });

        const portfolio = response?.data?.data || response?.data || {};

        const experience = Array.isArray(portfolio?.experience)
          ? portfolio.experience
          : [];

        const education = Array.isArray(portfolio?.education)
          ? portfolio.education
          : [];

        const merged = [
          ...experience
            .filter((item) => item?.isVisible !== false)
            .map((item) => ({
              type: 'experience',
              title: item?.role || 'Role',
              subtitle: item?.company || 'Company',
              duration: item?.duration || '',
              description: item?.description || '',
              tags: Array.isArray(item?.technologies) ? item.technologies : [],
              startYear: extractStartYear(item?.duration),
              ongoing: isOngoing(item?.duration),
              key: item?._id || `exp-${item?.role}-${item?.company}`,
            })),
          ...education
            .filter((item) => item?.isVisible !== false)
            .map((item) => ({
              type: 'education',
              title: item?.degree || 'Degree',
              subtitle: item?.institution || 'Institution',
              duration: item?.duration || '',
              description: item?.description || '',
              tags: [],
              startYear: extractStartYear(item?.duration),
              ongoing: isOngoing(item?.duration),
              key: item?._id || `edu-${item?.degree}-${item?.institution}`,
            })),
        ].sort((a, b) => {
          if (a.ongoing !== b.ongoing) return a.ongoing ? -1 : 1;
          return b.startYear - a.startYear;
        });

        setItems(merged);
      } catch (err) {
        console.error('Failed to fetch timeline:', err);
        setError('Unable to load the timeline right now.');
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeline();
  }, []);

  if (loading) {
    return (
      <section id="timeline" className="relative overflow-hidden bg-transparent px-4 py-6 text-white sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="relative z-10 mx-auto flex max-w-5xl justify-center">
          <div
            className="h-10 w-10 animate-spin rounded-full border-4 border-purple-400 border-t-transparent"
            aria-label="Loading timeline"
          />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="timeline" className="relative overflow-hidden bg-transparent px-4 py-6 text-white sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="relative z-10 mx-auto max-w-5xl">
          <div className="rounded-2xl border border-red-400/10 bg-red-500/[0.05] p-8 text-center">
            <FaRoute className="mx-auto text-3xl text-red-400" />
            <h2 className="mt-4 text-xl font-bold text-white">Timeline</h2>
            <p className="mt-2 text-sm text-gray-400">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!items.length) {
    return null;
  }

  return (
    <section
      id="timeline"
      className="relative overflow-hidden bg-transparent px-4 py-6 text-white transition-colors duration-500 sm:px-6 sm:py-10 lg:px-8 lg:py-12 premium-section premium-section-timeline"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-24 h-60 w-60 rounded-full bg-[#8B5CF6]/12 blur-[100px] sm:-left-40 sm:h-80 sm:w-80"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-24 h-60 w-60 rounded-full bg-cyan-600/10 blur-[100px] sm:-right-40 sm:h-80 sm:w-80"
      />

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 text-center sm:mb-10 md:mb-12">
          <p className="mb-3 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-300 sm:text-sm sm:tracking-[0.2em]">
            <FaRoute className="text-sm" />
            {t('timeline.eyebrow')}
          </p>

          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
            {t('timeline.heading')}{' '}
            <span className="bg-gradient-to-r from-[#A78BFA] via-[#8B5CF6] to-[#3B82F6] bg-clip-text text-transparent">
              {t('timeline.headingHighlight')}
            </span>{' '}
            {t('timeline.headingSuffix')}
          </h2>

          <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#A78BFA] to-[#3B82F6] sm:mt-5 sm:w-16" />

          <p className="mx-auto mt-5 max-w-2xl px-1 text-sm leading-7 text-gray-400 sm:mt-6 sm:text-base sm:leading-8 md:text-lg">
            {t('timeline.subtitle')}
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-5 top-0 h-full w-px bg-white/[0.08] sm:left-1/2 sm:-translate-x-1/2" />

          <div className="space-y-10">
            {items.map((item, index) => {
              const isEven = index % 2 === 0;
              const isExperience = item.type === 'experience';

              return (
                <div key={item.key} className="relative">
                  {/* Dot */}
                  <div className="absolute left-5 top-1 -translate-x-1/2 sm:left-1/2">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full border-4 border-black shadow-lg sm:h-10 sm:w-10 ${
                        isExperience
                          ? 'bg-purple-500'
                          : 'bg-cyan-500'
                      }`}
                    >
                      {isExperience ? (
                        <FaBriefcase className="text-xs text-white" />
                      ) : (
                        <FaGraduationCap className="text-xs text-white" />
                      )}
                    </div>
                  </div>

                  {/* Mobile card */}
                  <div className="pl-14 sm:hidden">
                    <TimelineCard item={item} />
                  </div>

                  {/* Desktop layout */}
                  <div className="hidden sm:grid sm:grid-cols-2 sm:gap-16">
                    <div className={isEven ? 'sm:col-start-1' : 'sm:col-start-2'}>
                      <TimelineCard item={item} />
                    </div>

                    <div className={isEven ? 'sm:col-start-2' : 'sm:col-start-1'} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/*
|--------------------------------------------------------------------------
| Timeline Card
|--------------------------------------------------------------------------
*/

function TimelineCard({ item }) {
  const isExperience = item.type === 'experience';

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-purple-400/25 hover:bg-white/[0.04]">
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
          isExperience
            ? 'bg-purple-500/10 text-purple-200'
            : 'bg-cyan-500/10 text-cyan-300'
        }`}
      >
        {isExperience ? <FaBriefcase /> : <FaGraduationCap />}
        {isExperience ? 'Experience' : 'Education'}
      </span>

      <h3 className="mt-4 text-lg font-extrabold text-white sm:text-xl">
        {item.title}
      </h3>

      <p className="mt-1 text-sm font-semibold text-gray-400">
        {item.subtitle}
      </p>

      {item.duration && (
        <p className="mt-2 text-xs font-medium text-purple-200/80">
          {item.duration}
        </p>
      )}

      {item.description && (
        <p className="mt-4 text-sm leading-6 text-gray-400">
          {item.description}
        </p>
      )}

      {item.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {item.tags.map((tag, i) => (
            <span
              key={`${item.key}-${tag}-${i}`}
              className="rounded-full border border-white/[0.07] bg-white/[0.025] px-2.5 py-1 text-[11px] font-semibold text-gray-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default Timeline;
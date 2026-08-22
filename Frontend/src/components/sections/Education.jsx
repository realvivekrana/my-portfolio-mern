import { useEffect, useState } from 'react';
import {
  FaGraduationCap,
  FaUniversity,
  FaBookOpen,
  FaBrain,
  FaAward,
} from 'react-icons/fa';

import API from '../../utils/axios';

/*
|--------------------------------------------------------------------------
| Education Section
|--------------------------------------------------------------------------
|
| Education data MongoDB se:
|
| GET /api/portfolio
|
| ke through load hoga.
|
| Admin Dashboard se Education update karne par
| public portfolio automatically updated data show karega.
|
|--------------------------------------------------------------------------
*/

const Education = () => {
  const [education, setEducation] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  /*
  |--------------------------------------------------------------------------
  | Fetch Education
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const fetchEducation =
      async () => {
        try {
          setLoading(true);
          setError('');

          const response =
            await API.get(
              '/portfolio'
            );

          const portfolio =
            response?.data?.data;

          const educationData =
            portfolio?.education;

          /*
          |--------------------------------------------------------------------------
          | Validate Education Array
          |--------------------------------------------------------------------------
          */

          if (
            Array.isArray(
              educationData
            )
          ) {
            const visibleEducation =
              educationData
                .filter(
                  (item) =>
                    item?.isVisible !==
                    false
                )
                .sort(
                  (a, b) =>
                    Number(
                      a?.displayOrder || 0
                    ) -
                    Number(
                      b?.displayOrder || 0
                    )
                );

            setEducation(
              visibleEducation
            );
          } else {
            setEducation([]);
          }
        } catch (err) {
          console.error(
            'Failed to fetch education:',
            err
          );

          setError(
            'Unable to load education information.'
          );

          setEducation([]);
        } finally {
          setLoading(false);
        }
      };

    fetchEducation();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Get Education Icon
  |--------------------------------------------------------------------------
  */

  const getEducationIcon = (
    icon,
    degree = ''
  ) => {
    const iconName =
      String(icon || '').toLowerCase();

    const degreeName =
      String(degree || '').toLowerCase();

    if (
      iconName.includes('brain') ||
      degreeName.includes('artificial') ||
      degreeName.includes('machine learning')
    ) {
      return <FaBrain />;
    }

    if (
      iconName.includes('university') ||
      degreeName.includes('university')
    ) {
      return <FaUniversity />;
    }

    if (
      iconName.includes('award') ||
      degreeName.includes('master') ||
      degreeName.includes('mca')
    ) {
      return <FaAward />;
    }

    return <FaBookOpen />;
  };

  /*
  |--------------------------------------------------------------------------
  | Loading State
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <section
        id="education"
        className="relative overflow-hidden py-20 sm:py-24"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div
              className="h-10 w-10 animate-spin rounded-full border-4 border-current border-t-transparent"
              aria-label="Loading education"
            />
          </div>
        </div>
      </section>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error State
  |--------------------------------------------------------------------------
  */

  if (error) {
    return (
      <section
        id="education"
        className="relative overflow-hidden py-20 sm:py-24"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900/40 dark:bg-red-950/20">
            <FaGraduationCap className="mx-auto text-3xl text-red-500 dark:text-red-400" />

            <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
              Education
            </h2>

            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Empty State
  |--------------------------------------------------------------------------
  */

  if (!education.length) {
    return (
      <section
        id="education"
        className="relative overflow-hidden py-20 sm:py-24"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <FaGraduationCap className="mx-auto text-4xl text-blue-600 dark:text-blue-400" />

            <h2 className="mt-5 text-2xl font-bold text-gray-900 dark:text-white">
              Education
            </h2>

            <p className="mt-3 text-gray-600 dark:text-gray-400">
              No education information is
              available right now.
            </p>
          </div>
        </div>
      </section>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Main Section
  |--------------------------------------------------------------------------
  */

  return (
    <section
      id="education"
      className="relative overflow-hidden py-20 sm:py-24"
    >
      {/* --------------------------------------------------------------- */}
      {/* Background Decoration */}
      {/* --------------------------------------------------------------- */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-blue-500/5 blur-[100px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-20 h-80 w-80 rounded-full bg-purple-500/5 blur-[100px]"
      />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">

        {/* --------------------------------------------------------------- */}
        {/* Section Heading */}
        {/* --------------------------------------------------------------- */}

        <div className="mx-auto mb-14 max-w-3xl text-center sm:mb-16">

          <span className="mb-3 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
            <FaGraduationCap />

            Education
          </span>

          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
            Academic Journey
          </h2>

          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400" />

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gray-600 dark:text-gray-400 sm:text-lg">
            My academic background and the
            knowledge that has helped shape my
            development journey.
          </p>

        </div>

        {/* --------------------------------------------------------------- */}
        {/* Education Timeline */}
        {/* --------------------------------------------------------------- */}

        <div className="relative mx-auto max-w-5xl">

          {/* Timeline */}

          <div className="absolute left-5 top-0 hidden h-full w-px bg-gray-200 dark:bg-gray-800 sm:left-1/2 sm:block sm:-translate-x-1/2" />

          <div className="space-y-10 sm:space-y-14">

            {education.map(
              (item, index) => {
                const isEven =
                  index % 2 === 0;

                return (
                  <article
                    key={
                      item?._id ||
                      `${item?.degree}-${item?.institution}-${index}`
                    }
                    className="relative"
                  >

                    {/* ===================================================
                        TIMELINE DOT
                    ==================================================== */}

                    <div className="absolute left-0 top-1 hidden sm:left-1/2 sm:block sm:-translate-x-1/2">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full border-4 border-white bg-blue-600 text-white shadow-lg dark:border-gray-950 dark:bg-blue-500">

                        {getEducationIcon(
                          item?.icon,
                          item?.degree
                        )}

                      </div>
                    </div>

                    {/* ===================================================
                        MOBILE CARD
                    ==================================================== */}

                    <div className="sm:hidden">

                      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">

                        {/* Icon */}

                        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">

                          {getEducationIcon(
                            item?.icon,
                            item?.degree
                          )}

                        </div>

                        {/* Degree */}

                        <h3 className="text-xl font-bold leading-snug text-gray-900 dark:text-white">
                          {item?.degree ||
                            'Degree'}
                        </h3>

                        {/* Institution */}

                        <p className="mt-2 text-base font-semibold text-blue-600 dark:text-blue-400">
                          {item?.institution ||
                            'Institution'}
                        </p>

                        {/* Meta */}

                        <div className="mt-4 flex flex-wrap gap-2">

                          {item?.duration && (
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                              {item.duration}
                            </span>
                          )}

                          {item?.status && (
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                              {item.status}
                            </span>
                          )}

                        </div>

                        {/* Description */}

                        {item?.description && (
                          <p className="mt-5 text-sm leading-7 text-gray-600 dark:text-gray-400">
                            {item.description}
                          </p>
                        )}

                        {/* Highlights */}

                        {Array.isArray(
                          item?.highlights
                        ) &&
                          item.highlights
                            .length > 0 && (
                            <div className="mt-6">

                              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-900 dark:text-white">
                                Highlights
                              </h4>

                              <ul className="space-y-3">

                                {item.highlights.map(
                                  (
                                    highlight,
                                    highlightIndex
                                  ) => (
                                    <li
                                      key={
                                        highlightIndex
                                      }
                                      className="flex gap-3 text-sm leading-6 text-gray-600 dark:text-gray-400"
                                    >
                                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600 dark:bg-blue-400" />

                                      <span>
                                        {
                                          highlight
                                        }
                                      </span>
                                    </li>
                                  )
                                )}

                              </ul>

                            </div>
                          )}

                      </div>

                    </div>

                    {/* ===================================================
                        DESKTOP CARD
                    ==================================================== */}

                    <div className="hidden sm:grid sm:grid-cols-2 sm:gap-16">

                      {/* Card */}

                      <div
                        className={
                          isEven
                            ? 'sm:col-start-1'
                            : 'sm:col-start-2'
                        }
                      >

                        <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900">

                          {/* Icon */}

                          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">

                            {getEducationIcon(
                              item?.icon,
                              item?.degree
                            )}

                          </div>

                          {/* Degree */}

                          <h3 className="text-xl font-bold leading-snug text-gray-900 dark:text-white">
                            {item?.degree ||
                              'Degree'}
                          </h3>

                          {/* Institution */}

                          <p className="mt-2 text-base font-semibold text-blue-600 dark:text-blue-400">
                            {item?.institution ||
                              'Institution'}
                          </p>

                          {/* Meta */}

                          <div className="mt-4 flex flex-wrap gap-2">

                            {item?.duration && (
                              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                {item.duration}
                              </span>
                            )}

                            {item?.status && (
                              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                                {item.status}
                              </span>
                            )}

                          </div>

                          {/* Description */}

                          {item?.description && (
                            <p className="mt-5 text-sm leading-7 text-gray-600 dark:text-gray-400">
                              {item.description}
                            </p>
                          )}

                          {/* Highlights */}

                          {Array.isArray(
                            item?.highlights
                          ) &&
                            item.highlights
                              .length > 0 && (
                              <div className="mt-6">

                                <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-900 dark:text-white">
                                  Highlights
                                </h4>

                                <ul className="space-y-3">

                                  {item.highlights.map(
                                    (
                                      highlight,
                                      highlightIndex
                                    ) => (
                                      <li
                                        key={
                                          highlightIndex
                                        }
                                        className="flex gap-3 text-sm leading-6 text-gray-600 dark:text-gray-400"
                                      >
                                        <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600 dark:bg-blue-400" />

                                        <span>
                                          {
                                            highlight
                                          }
                                        </span>
                                      </li>
                                    )
                                  )}

                                </ul>

                              </div>
                            )}

                        </div>

                      </div>

                      {/* Empty Opposite Column */}

                      <div
                        className={
                          isEven
                            ? 'sm:col-start-2'
                            : 'sm:col-start-1'
                        }
                      />

                    </div>

                  </article>
                );
              }
            )}

          </div>

        </div>

      </div>
    </section>
  );
};

export default Education;
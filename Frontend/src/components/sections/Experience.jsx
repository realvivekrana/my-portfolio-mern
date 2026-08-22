import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';

/*
|--------------------------------------------------------------------------
| Experience Section
|--------------------------------------------------------------------------
|
| Public portfolio ke Experience section ke liye.
|
| Data MongoDB se:
|
| GET /api/portfolio
|
| ke through aayega.
|
|--------------------------------------------------------------------------
*/

const Experience = () => {
  const [experiences, setExperiences] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  /*
  |--------------------------------------------------------------------------
  | Fetch Experience
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const fetchExperience =
      async () => {
        try {
          setLoading(true);
          setError('');

          const response =
            await axios.get(
              '/portfolio'
            );

          /*
          |--------------------------------------------------------------------------
          | API Response
          |--------------------------------------------------------------------------
          */

          const portfolio =
            response?.data?.data;

          const experience =
            portfolio?.experience;

          /*
          |--------------------------------------------------------------------------
          | Validate Array
          |--------------------------------------------------------------------------
          */

          if (
            Array.isArray(
              experience
            )
          ) {
            const visibleExperience =
              experience
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

            setExperiences(
              visibleExperience
            );
          } else {
            setExperiences([]);
          }
        } catch (err) {
          console.error(
            'Failed to fetch experience:',
            err
          );

          setError(
            'Unable to load experience.'
          );

          setExperiences([]);
        } finally {
          setLoading(false);
        }
      };

    fetchExperience();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Loading State
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <section
        id="experience"
        className="py-20"
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div
              className="h-10 w-10 animate-spin rounded-full border-4 border-current border-t-transparent"
              aria-label="Loading experience"
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
        id="experience"
        className="py-20"
      >
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/40 dark:bg-red-950/20">
            <p className="text-sm text-red-600 dark:text-red-400">
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

  if (!experiences.length) {
    return (
      <section
        id="experience"
        className="py-20"
      >
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Experience
            </h2>

            <p className="mt-3 text-gray-600 dark:text-gray-400">
              No experience information
              is available right now.
            </p>
          </div>
        </div>
      </section>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <section
      id="experience"
      className="relative overflow-hidden py-20 sm:py-24"
    >
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">

        {/* --------------------------------------------------------------- */}
        {/* Section Heading */}
        {/* --------------------------------------------------------------- */}

        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">
            Career
          </span>

          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
            Professional Experience
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600 dark:text-gray-400 sm:text-lg">
            My professional journey,
            responsibilities and the
            technologies I have worked with.
          </p>
        </div>

        {/* --------------------------------------------------------------- */}
        {/* Timeline */}
        {/* --------------------------------------------------------------- */}

        <div className="relative mx-auto max-w-5xl">

          {/* Timeline Line */}

          <div className="absolute left-5 top-0 hidden h-full w-px bg-gray-200 dark:bg-gray-800 sm:left-1/2 sm:block sm:-translate-x-1/2" />

          <div className="space-y-12">

            {experiences.map(
              (experience, index) => {
                const isEven =
                  index % 2 === 0;

                return (
                  <article
                    key={
                      experience._id ||
                      `${experience.company}-${experience.role}-${index}`
                    }
                    className="relative"
                  >

                    {/* --------------------------------------------------- */}
                    {/* Timeline Dot */}
                    {/* --------------------------------------------------- */}

                    <div className="absolute left-0 top-1 hidden sm:left-1/2 sm:block sm:-translate-x-1/2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-blue-600 shadow-lg dark:border-gray-950 dark:bg-blue-500">
                        <span className="h-2.5 w-2.5 rounded-full bg-white" />
                      </div>
                    </div>

                    {/* --------------------------------------------------- */}
                    {/* Mobile Layout */}
                    {/* --------------------------------------------------- */}

                    <div className="sm:hidden">
                      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">

                        {/* Role */}

                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {experience.role ||
                              'Role'}
                          </h3>

                          <p className="mt-1 text-base font-semibold text-blue-600 dark:text-blue-400">
                            {experience.company ||
                              'Company'}
                          </p>
                        </div>

                        {/* Duration */}

                        <div className="mt-4 flex flex-wrap gap-2">
                          {experience.duration && (
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                              {experience.duration}
                            </span>
                          )}

                          {experience.type && (
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                              {experience.type}
                            </span>
                          )}

                          {experience.location && (
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                              {experience.location}
                            </span>
                          )}
                        </div>

                        {/* Description */}

                        {experience.description && (
                          <p className="mt-5 text-sm leading-7 text-gray-600 dark:text-gray-400">
                            {
                              experience.description
                            }
                          </p>
                        )}

                        {/* Responsibilities */}

                        {Array.isArray(
                          experience.responsibilities
                        ) &&
                          experience
                            .responsibilities
                            .length >
                            0 && (
                            <div className="mt-6">
                              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-900 dark:text-white">
                                Responsibilities
                              </h4>

                              <ul className="space-y-3">
                                {experience.responsibilities.map(
                                  (
                                    responsibility,
                                    responsibilityIndex
                                  ) => (
                                    <li
                                      key={
                                        responsibilityIndex
                                      }
                                      className="flex gap-3 text-sm leading-6 text-gray-600 dark:text-gray-400"
                                    >
                                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600 dark:bg-blue-400" />

                                      <span>
                                        {typeof responsibility ===
                                        'string'
                                          ? responsibility
                                          : responsibility?.text ||
                                            ''}
                                      </span>
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}

                        {/* Technologies */}

                        {Array.isArray(
                          experience.technologies
                        ) &&
                          experience
                            .technologies
                            .length >
                            0 && (
                            <div className="mt-6">
                              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-900 dark:text-white">
                                Technologies
                              </h4>

                              <div className="flex flex-wrap gap-2">
                                {experience.technologies.map(
                                  (
                                    technology,
                                    technologyIndex
                                  ) => (
                                    <span
                                      key={
                                        technologyIndex
                                      }
                                      className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                                    >
                                      {
                                        technology
                                      }
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>

                    {/* --------------------------------------------------- */}
                    {/* Desktop Layout */}
                    {/* --------------------------------------------------- */}

                    <div className="hidden sm:grid sm:grid-cols-2 sm:gap-16">

                      {/* Left Side */}

                      <div
                        className={
                          isEven
                            ? 'sm:col-start-1'
                            : 'sm:col-start-2'
                        }
                      >
                        <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900">

                          {/* Header */}

                          <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                              {experience.role ||
                                'Role'}
                            </h3>

                            <p className="mt-1 text-base font-semibold text-blue-600 dark:text-blue-400">
                              {experience.company ||
                                'Company'}
                            </p>
                          </div>

                          {/* Meta */}

                          <div className="mt-4 flex flex-wrap gap-2">
                            {experience.duration && (
                              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                {experience.duration}
                              </span>
                            )}

                            {experience.type && (
                              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                                {experience.type}
                              </span>
                            )}

                            {experience.location && (
                              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                {experience.location}
                              </span>
                            )}
                          </div>

                          {/* Description */}

                          {experience.description && (
                            <p className="mt-5 text-sm leading-7 text-gray-600 dark:text-gray-400">
                              {
                                experience.description
                              }
                            </p>
                          )}

                          {/* Responsibilities */}

                          {Array.isArray(
                            experience.responsibilities
                          ) &&
                            experience
                              .responsibilities
                              .length >
                              0 && (
                              <div className="mt-6">
                                <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-900 dark:text-white">
                                  Responsibilities
                                </h4>

                                <ul className="space-y-3">
                                  {experience.responsibilities.map(
                                    (
                                      responsibility,
                                      responsibilityIndex
                                    ) => (
                                      <li
                                        key={
                                          responsibilityIndex
                                        }
                                        className="flex gap-3 text-sm leading-6 text-gray-600 dark:text-gray-400"
                                      >
                                        <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600 dark:bg-blue-400" />

                                        <span>
                                          {typeof responsibility ===
                                          'string'
                                            ? responsibility
                                            : responsibility?.text ||
                                              ''}
                                        </span>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}

                          {/* Technologies */}

                          {Array.isArray(
                            experience.technologies
                          ) &&
                            experience
                              .technologies
                              .length >
                              0 && (
                              <div className="mt-6">
                                <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-900 dark:text-white">
                                  Technologies
                                </h4>

                                <div className="flex flex-wrap gap-2">
                                  {experience.technologies.map(
                                    (
                                      technology,
                                      technologyIndex
                                    ) => (
                                      <span
                                        key={
                                          technologyIndex
                                        }
                                        className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                                      >
                                        {
                                          technology
                                        }
                                      </span>
                                    )
                                  )}
                                </div>
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

export default Experience;
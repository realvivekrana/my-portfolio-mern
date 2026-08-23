import { useEffect, useState } from 'react';

import {
  FaPlus,
  FaSave,
  FaTrash,
  FaCode,
  FaServer,
  FaDatabase,
  FaTools,
} from 'react-icons/fa';

import API from '../../utils/axios';

/*
|--------------------------------------------------------------------------
| Default Skill Categories
|--------------------------------------------------------------------------
*/

const defaultSkills = [
  {
    title: 'Frontend',
    description:
      'Building responsive, interactive and user-friendly interfaces.',
    icon: 'code',
    displayOrder: 0,
    isVisible: true,

    skills: [
      {
        name: 'HTML',
        icon: 'html',
        level: 'Advanced',
        progress: 90,
        displayOrder: 0,
      },
      {
        name: 'CSS',
        icon: 'css',
        level: 'Advanced',
        progress: 88,
        displayOrder: 1,
      },
      {
        name: 'JavaScript',
        icon: 'javascript',
        level: 'Advanced',
        progress: 85,
        displayOrder: 2,
      },
      {
        name: 'React',
        icon: 'react',
        level: 'Advanced',
        progress: 85,
        displayOrder: 3,
      },
      {
        name: 'Tailwind CSS',
        icon: 'tailwind',
        level: 'Intermediate',
        progress: 78,
        displayOrder: 4,
      },
      {
        name: 'Bootstrap',
        icon: 'bootstrap',
        level: 'Intermediate',
        progress: 75,
        displayOrder: 5,
      },
    ],
  },

  {
    title: 'Backend',
    description:
      'Developing server-side applications and RESTful APIs.',
    icon: 'server',
    displayOrder: 1,
    isVisible: true,

    skills: [
      {
        name: 'Node.js',
        icon: 'node',
        level: 'Intermediate',
        progress: 75,
        displayOrder: 0,
      },
      {
        name: 'Express.js',
        icon: 'express',
        level: 'Intermediate',
        progress: 75,
        displayOrder: 1,
      },
      {
        name: 'REST APIs',
        icon: 'server',
        level: 'Intermediate',
        progress: 72,
        displayOrder: 2,
      },
    ],
  },

  {
    title: 'Database',
    description:
      'Managing application data and database-driven solutions.',
    icon: 'database',
    displayOrder: 2,
    isVisible: true,

    skills: [
      {
        name: 'MongoDB',
        icon: 'mongodb',
        level: 'Intermediate',
        progress: 78,
        displayOrder: 0,
      },
      {
        name: 'MySQL',
        icon: 'mysql',
        level: 'Intermediate',
        progress: 68,
        displayOrder: 1,
      },
    ],
  },

  {
    title: 'Tools',
    description:
      'Development tools and workflows used in everyday projects.',
    icon: 'tools',
    displayOrder: 3,
    isVisible: true,

    skills: [
      {
        name: 'Git',
        icon: 'git',
        level: 'Intermediate',
        progress: 80,
        displayOrder: 0,
      },
      {
        name: 'GitHub',
        icon: 'github',
        level: 'Intermediate',
        progress: 82,
        displayOrder: 1,
      },
      {
        name: 'Postman',
        icon: 'postman',
        level: 'Intermediate',
        progress: 75,
        displayOrder: 2,
      },
      {
        name: 'VS Code',
        icon: 'code',
        level: 'Advanced',
        progress: 90,
        displayOrder: 3,
      },
    ],
  },
];

/*
|--------------------------------------------------------------------------
| Empty Skill
|--------------------------------------------------------------------------
*/

const createEmptySkill = () => ({
  name: '',
  icon: 'code',
  level: 'Intermediate',
  progress: 70,
  displayOrder: 0,
});

/*
|--------------------------------------------------------------------------
| Empty Category
|--------------------------------------------------------------------------
*/

const createEmptyCategory = () => ({
  title: '',
  description: '',
  icon: 'code',
  skills: [],
  displayOrder: 0,
  isVisible: true,
});

/*
|--------------------------------------------------------------------------
| Category Icon
|--------------------------------------------------------------------------
*/

const CategoryIcon = ({ icon }) => {
  if (icon === 'server') {
    return <FaServer />;
  }

  if (icon === 'database') {
    return <FaDatabase />;
  }

  if (icon === 'tools') {
    return <FaTools />;
  }

  return <FaCode />;
};

/*
|--------------------------------------------------------------------------
| Skills Manager
|--------------------------------------------------------------------------
*/

function SkillsManager() {
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState('');

  const [error, setError] = useState('');

  /*
  |--------------------------------------------------------------------------
  | Load Skills
  |--------------------------------------------------------------------------
  */

  const loadSkills = async () => {
    try {
      setLoading(true);

      setError('');

      setMessage('');

      const response = await API.get('/portfolio');

      const portfolio =
        response?.data?.data ||
        response?.data ||
        {};

      if (
        Array.isArray(portfolio.skills) &&
        portfolio.skills.length > 0
      ) {
        setCategories(
          portfolio.skills
        );
      } else {
        setCategories(
          defaultSkills
        );
      }
    } catch (err) {
      console.error(
        'Skills Load Error:',
        err
      );

      /*
      |--------------------------------------------------------------------------
      | If API fails, show default skills
      |--------------------------------------------------------------------------
      */

      setCategories(
        defaultSkills
      );

      setError(
        err?.response?.data?.message ||
          'Failed to load skills.'
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Initial Load
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadSkills();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Clear Messages
  |--------------------------------------------------------------------------
  */

  const clearMessages = () => {
    setMessage('');
    setError('');
  };

  /*
  |--------------------------------------------------------------------------
  | Category Field Change
  |--------------------------------------------------------------------------
  */

  const handleCategoryChange = (
    categoryIndex,
    field,
    value
  ) => {
    clearMessages();

    setCategories(
      (previous) =>
        previous.map(
          (
            category,
            index
          ) => {
            if (
              index !==
              categoryIndex
            ) {
              return category;
            }

            return {
              ...category,
              [field]: value,
            };
          }
        )
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Add Category
  |--------------------------------------------------------------------------
  */

  const handleAddCategory = () => {
    clearMessages();

    setCategories(
      (previous) => [
        ...previous,

        {
          ...createEmptyCategory(),

          displayOrder:
            previous.length,
        },
      ]
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Delete Category
  |--------------------------------------------------------------------------
  */

  const handleDeleteCategory = (
    categoryIndex
  ) => {
    const confirmed =
      window.confirm(
        'Are you sure you want to delete this skill category?'
      );

    if (!confirmed) {
      return;
    }

    clearMessages();

    setCategories(
      (previous) =>
        previous
          .filter(
            (_, index) =>
              index !==
              categoryIndex
          )
          .map(
            (
              category,
              index
            ) => ({
              ...category,

              displayOrder:
                index,
            })
          )
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Add Skill
  |--------------------------------------------------------------------------
  */

  const handleAddSkill = (
    categoryIndex
  ) => {
    clearMessages();

    setCategories(
      (previous) =>
        previous.map(
          (
            category,
            index
          ) => {
            if (
              index !==
              categoryIndex
            ) {
              return category;
            }

            const currentSkills =
              Array.isArray(
                category.skills
              )
                ? category.skills
                : [];

            return {
              ...category,

              skills: [
                ...currentSkills,

                {
                  ...createEmptySkill(),

                  displayOrder:
                    currentSkills.length,
                },
              ],
            };
          }
        )
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Skill Field Change
  |--------------------------------------------------------------------------
  */

  const handleSkillChange = (
    categoryIndex,
    skillIndex,
    field,
    value
  ) => {
    clearMessages();

    setCategories(
      (previous) =>
        previous.map(
          (
            category,
            currentCategoryIndex
          ) => {
            if (
              currentCategoryIndex !==
              categoryIndex
            ) {
              return category;
            }

            const skills =
              Array.isArray(
                category.skills
              )
                ? category.skills
                : [];

            const updatedSkills =
              skills.map(
                (
                  skill,
                  currentSkillIndex
                ) => {
                  if (
                    currentSkillIndex !==
                    skillIndex
                  ) {
                    return skill;
                  }

                  let updatedValue =
                    value;

                  if (
                    field ===
                    'progress'
                  ) {
                    updatedValue =
                      Math.min(
                        100,
                        Math.max(
                          0,
                          Number(
                            value
                          ) || 0
                        )
                      );
                  }

                  return {
                    ...skill,

                    [field]:
                      updatedValue,
                  };
                }
              );

            return {
              ...category,

              skills:
                updatedSkills,
            };
          }
        )
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Delete Skill
  |--------------------------------------------------------------------------
  */

  const handleDeleteSkill = (
    categoryIndex,
    skillIndex
  ) => {
    const confirmed =
      window.confirm(
        'Are you sure you want to delete this skill?'
      );

    if (!confirmed) {
      return;
    }

    clearMessages();

    setCategories(
      (previous) =>
        previous.map(
          (
            category,
            currentCategoryIndex
          ) => {
            if (
              currentCategoryIndex !==
              categoryIndex
            ) {
              return category;
            }

            const skills =
              Array.isArray(
                category.skills
              )
                ? category.skills
                : [];

            const updatedSkills =
              skills
                .filter(
                  (
                    _,
                    currentSkillIndex
                  ) =>
                    currentSkillIndex !==
                    skillIndex
                )
                .map(
                  (
                    skill,
                    index
                  ) => ({
                    ...skill,

                    displayOrder:
                      index,
                  })
                );

            return {
              ...category,

              skills:
                updatedSkills,
            };
          }
        )
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Save Skills
  |--------------------------------------------------------------------------
  */

  const handleSave = async () => {
    try {
      setSaving(true);

      setError('');

      setMessage('');

      /*
      |--------------------------------------------------------------------------
      | Prepare Clean Payload
      |--------------------------------------------------------------------------
      */

      const skillsPayload =
        categories.map(
          (
            category,
            categoryIndex
          ) => ({
            title:
              String(
                category.title ||
                  ''
              ).trim(),

            description:
              String(
                category.description ||
                  ''
              ).trim(),

            icon:
              category.icon ||
              'code',

            displayOrder:
              categoryIndex,

            isVisible:
              category.isVisible !==
              false,

            skills: (
              Array.isArray(
                category.skills
              )
                ? category.skills
                : []
            ).map(
              (
                skill,
                skillIndex
              ) => ({
                name:
                  String(
                    skill.name ||
                      ''
                  ).trim(),

                icon:
                  skill.icon ||
                  'code',

                level:
                  skill.level ||
                  'Intermediate',

                progress:
                  Math.min(
                    100,
                    Math.max(
                      0,
                      Number(
                        skill.progress
                      ) || 0
                    )
                  ),

                displayOrder:
                  skillIndex,
              })
            ),
          })
        );

      /*
      |--------------------------------------------------------------------------
      | API Request
      |--------------------------------------------------------------------------
      */

      const response =
        await API.put(
          '/portfolio',
          {
            skills:
              skillsPayload,
          }
        );

      /*
      |--------------------------------------------------------------------------
      | Update Local State With Server Response
      |--------------------------------------------------------------------------
      */

      const updatedPortfolio =
        response?.data?.data;

      if (
        Array.isArray(
          updatedPortfolio?.skills
        )
      ) {
        setCategories(
          updatedPortfolio.skills
        );
      } else {
        setCategories(
          skillsPayload
        );
      }

      setMessage(
        'Skills updated successfully.'
      );
    } catch (err) {
      console.error(
        'Skills Save Error:',
        err
      );

      setError(
        err?.response?.data?.message ||
          'Failed to save skills.'
      );
    } finally {
      setSaving(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Loading State
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-center gap-3">

          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900 dark:border-gray-700 dark:border-t-white" />

          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Loading skills...
          </span>

        </div>
      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-900 dark:bg-white/10 dark:text-white">
                <FaCode />
              </div>

              <div>

                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Skills Management
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Manage the skills displayed on your portfolio.
                </p>

              </div>

            </div>

          </div>

          <div className="flex flex-wrap gap-2">

            <button
              type="button"
              onClick={
                handleAddCategory
              }
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
            >
              <FaPlus />

              Add Category
            </button>

            <button
              type="button"
              onClick={
                handleSave
              }
              disabled={
                saving
              }
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
            >
              <FaSave />

              {saving
                ? 'Saving...'
                : 'Save Changes'}
            </button>

          </div>

        </div>

        {/* =================================================
            SUCCESS MESSAGE
        ================================================== */}

        {message && (
          <div className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-300">
            {message}
          </div>
        )}

        {/* =================================================
            ERROR MESSAGE
        ================================================== */}

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
            {error}
          </div>
        )}

      </div>

      {/* =====================================================
          CATEGORIES
      ====================================================== */}

      {categories.map(
        (
          category,
          categoryIndex
        ) => (
          <div
            key={`category-${categoryIndex}`}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6"
          >

            {/* =================================================
                CATEGORY TOP
            ================================================== */}

            <div className="flex flex-col gap-4 border-b border-gray-100 pb-5 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-800 dark:bg-white/10 dark:text-white">
                  <CategoryIcon
                    icon={
                      category.icon
                    }
                  />
                </div>

                <div>

                  <h3 className="font-bold text-gray-900 dark:text-white">
                    {category.title ||
                      'New Category'}
                  </h3>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(
                      category.skills ||
                      []
                    ).length}{' '}
                    skills
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  handleDeleteCategory(
                    categoryIndex
                  )
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
              >
                <FaTrash />

                Delete Category
              </button>

            </div>

            {/* =================================================
                CATEGORY DETAILS
            ================================================== */}

            <div className="mt-5 grid gap-4 lg:grid-cols-3">

              <div>

                <label className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Category Name
                </label>

                <input
                  type="text"
                  value={
                    category.title ||
                    ''
                  }
                  onChange={(
                    event
                  ) =>
                    handleCategoryChange(
                      categoryIndex,
                      'title',
                      event.target
                        .value
                    )
                  }
                  placeholder="Frontend"
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-500 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                />

              </div>

              <div>

                <label className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Category Icon
                </label>

                <select
                  value={
                    category.icon ||
                    'code'
                  }
                  onChange={(
                    event
                  ) =>
                    handleCategoryChange(
                      categoryIndex,
                      'icon',
                      event.target
                        .value
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-500 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                >

                  <option value="code">
                    Code
                  </option>

                  <option value="server">
                    Server
                  </option>

                  <option value="database">
                    Database
                  </option>

                  <option value="tools">
                    Tools
                  </option>

                </select>

              </div>

              <div>

                <label className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Visibility
                </label>

                <select
                  value={
                    category.isVisible ===
                    false
                      ? 'false'
                      : 'true'
                  }
                  onChange={(
                    event
                  ) =>
                    handleCategoryChange(
                      categoryIndex,
                      'isVisible',
                      event.target
                        .value ===
                        'true'
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-500 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
                >

                  <option value="true">
                    Visible
                  </option>

                  <option value="false">
                    Hidden
                  </option>

                </select>

              </div>

            </div>

            {/* =================================================
                DESCRIPTION
            ================================================== */}

            <div className="mt-4">

              <label className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Description
              </label>

              <textarea
                rows="3"
                value={
                  category.description ||
                  ''
                }
                onChange={(
                  event
                ) =>
                  handleCategoryChange(
                    categoryIndex,
                    'description',
                    event.target
                      .value
                  )
                }
                placeholder="Describe this category..."
                className="mt-2 w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-500 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
              />

            </div>

            {/* =================================================
                SKILLS HEADER
            ================================================== */}

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h4 className="font-bold text-gray-900 dark:text-white">
                  Skills
                </h4>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Add and manage individual technologies.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  handleAddSkill(
                    categoryIndex
                  )
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
              >
                <FaPlus />

                Add Skill
              </button>

            </div>

            {/* =================================================
                SKILL LIST
            ================================================== */}

            <div className="mt-4 space-y-4">

              {(
                category.skills ||
                []
              ).map(
                (
                  skill,
                  skillIndex
                ) => (
                  <div
                    key={`skill-${categoryIndex}-${skillIndex}`}
                    className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950"
                  >

                    <div className="grid gap-4 lg:grid-cols-5">

                      {/* Skill Name */}

                      <div className="lg:col-span-2">

                        <label className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Skill Name
                        </label>

                        <input
                          type="text"
                          value={
                            skill.name ||
                            ''
                          }
                          onChange={(
                            event
                          ) =>
                            handleSkillChange(
                              categoryIndex,
                              skillIndex,
                              'name',
                              event
                                .target
                                .value
                            )
                          }
                          placeholder="React"
                          className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                        />

                      </div>

                      {/* Icon */}

                      <div>

                        <label className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Icon
                        </label>

                        <select
                          value={
                            skill.icon ||
                            'code'
                          }
                          onChange={(
                            event
                          ) =>
                            handleSkillChange(
                              categoryIndex,
                              skillIndex,
                              'icon',
                              event
                                .target
                                .value
                            )
                          }
                          className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                        >

                          <option value="html">
                            HTML
                          </option>

                          <option value="css">
                            CSS
                          </option>

                          <option value="javascript">
                            JavaScript
                          </option>

                          <option value="react">
                            React
                          </option>

                          <option value="tailwind">
                            Tailwind
                          </option>

                          <option value="bootstrap">
                            Bootstrap
                          </option>

                          <option value="node">
                            Node.js
                          </option>

                          <option value="express">
                            Express.js
                          </option>

                          <option value="mongodb">
                            MongoDB
                          </option>

                          <option value="mysql">
                            MySQL
                          </option>

                          <option value="git">
                            Git
                          </option>

                          <option value="github">
                            GitHub
                          </option>

                          <option value="postman">
                            Postman
                          </option>

                          <option value="server">
                            Server
                          </option>

                          <option value="code">
                            Code
                          </option>

                        </select>

                      </div>

                      {/* Level */}

                      <div>

                        <label className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Level
                        </label>

                        <select
                          value={
                            skill.level ||
                            'Intermediate'
                          }
                          onChange={(
                            event
                          ) =>
                            handleSkillChange(
                              categoryIndex,
                              skillIndex,
                              'level',
                              event
                                .target
                                .value
                            )
                          }
                          className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                        >

                          <option value="Beginner">
                            Beginner
                          </option>

                          <option value="Intermediate">
                            Intermediate
                          </option>

                          <option value="Advanced">
                            Advanced
                          </option>

                          <option value="Expert">
                            Expert
                          </option>

                        </select>

                      </div>

                      {/* Progress */}

                      <div>

                        <label className="text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Progress %
                        </label>

                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={
                            skill.progress ??
                            0
                          }
                          onChange={(
                            event
                          ) =>
                            handleSkillChange(
                              categoryIndex,
                              skillIndex,
                              'progress',
                              event
                                .target
                                .value
                            )
                          }
                          className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
                        />

                      </div>

                    </div>

                    {/* Progress Bar */}

                    <div className="mt-4 flex items-center gap-3">

                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">

                        <div
                          className="h-full rounded-full bg-gray-900 transition-all duration-300 dark:bg-white"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(
                                0,
                                Number(
                                  skill.progress
                                ) ||
                                  0
                              )
                            )}%`,
                          }}
                        />

                      </div>

                      <span className="w-12 text-right text-xs font-bold text-gray-600 dark:text-gray-400">
                        {Math.min(
                          100,
                          Math.max(
                            0,
                            Number(
                              skill.progress
                            ) ||
                              0
                          )
                        )}
                        %
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteSkill(
                            categoryIndex,
                            skillIndex
                          )
                        }
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                        title="Delete Skill"
                      >
                        <FaTrash className="text-xs" />
                      </button>

                    </div>

                  </div>
                )
              )}

            </div>

          </div>
        )
      )}

      {/* =====================================================
          EMPTY STATE
      ====================================================== */}

      {categories.length ===
        0 && (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center dark:border-gray-700 dark:bg-gray-900">

          <FaCode className="mx-auto text-3xl text-gray-400" />

          <h3 className="mt-3 font-bold text-gray-900 dark:text-white">
            No Skill Categories
          </h3>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Add a category to start managing your skills.
          </p>

          <button
            type="button"
            onClick={
              handleAddCategory
            }
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white dark:bg-white dark:text-gray-900"
          >
            <FaPlus />

            Add Category
          </button>

        </div>
      )}

    </div>
  );
}

export default SkillsManager;
import { useEffect, useState } from 'react';

import {
  FaBriefcase,
  FaGraduationCap,
  FaPlus,
  FaTrash,
  FaSave,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';

import { toast } from 'react-toastify';

import API from '../../utils/axios';

/*
|--------------------------------------------------------------------------
| Empty Experience
|--------------------------------------------------------------------------
*/

const emptyExperience = {
  role: '',
  company: '',
  duration: '',
  type: 'Full-time',
  location: '',
  description: '',
  responsibilities: '',
  technologies: '',
  displayOrder: 0,
  isVisible: true,
};

/*
|--------------------------------------------------------------------------
| Empty Education
|--------------------------------------------------------------------------
*/

const emptyEducation = {
  degree: '',
  institution: '',
  duration: '',
  status: '',
  description: '',
  highlights: '',
  icon: 'book',
  displayOrder: 0,
  isVisible: true,
};

/*
|--------------------------------------------------------------------------
| Experience & Education Manager
|--------------------------------------------------------------------------
*/

function ExperienceEducationManager() {
  const [experience, setExperience] =
    useState([]);

  const [education, setEducation] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | Load Portfolio Data
  |--------------------------------------------------------------------------
  */

  const loadData = async () => {
    try {
      setLoading(true);

      const response =
        await API.get('/portfolio');

      const portfolio =
        response?.data?.data || {};

      /*
      |--------------------------------------------------------------------------
      | Experience
      |--------------------------------------------------------------------------
      */

      const experienceData =
        Array.isArray(
          portfolio.experience
        )
          ? portfolio.experience
          : [];

      setExperience(
        experienceData.map(
          (item) => ({
            ...item,

            responsibilities:
              Array.isArray(
                item.responsibilities
              )
                ? item.responsibilities
                    .map(
                      (responsibility) =>
                        typeof responsibility ===
                        'string'
                          ? responsibility
                          : responsibility?.text ||
                            ''
                    )
                    .join('\n')
                : '',

            technologies:
              Array.isArray(
                item.technologies
              )
                ? item.technologies.join(
                    ', '
                  )
                : '',
          })
        )
      );

      /*
      |--------------------------------------------------------------------------
      | Education
      |--------------------------------------------------------------------------
      */

      const educationData =
        Array.isArray(
          portfolio.education
        )
          ? portfolio.education
          : [];

      setEducation(
        educationData.map(
          (item) => ({
            ...item,

            highlights:
              Array.isArray(
                item.highlights
              )
                ? item.highlights.join(
                    ', '
                  )
                : '',
          })
        )
      );
    } catch (error) {
      console.error(
        'Experience/Education load error:',
        error
      );

      toast.error(
        error.response?.data?.message ||
          'Failed to load experience and education.'
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
    loadData();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Update Experience Field
  |--------------------------------------------------------------------------
  */

  const updateExperience = (
    index,
    field,
    value
  ) => {
    setExperience(
      (items) =>
        items.map(
          (item, itemIndex) =>
            itemIndex === index
              ? {
                  ...item,
                  [field]: value,
                }
              : item
        )
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Update Education Field
  |--------------------------------------------------------------------------
  */

  const updateEducation = (
    index,
    field,
    value
  ) => {
    setEducation(
      (items) =>
        items.map(
          (item, itemIndex) =>
            itemIndex === index
              ? {
                  ...item,
                  [field]: value,
                }
              : item
        )
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Add Experience
  |--------------------------------------------------------------------------
  */

  const addExperience = () => {
    setExperience(
      (items) => [
        ...items,
        {
          ...emptyExperience,
          displayOrder:
            items.length,
        },
      ]
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Add Education
  |--------------------------------------------------------------------------
  */

  const addEducation = () => {
    setEducation(
      (items) => [
        ...items,
        {
          ...emptyEducation,
          displayOrder:
            items.length,
        },
      ]
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Remove Experience
  |--------------------------------------------------------------------------
  */

  const removeExperience = (
    index
  ) => {
    const confirmed =
      window.confirm(
        'Are you sure you want to remove this experience?'
      );

    if (!confirmed) {
      return;
    }

    setExperience(
      (items) =>
        items.filter(
          (_, itemIndex) =>
            itemIndex !== index
        )
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Remove Education
  |--------------------------------------------------------------------------
  */

  const removeEducation = (
    index
  ) => {
    const confirmed =
      window.confirm(
        'Are you sure you want to remove this education entry?'
      );

    if (!confirmed) {
      return;
    }

    setEducation(
      (items) =>
        items.filter(
          (_, itemIndex) =>
            itemIndex !== index
        )
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Save All
  |--------------------------------------------------------------------------
  */

  const saveAll = async () => {
    try {
      setSaving(true);

      /*
      |--------------------------------------------------------------------------
      | Experience Payload
      |--------------------------------------------------------------------------
      */

      const experiencePayload =
        experience.map(
          (item, index) => ({
            role:
              item.role?.trim() || '',

            company:
              item.company?.trim() ||
              '',

            duration:
              item.duration?.trim() ||
              '',

            type:
              item.type?.trim() ||
              'Full-time',

            location:
              item.location?.trim() ||
              '',

            description:
              item.description?.trim() ||
              '',

            responsibilities:
              String(
                item.responsibilities ||
                  ''
              )
                .split('\n')
                .map(
                  (text) =>
                    text.trim()
                )
                .filter(Boolean)
                .map(
                  (text) => ({
                    icon: 'code',
                    text,
                  })
                ),

            technologies:
              String(
                item.technologies ||
                  ''
              )
                .split(',')
                .map(
                  (text) =>
                    text.trim()
                )
                .filter(Boolean),

            displayOrder:
              Number(
                item.displayOrder
              ) || index,

            isVisible:
              item.isVisible !==
              false,
          })
        );

      /*
      |--------------------------------------------------------------------------
      | Education Payload
      |--------------------------------------------------------------------------
      */

      const educationPayload =
        education.map(
          (item, index) => ({
            degree:
              item.degree?.trim() ||
              '',

            institution:
              item.institution?.trim() ||
              '',

            duration:
              item.duration?.trim() ||
              '',

            status:
              item.status?.trim() ||
              '',

            description:
              item.description?.trim() ||
              '',

            highlights:
              String(
                item.highlights ||
                  ''
              )
                .split(',')
                .map(
                  (text) =>
                    text.trim()
                )
                .filter(Boolean),

            icon:
              item.icon?.trim() ||
              'book',

            displayOrder:
              Number(
                item.displayOrder
              ) || index,

            isVisible:
              item.isVisible !==
              false,
          })
        );

      /*
      |--------------------------------------------------------------------------
      | Validation
      |--------------------------------------------------------------------------
      */

      const invalidExperience =
        experiencePayload.find(
          (item) =>
            !item.role ||
            !item.company
        );

      if (invalidExperience) {
        toast.error(
          'Experience role and company are required.'
        );

        return;
      }

      const invalidEducation =
        educationPayload.find(
          (item) =>
            !item.degree ||
            !item.institution
        );

      if (invalidEducation) {
        toast.error(
          'Education degree and institution are required.'
        );

        return;
      }

      /*
      |--------------------------------------------------------------------------
      | Save To Backend
      |--------------------------------------------------------------------------
      */

      await API.put(
        '/portfolio',
        {
          experience:
            experiencePayload,

          education:
            educationPayload,
        }
      );

      /*
      |--------------------------------------------------------------------------
      | Success
      |--------------------------------------------------------------------------
      */

      toast.success(
        'Experience and education saved successfully.'
      );

      /*
      |--------------------------------------------------------------------------
      | Reload Latest Database Data
      |--------------------------------------------------------------------------
      */

      await loadData();
    } catch (error) {
      console.error(
        'Experience/Education save error:',
        error
      );

      toast.error(
        error.response?.data?.message ||
          'Failed to save changes.'
      );
    } finally {
      setSaving(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Common Classes
  |--------------------------------------------------------------------------
  */

  const inputClass =
    'w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-gray-800 dark:bg-gray-950 dark:text-white';

  const textareaClass =
    `${inputClass} min-h-28 resize-y`;

  const labelClass =
    'mb-1.5 block text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400';

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <section className="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />

        <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">
          Loading experience and
          education...
        </p>
      </section>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Main UI
  |--------------------------------------------------------------------------
  */

  return (
    <section className="space-y-8">

      {/* ================================================================
          HEADER
      ================================================================ */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
            Portfolio Content
          </p>

          <h2 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            Experience & Education
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400">
            Manage the professional experience
            and education information displayed
            on your public portfolio.
          </p>
        </div>

        <button
          type="button"
          onClick={saveAll}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FaSave />

          {saving
            ? 'Saving...'
            : 'Save All Changes'}
        </button>

      </div>

      {/* ================================================================
          EXPERIENCE
      ================================================================ */}

      <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-7">

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
              <FaBriefcase className="text-indigo-500" />

              Experience
            </h3>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Add your professional work
              experience and responsibilities.
            </p>
          </div>

          <button
            type="button"
            onClick={addExperience}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-200 px-4 py-2.5 text-sm font-bold text-indigo-600 transition hover:bg-indigo-50 dark:border-indigo-500/20 dark:text-indigo-400 dark:hover:bg-indigo-500/10"
          >
            <FaPlus />

            Add Experience
          </button>

        </div>

        {/* ==============================================================
            EXPERIENCE LIST
        ============================================================== */}

        <div className="space-y-6">

          {experience.map(
            (item, index) => (
              <div
                key={
                  item._id ||
                  `experience-${index}`
                }
                className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800 sm:p-6"
              >

                {/* ------------------------------------------------------
                    CARD HEADER
                ------------------------------------------------------- */}

                <div className="mb-5 flex items-center justify-between gap-3">

                  <div>
                    <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                      Experience #
                      {index + 1}
                    </span>

                    {item.company && (
                      <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                        {item.company}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      removeExperience(
                        index
                      )
                    }
                    className="rounded-lg p-2.5 text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10"
                    title="Remove experience"
                  >
                    <FaTrash />
                  </button>

                </div>

                {/* ------------------------------------------------------
                    BASIC FIELDS
                ------------------------------------------------------- */}

                <div className="grid gap-4 md:grid-cols-2">

                  {/* Role */}

                  <label>
                    <span
                      className={
                        labelClass
                      }
                    >
                      Role
                    </span>

                    <input
                      className={
                        inputClass
                      }
                      type="text"
                      placeholder="Frontend Developer Intern"
                      value={
                        item.role ??
                        ''
                      }
                      onChange={(event) =>
                        updateExperience(
                          index,
                          'role',
                          event.target
                            .value
                        )
                      }
                    />
                  </label>

                  {/* Company */}

                  <label>
                    <span
                      className={
                        labelClass
                      }
                    >
                      Company
                    </span>

                    <input
                      className={
                        inputClass
                      }
                      type="text"
                      placeholder="Company name"
                      value={
                        item.company ??
                        ''
                      }
                      onChange={(event) =>
                        updateExperience(
                          index,
                          'company',
                          event.target
                            .value
                        )
                      }
                    />
                  </label>

                  {/* Duration */}

                  <label>
                    <span
                      className={
                        labelClass
                      }
                    >
                      Duration
                    </span>

                    <input
                      className={
                        inputClass
                      }
                      type="text"
                      placeholder="Feb 2026 – May 2026"
                      value={
                        item.duration ??
                        ''
                      }
                      onChange={(event) =>
                        updateExperience(
                          index,
                          'duration',
                          event.target
                            .value
                        )
                      }
                    />
                  </label>

                  {/* Type */}

                  <label>
                    <span
                      className={
                        labelClass
                      }
                    >
                      Employment Type
                    </span>

                    <select
                      className={
                        inputClass
                      }
                      value={
                        item.type ||
                        'Full-time'
                      }
                      onChange={(event) =>
                        updateExperience(
                          index,
                          'type',
                          event.target
                            .value
                        )
                      }
                    >
                      <option value="Full-time">
                        Full-time
                      </option>

                      <option value="Part-time">
                        Part-time
                      </option>

                      <option value="Internship">
                        Internship
                      </option>

                      <option value="Freelance">
                        Freelance
                      </option>

                      <option value="Contract">
                        Contract
                      </option>

                      <option value="Remote">
                        Remote
                      </option>
                    </select>
                  </label>

                  {/* Location */}

                  <label>
                    <span
                      className={
                        labelClass
                      }
                    >
                      Location
                    </span>

                    <input
                      className={
                        inputClass
                      }
                      type="text"
                      placeholder="Pune, India / Remote"
                      value={
                        item.location ??
                        ''
                      }
                      onChange={(event) =>
                        updateExperience(
                          index,
                          'location',
                          event.target
                            .value
                        )
                      }
                    />
                  </label>

                  {/* Display Order */}

                  <label>
                    <span
                      className={
                        labelClass
                      }
                    >
                      Display Order
                    </span>

                    <input
                      className={
                        inputClass
                      }
                      type="number"
                      min="0"
                      value={
                        item.displayOrder ??
                        0
                      }
                      onChange={(event) =>
                        updateExperience(
                          index,
                          'displayOrder',
                          event.target
                            .value
                        )
                      }
                    />
                  </label>

                  {/* Description */}

                  <label className="md:col-span-2">
                    <span
                      className={
                        labelClass
                      }
                    >
                      Description
                    </span>

                    <textarea
                      className={
                        textareaClass
                      }
                      placeholder="Describe your role and work..."
                      value={
                        item.description ||
                        ''
                      }
                      onChange={(event) =>
                        updateExperience(
                          index,
                          'description',
                          event.target
                            .value
                        )
                      }
                    />
                  </label>

                  {/* Responsibilities */}

                  <label className="md:col-span-2">
                    <span
                      className={
                        labelClass
                      }
                    >
                      Responsibilities
                    </span>

                    <textarea
                      className={
                        textareaClass
                      }
                      placeholder={`Developed React applications
Built reusable components
Worked with REST APIs`}
                      value={
                        item.responsibilities ||
                        ''
                      }
                      onChange={(event) =>
                        updateExperience(
                          index,
                          'responsibilities',
                          event.target
                            .value
                        )
                      }
                    />

                    <span className="mt-1.5 block text-xs text-gray-400">
                      Write one responsibility
                      per line.
                    </span>
                  </label>

                  {/* Technologies */}

                  <label className="md:col-span-2">
                    <span
                      className={
                        labelClass
                      }
                    >
                      Technologies
                    </span>

                    <input
                      className={
                        inputClass
                      }
                      type="text"
                      placeholder="React.js, Node.js, MongoDB, Git"
                      value={
                        item.technologies ||
                        ''
                      }
                      onChange={(event) =>
                        updateExperience(
                          index,
                          'technologies',
                          event.target
                            .value
                        )
                      }
                    />

                    <span className="mt-1.5 block text-xs text-gray-400">
                      Separate technologies
                      with commas.
                    </span>
                  </label>

                  {/* Visibility */}

                  <label className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">

                    <input
                      type="checkbox"
                      checked={
                        item.isVisible !==
                        false
                      }
                      onChange={(event) =>
                        updateExperience(
                          index,
                          'isVisible',
                          event.target
                            .checked
                        )
                      }
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />

                    {item.isVisible !==
                    false ? (
                      <FaEye className="text-green-500" />
                    ) : (
                      <FaEyeSlash className="text-gray-400" />
                    )}

                    <span>
                      Show on portfolio
                    </span>

                  </label>

                </div>

              </div>
            )
          )}

          {/* Empty Experience */}

          {experience.length ===
            0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-950">

              <FaBriefcase className="mx-auto text-3xl text-gray-400" />

              <p className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                No experience added.
              </p>

              <button
                type="button"
                onClick={
                  addExperience
                }
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700"
              >
                <FaPlus />

                Add Experience
              </button>

            </div>
          )}

        </div>

      </div>

      {/* ================================================================
          EDUCATION
      ================================================================ */}

      <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-7">

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
              <FaGraduationCap className="text-indigo-500" />

              Education
            </h3>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your academic background
              and qualifications.
            </p>
          </div>

          <button
            type="button"
            onClick={addEducation}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-200 px-4 py-2.5 text-sm font-bold text-indigo-600 transition hover:bg-indigo-50 dark:border-indigo-500/20 dark:text-indigo-400 dark:hover:bg-indigo-500/10"
          >
            <FaPlus />

            Add Education
          </button>

        </div>

        {/* ==============================================================
            EDUCATION LIST
        ============================================================== */}

        <div className="space-y-6">

          {education.map(
            (item, index) => (
              <div
                key={
                  item._id ||
                  `education-${index}`
                }
                className="rounded-2xl border border-gray-200 p-4 dark:border-gray-800 sm:p-6"
              >

                {/* ------------------------------------------------------
                    CARD HEADER
                ------------------------------------------------------- */}

                <div className="mb-5 flex items-center justify-between gap-3">

                  <div>
                    <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                      Education #
                      {index + 1}
                    </span>

                    {item.institution && (
                      <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                        {
                          item.institution
                        }
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      removeEducation(
                        index
                      )
                    }
                    className="rounded-lg p-2.5 text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10"
                    title="Remove education"
                  >
                    <FaTrash />
                  </button>

                </div>

                {/* ------------------------------------------------------
                    BASIC FIELDS
                ------------------------------------------------------- */}

                <div className="grid gap-4 md:grid-cols-2">

                  {/* Degree */}

                  <label>
                    <span
                      className={
                        labelClass
                      }
                    >
                      Degree
                    </span>

                    <input
                      className={
                        inputClass
                      }
                      type="text"
                      placeholder="MCA — Artificial Intelligence & Machine Learning"
                      value={
                        item.degree ??
                        ''
                      }
                      onChange={(event) =>
                        updateEducation(
                          index,
                          'degree',
                          event.target
                            .value
                        )
                      }
                    />
                  </label>

                  {/* Institution */}

                  <label>
                    <span
                      className={
                        labelClass
                      }
                    >
                      Institution
                    </span>

                    <input
                      className={
                        inputClass
                      }
                      type="text"
                      placeholder="Amity University Online"
                      value={
                        item.institution ??
                        ''
                      }
                      onChange={(event) =>
                        updateEducation(
                          index,
                          'institution',
                          event.target
                            .value
                        )
                      }
                    />
                  </label>

                  {/* Duration */}

                  <label>
                    <span
                      className={
                        labelClass
                      }
                    >
                      Duration
                    </span>

                    <input
                      className={
                        inputClass
                      }
                      type="text"
                      placeholder="2024 – Present"
                      value={
                        item.duration ??
                        ''
                      }
                      onChange={(event) =>
                        updateEducation(
                          index,
                          'duration',
                          event.target
                            .value
                        )
                      }
                    />
                  </label>

                  {/* Status */}

                  <label>
                    <span
                      className={
                        labelClass
                      }
                    >
                      Status
                    </span>

                    <select
                      className={
                        inputClass
                      }
                      value={
                        item.status || ''
                      }
                      onChange={(event) =>
                        updateEducation(
                          index,
                          'status',
                          event.target
                            .value
                        )
                      }
                    >
                      <option value="">
                        Select Status
                      </option>

                      <option value="Current">
                        Current
                      </option>

                      <option value="Completed">
                        Completed
                      </option>

                      <option value="Pursuing">
                        Pursuing
                      </option>

                      <option value="Postgraduate">
                        Postgraduate
                      </option>

                      <option value="Undergraduate">
                        Undergraduate
                      </option>
                    </select>
                  </label>

                  {/* Icon */}

                  <label>
                    <span
                      className={
                        labelClass
                      }
                    >
                      Education Icon
                    </span>

                    <select
                      className={
                        inputClass
                      }
                      value={
                        item.icon ||
                        'book'
                      }
                      onChange={(event) =>
                        updateEducation(
                          index,
                          'icon',
                          event.target
                            .value
                        )
                      }
                    >
                      <option value="book">
                        Book
                      </option>

                      <option value="brain">
                        Brain
                      </option>

                      <option value="university">
                        University
                      </option>

                      <option value="award">
                        Award
                      </option>
                    </select>
                  </label>

                  {/* Display Order */}

                  <label>
                    <span
                      className={
                        labelClass
                      }
                    >
                      Display Order
                    </span>

                    <input
                      className={
                        inputClass
                      }
                      type="number"
                      min="0"
                      value={
                        item.displayOrder ??
                        0
                      }
                      onChange={(event) =>
                        updateEducation(
                          index,
                          'displayOrder',
                          event.target
                            .value
                        )
                      }
                    />
                  </label>

                  {/* Description */}

                  <label className="md:col-span-2">
                    <span
                      className={
                        labelClass
                      }
                    >
                      Description
                    </span>

                    <textarea
                      className={
                        textareaClass
                      }
                      placeholder="Describe your education..."
                      value={
                        item.description ||
                        ''
                      }
                      onChange={(event) =>
                        updateEducation(
                          index,
                          'description',
                          event.target
                            .value
                        )
                      }
                    />
                  </label>

                  {/* Highlights */}

                  <label className="md:col-span-2">
                    <span
                      className={
                        labelClass
                      }
                    >
                      Highlights
                    </span>

                    <input
                      className={
                        inputClass
                      }
                      type="text"
                      placeholder="Artificial Intelligence, Machine Learning, Software Development"
                      value={
                        item.highlights ||
                        ''
                      }
                      onChange={(event) =>
                        updateEducation(
                          index,
                          'highlights',
                          event.target
                            .value
                        )
                      }
                    />

                    <span className="mt-1.5 block text-xs text-gray-400">
                      Separate highlights
                      with commas.
                    </span>
                  </label>

                  {/* Visibility */}

                  <label className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">

                    <input
                      type="checkbox"
                      checked={
                        item.isVisible !==
                        false
                      }
                      onChange={(event) =>
                        updateEducation(
                          index,
                          'isVisible',
                          event.target
                            .checked
                        )
                      }
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />

                    {item.isVisible !==
                    false ? (
                      <FaEye className="text-green-500" />
                    ) : (
                      <FaEyeSlash className="text-gray-400" />
                    )}

                    <span>
                      Show on portfolio
                    </span>

                  </label>

                </div>

              </div>
            )
          )}

          {/* Empty Education */}

          {education.length ===
            0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center dark:border-gray-700 dark:bg-gray-950">

              <FaGraduationCap className="mx-auto text-3xl text-gray-400" />

              <p className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                No education added.
              </p>

              <button
                type="button"
                onClick={
                  addEducation
                }
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700"
              >
                <FaPlus />

                Add Education
              </button>

            </div>
          )}

        </div>

      </div>

      {/* ================================================================
          BOTTOM SAVE
      ================================================================ */}

      <div className="flex justify-end">

        <button
          type="button"
          onClick={saveAll}
          disabled={saving}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          <FaSave />

          {saving
            ? 'Saving...'
            : 'Save All Changes'}
        </button>

      </div>

    </section>
  );
}

export default ExperienceEducationManager;
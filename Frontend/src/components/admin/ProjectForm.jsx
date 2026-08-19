import { useState } from 'react';
import { toast } from 'react-toastify';
import API from '../../utils/axios';

function ProjectForm({ project, onClose, onSuccess }) {
  const isEditing = Boolean(project);

  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    image: project?.image || '',
    techStack: project?.techStack?.join(', ') || '',
    keyFeatures: project?.keyFeatures?.join('\n') || '',
    githubLink: project?.githubLink || '',
    liveLink: project?.liveLink || '',
    category: project?.category || 'Full Stack',
    featured: project?.featured || false,
    featuredType: project?.featuredType || '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Title and description are required');
      return;
    }

    if (formData.featured && !formData.featuredType) {
      toast.error('Please select a Featured Project type');
      return;
    }

    const payload = {
      title: formData.title.trim(),

      description: formData.description.trim(),

      image: formData.image.trim(),

      techStack: formData.techStack
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),

      keyFeatures: formData.keyFeatures
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),

      githubLink: formData.githubLink.trim(),

      liveLink: formData.liveLink.trim(),

      category: formData.category,

      featured: formData.featured,

      featuredType: formData.featured
        ? formData.featuredType
        : '',
    };

    setLoading(true);

    try {
      if (isEditing) {
        await API.put(`/projects/${project._id}`, payload);

        toast.success('Project updated successfully');
      } else {
        await API.post('/projects', payload);

        toast.success('Project created successfully');
      }

      onSuccess();
    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Something went wrong';

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 px-4 py-8 backdrop-blur-sm sm:px-6">
      <div className="mx-auto w-full max-w-2xl rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-800 sm:p-7">
        {/* Header */}
        <div className="mb-7 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-400">
              Project Management
            </p>

            <h2 className="mt-1 text-2xl font-extrabold text-gray-900 dark:text-white">
              {isEditing ? 'Edit Project' : 'Add New Project'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-2xl text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            aria-label="Close project form"
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Project Title *
            </label>

            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="School Canteen Ordering System"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Short Description *
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Full-stack ordering platform with authentication, cart management, order processing and admin functionality."
              className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition-colors focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>

          {/* Image */}
          <div>
            <label
              htmlFor="image"
              className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Project Screenshot URL
            </label>

            <input
              id="image"
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />

            <p className="mt-1.5 text-xs text-gray-400">
              Use a public image URL for the project screenshot.
            </p>
          </div>

          {/* Tech Stack */}
          <div>
            <label
              htmlFor="techStack"
              className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Tech Stack
            </label>

            <input
              id="techStack"
              type="text"
              name="techStack"
              value={formData.techStack}
              onChange={handleChange}
              placeholder="React, Node.js, Express, MongoDB"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />

            <p className="mt-1.5 text-xs text-gray-400">
              Separate technologies with commas.
            </p>
          </div>

          {/* Key Features */}
          <div>
            <label
              htmlFor="keyFeatures"
              className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Key Features
            </label>

            <textarea
              id="keyFeatures"
              name="keyFeatures"
              value={formData.keyFeatures}
              onChange={handleChange}
              rows="5"
              placeholder={`User Authentication
Shopping Cart
Order Management
Admin Dashboard
REST API Integration`}
              className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition-colors focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />

            <p className="mt-1.5 text-xs text-gray-400">
              Add one feature per line.
            </p>
          </div>

          {/* Links */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="githubLink"
                className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                GitHub Link
              </label>

              <input
                id="githubLink"
                type="text"
                name="githubLink"
                value={formData.githubLink}
                onChange={handleChange}
                placeholder="https://github.com/..."
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="liveLink"
                className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Live Demo Link
              </label>

              <input
                id="liveLink"
                type="text"
                name="liveLink"
                value={formData.liveLink}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Project Category
            </label>

            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            >
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Full Stack">Full Stack</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Featured Project */}
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5 dark:border-indigo-500/10 dark:bg-indigo-500/5">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="mt-1 h-4 w-4 accent-indigo-600"
              />

              <span>
                <span className="block text-sm font-bold text-gray-800 dark:text-gray-200">
                  Add to Featured Projects
                </span>

                <span className="mt-1 block text-xs leading-5 text-gray-500 dark:text-gray-400">
                  Only your strongest projects should be selected here.
                </span>
              </span>
            </label>

            {/* Featured Type */}
            {formData.featured && (
              <div className="mt-5">
                <label
                  htmlFor="featuredType"
                  className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Featured Project Type *
                </label>

                <select
                  id="featuredType"
                  name="featuredType"
                  value={formData.featuredType}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-indigo-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                >
                  <option value="">
                    Select Featured Type
                  </option>

                  <option value="Major Full-Stack Project">
                    Major Full-Stack Project
                  </option>

                  <option value="AI / React Project">
                    AI / React Project
                  </option>

                  <option value="MERN Business Project">
                    MERN Business Project
                  </option>
                </select>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition-all duration-300 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? 'Saving...'
                : isEditing
                  ? 'Update Project'
                  : 'Create Project'}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl bg-gray-200 px-5 py-3 font-semibold text-gray-800 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProjectForm;
import { useState } from 'react';
import { toast } from 'react-toastify';
import {
  FaUpload,
  FaSpinner,
  FaTimes,
  FaBookOpen,
} from 'react-icons/fa';
import API from '../../utils/axios';
import ImageCropModal from './shared/ImageCropModal';

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

    // Case Study fields
    hasCaseStudy: project?.hasCaseStudy || false,
    problem: project?.problem || '',
    solution: project?.solution || '',
    techDecisions: project?.techDecisions?.join('\n') || '',
    challenges: project?.challenges?.join('\n') || '',
  });

  const [screenshots, setScreenshots] = useState(
    project?.screenshots || []
  );
  const [uploadingScreenshots, setUploadingScreenshots] = useState(false);

  // Queue of raw screenshot files waiting to be cropped, one at a time
  const [cropQueue, setCropQueue] = useState([]);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Case Study — Screenshot Upload (up to 8 at once)
  |--------------------------------------------------------------------------
  |
  | Files pehle crop-queue me jaate hain — har screenshot ImageCropModal
  | se crop/compress hone ke baad hi Cloudinary pe upload hota hai.
  |--------------------------------------------------------------------------
  */

  const handleScreenshotUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';

    if (!files.length) return;

    if (screenshots.length + files.length > 8) {
      toast.error('You can upload a maximum of 8 screenshots per project.');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    const invalidFile = files.find(
      (file) => !file.type.startsWith('image/') || file.size > maxSize
    );

    if (invalidFile) {
      toast.error(
        'Please select image files only, each up to 5 MB in size.'
      );
      return;
    }

    setCropQueue((previous) => [...previous, ...files]);
  };

  /*
  |--------------------------------------------------------------------------
  | Upload a single cropped screenshot, then advance the crop queue
  |--------------------------------------------------------------------------
  */

  const uploadCroppedScreenshot = async (croppedFile) => {
    try {
      setUploadingScreenshots(true);

      const uploadData = new FormData();
      uploadData.append('screenshots', croppedFile);

      const res = await API.post(
        '/projects/upload-screenshots',
        uploadData
      );

      const uploadedUrls = res.data?.data?.screenshots || [];

      if (!uploadedUrls.length) {
        throw new Error('No screenshot URL was returned by server.');
      }

      setScreenshots((previous) => [...previous, ...uploadedUrls]);

      toast.success('Screenshot uploaded successfully.');
    } catch (err) {
      console.error('Screenshot upload error:', err);

      toast.error(
        err.response?.data?.message || 'Failed to upload screenshot'
      );
    } finally {
      setUploadingScreenshots(false);
    }
  };

  const handleCropConfirm = async (croppedFile) => {
    await uploadCroppedScreenshot(croppedFile);
    setCropQueue((previous) => previous.slice(1));
  };

  const handleCropCancel = () => {
    setCropQueue((previous) => previous.slice(1));
  };

  const removeScreenshot = (url) => {
    setScreenshots((previous) => previous.filter((item) => item !== url));
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

    if (formData.hasCaseStudy && !formData.problem.trim()) {
      toast.error('Please describe the problem statement for the case study');
      return;
    }

    if (formData.hasCaseStudy && !formData.solution.trim()) {
      toast.error('Please describe the solution for the case study');
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

      hasCaseStudy: formData.hasCaseStudy,

      problem: formData.hasCaseStudy ? formData.problem.trim() : '',

      solution: formData.hasCaseStudy ? formData.solution.trim() : '',

      techDecisions: formData.hasCaseStudy
        ? formData.techDecisions
            .split('\n')
            .map((item) => item.trim())
            .filter(Boolean)
        : [],

      challenges: formData.hasCaseStudy
        ? formData.challenges
            .split('\n')
            .map((item) => item.trim())
            .filter(Boolean)
        : [],

      screenshots: formData.hasCaseStudy ? screenshots : [],
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

          {/* Case Study */}
          <div className="rounded-2xl border border-purple-100 bg-purple-50/60 p-5 dark:border-purple-500/10 dark:bg-purple-500/5">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                id="hasCaseStudy"
                name="hasCaseStudy"
                checked={formData.hasCaseStudy}
                onChange={handleChange}
                className="mt-1 h-4 w-4 accent-purple-600"
              />

              <span>
                <span className="flex items-center gap-2 text-sm font-bold text-gray-800 dark:text-gray-200">
                  <FaBookOpen className="text-purple-500" />
                  Add a detailed Case Study
                </span>

                <span className="mt-1 block text-xs leading-5 text-gray-500 dark:text-gray-400">
                  Enables a dedicated case-study page for this project, with a
                  "View Case Study" link on the project card.
                </span>
              </span>
            </label>

            {formData.hasCaseStudy && (
              <div className="mt-5 space-y-5">
                {/* Slug info */}
                {project?.slug && (
                  <p className="rounded-xl border border-purple-100 bg-white px-4 py-2.5 text-xs font-semibold text-purple-700 dark:border-purple-500/10 dark:bg-gray-900 dark:text-purple-400">
                    Case study URL: /projects/{project.slug}
                  </p>
                )}

                {/* Problem */}
                <div>
                  <label
                    htmlFor="problem"
                    className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Problem Statement *
                  </label>

                  <textarea
                    id="problem"
                    name="problem"
                    value={formData.problem}
                    onChange={handleChange}
                    rows="3"
                    placeholder="What problem was this project solving? What was the situation before?"
                    className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition-colors focus:border-purple-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                </div>

                {/* Solution */}
                <div>
                  <label
                    htmlFor="solution"
                    className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Solution *
                  </label>

                  <textarea
                    id="solution"
                    name="solution"
                    value={formData.solution}
                    onChange={handleChange}
                    rows="4"
                    placeholder="How did you approach and build the solution?"
                    className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition-colors focus:border-purple-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                </div>

                {/* Tech Decisions */}
                <div>
                  <label
                    htmlFor="techDecisions"
                    className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Tech Decisions
                  </label>

                  <textarea
                    id="techDecisions"
                    name="techDecisions"
                    value={formData.techDecisions}
                    onChange={handleChange}
                    rows="4"
                    placeholder={`Chose MongoDB for flexible schema during rapid iteration\nUsed Redux Toolkit to simplify state management\nJWT auth for stateless, scalable sessions`}
                    className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition-colors focus:border-purple-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />

                  <p className="mt-1.5 text-xs text-gray-400">
                    One tech decision per line — "kyun ye tech chuna".
                  </p>
                </div>

                {/* Challenges */}
                <div>
                  <label
                    htmlFor="challenges"
                    className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Challenges Faced
                  </label>

                  <textarea
                    id="challenges"
                    name="challenges"
                    value={formData.challenges}
                    onChange={handleChange}
                    rows="4"
                    placeholder={`Handling concurrent order updates without race conditions\nOptimizing image uploads for slow networks`}
                    className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition-colors focus:border-purple-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />

                  <p className="mt-1.5 text-xs text-gray-400">
                    One challenge per line.
                  </p>
                </div>

                {/* Screenshots */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Case Study Screenshots
                  </label>

                  {screenshots.length > 0 && (
                    <div className="mb-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
                      {screenshots.map((url) => (
                        <div
                          key={url}
                          className="group relative aspect-video overflow-hidden rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-900"
                        >
                          <img
                            src={url}
                            alt="Case study screenshot"
                            className="h-full w-full object-cover"
                          />

                          <button
                            type="button"
                            onClick={() => removeScreenshot(url)}
                            className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-lg bg-gray-950/80 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                            aria-label="Remove screenshot"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <label className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-purple-300 bg-white px-4 py-3 text-sm font-semibold text-purple-700 transition-colors hover:bg-purple-50 dark:border-purple-500/30 dark:bg-gray-900 dark:text-purple-400 dark:hover:bg-purple-500/5">
                    {uploadingScreenshots ? (
                      <>
                        <FaSpinner className="animate-spin" /> Uploading...
                      </>
                    ) : (
                      <>
                        <FaUpload /> Upload screenshots (up to 8)
                      </>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleScreenshotUpload}
                      disabled={
                        uploadingScreenshots || screenshots.length >= 8
                      }
                      className="hidden"
                    />
                  </label>

                  <p className="mt-1.5 text-xs text-gray-400">
                    {screenshots.length}/8 screenshots added. 5 MB max per
                    image.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button
              type="submit"
              disabled={loading || uploadingScreenshots}
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

      {/* Crop the next screenshot in the queue, one at a time */}
      {cropQueue.length > 0 && (
        <ImageCropModal
          file={cropQueue[0]}
          aspectRatio={16 / 9}
          onCancel={handleCropCancel}
          onConfirm={handleCropConfirm}
        />
      )}
    </div>
  );
}

export default ProjectForm;
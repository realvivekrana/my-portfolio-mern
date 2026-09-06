import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import {
  FaComments,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSyncAlt,
  FaEye,
  FaEyeSlash,
  FaStar,
  FaUser,
  FaUpload,
  FaSpinner,
  FaLink,
  FaGripLines,
} from 'react-icons/fa';

import API from '../../utils/axios';
import { resolveMediaUrl } from '../../utils/mediaUrl';

/*
|--------------------------------------------------------------------------
| Testimonial Manager
|--------------------------------------------------------------------------
|
| Admin dashboard ke andar testimonials ka full CRUD:
| - List (visible + hidden)
| - Create / Edit (avatar upload, rating, display order)
| - Visibility / Featured toggle
| - Delete
|
|--------------------------------------------------------------------------
*/

const emptyForm = {
  name: '',
  role: '',
  company: '',
  message: '',
  avatar: '',
  rating: 5,
  profileUrl: '',
  featured: false,
  displayOrder: 0,
  isVisible: true,
};

function StarRatingInput({ value, onChange }) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="text-xl transition-transform hover:scale-110"
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
        >
          <FaStar
            className={
              star <= value
                ? 'text-yellow-400'
                : 'text-gray-200 dark:text-gray-700'
            }
          />
        </button>
      ))}
    </div>
  );
}

function TestimonialManager() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [avatarPreview, setAvatarPreview] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | Fetch Testimonials
  |--------------------------------------------------------------------------
  */

  const fetchTestimonials = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await API.get('/testimonials/admin');
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
      setTestimonials(list);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to load testimonials. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Stats
  |--------------------------------------------------------------------------
  */

  const stats = useMemo(() => {
    const total = testimonials.length;
    const visible = testimonials.filter((t) => t.isVisible).length;
    const hidden = total - visible;
    const featured = testimonials.filter((t) => t.featured).length;
    return { total, visible, hidden, featured };
  }, [testimonials]);

  /*
  |--------------------------------------------------------------------------
  | Modal Open / Close
  |--------------------------------------------------------------------------
  */

  const openCreateModal = () => {
    setEditingTestimonial(null);
    setFormData({
      ...emptyForm,
      displayOrder: testimonials.length,
    });
    setAvatarPreview('');
    setShowModal(true);
  };

  const openEditModal = (testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name || '',
      role: testimonial.role || '',
      company: testimonial.company || '',
      message: testimonial.message || '',
      avatar: testimonial.avatar || '',
      rating: testimonial.rating || 5,
      profileUrl: testimonial.profileUrl || '',
      featured: Boolean(testimonial.featured),
      displayOrder: testimonial.displayOrder || 0,
      isVisible:
        testimonial.isVisible === undefined ? true : testimonial.isVisible,
    });
    setAvatarPreview(testimonial.avatar || '');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTestimonial(null);
    setFormData(emptyForm);
    setAvatarPreview('');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Avatar Upload
  |--------------------------------------------------------------------------
  */

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Avatar image must be 5 MB or smaller.');
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setAvatarPreview(localPreview);

    try {
      setUploadingAvatar(true);

      const uploadData = new FormData();
      uploadData.append('testimonialImage', file);
      if (editingTestimonial?._id) {
        uploadData.append('testimonialId', editingTestimonial._id);
      }

      const res = await API.post('/testimonials/upload-image', uploadData);
      const uploadedImage = res.data?.data?.image;

      if (!uploadedImage) {
        throw new Error('Image URL was not returned by server.');
      }

      setFormData((prev) => ({ ...prev, avatar: uploadedImage }));
      setAvatarPreview(uploadedImage);

      if (editingTestimonial?._id) {
        setTestimonials((prev) =>
          prev.map((t) =>
            t._id === editingTestimonial._id
              ? { ...t, avatar: uploadedImage }
              : t
          )
        );
      }

      toast.success('Avatar uploaded successfully.');
    } catch (err) {
      console.error('Avatar upload error:', err);
      setAvatarPreview(formData.avatar || '');
      toast.error(
        err.response?.data?.message || 'Failed to upload avatar'
      );
    } finally {
      setUploadingAvatar(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Save (Create / Update)
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    if (!formData.message.trim()) {
      toast.error('Testimonial message is required');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      role: formData.role.trim(),
      company: formData.company.trim(),
      message: formData.message.trim(),
      avatar: formData.avatar.trim(),
      rating: Number(formData.rating) || 5,
      profileUrl: formData.profileUrl.trim(),
      featured: formData.featured,
      displayOrder: Number(formData.displayOrder) || 0,
      isVisible: formData.isVisible,
    };

    setSaving(true);

    try {
      if (editingTestimonial) {
        const res = await API.put(
          `/testimonials/${editingTestimonial._id}`,
          payload
        );
        const updated = res.data?.data;
        setTestimonials((prev) =>
          prev.map((t) => (t._id === editingTestimonial._id ? updated : t))
        );
        toast.success('Testimonial updated successfully');
      } else {
        const res = await API.post('/testimonials', payload);
        const created = res.data?.data;
        setTestimonials((prev) =>
          [...prev, created].sort(
            (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)
          )
        );
        toast.success('Testimonial created successfully');
      }

      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Quick Toggle: Visibility / Featured
  |--------------------------------------------------------------------------
  */

  const toggleVisibility = async (testimonial) => {
    try {
      const res = await API.put(`/testimonials/${testimonial._id}`, {
        isVisible: !testimonial.isVisible,
      });
      const updated = res.data?.data;
      setTestimonials((prev) =>
        prev.map((t) => (t._id === testimonial._id ? updated : t))
      );
      toast.success(
        updated.isVisible ? 'Testimonial shown' : 'Testimonial hidden'
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Failed to update testimonial'
      );
    }
  };

  const toggleFeatured = async (testimonial) => {
    try {
      const res = await API.put(`/testimonials/${testimonial._id}`, {
        featured: !testimonial.featured,
      });
      const updated = res.data?.data;
      setTestimonials((prev) =>
        prev.map((t) => (t._id === testimonial._id ? updated : t))
      );
      toast.success(
        updated.featured ? 'Marked as featured' : 'Removed from featured'
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Failed to update testimonial'
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Delete
  |--------------------------------------------------------------------------
  */

  const handleDelete = async (testimonial) => {
    if (
      !window.confirm(
        `Delete testimonial from "${testimonial.name}"? This cannot be undone.`
      )
    ) {
      return;
    }

    setDeletingId(testimonial._id);

    try {
      await API.delete(`/testimonials/${testimonial._id}`);
      setTestimonials((prev) => prev.filter((t) => t._id !== testimonial._id));
      toast.success('Testimonial deleted');
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Failed to delete testimonial'
      );
    } finally {
      setDeletingId(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <section>
      {/* Header */}
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
            <FaComments />
            Social Proof
          </p>
          <h2 className="mt-1 text-2xl font-extrabold text-gray-900 dark:text-white">
            Testimonials
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400">
            Manage client and colleague testimonials shown on your homepage.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={fetchTestimonials}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <FaSyncAlt className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20"
          >
            <FaPlus />
            New Testimonial
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-7 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total', value: stats.total },
          { label: 'Visible', value: stats.visible },
          { label: 'Hidden', value: stats.hidden },
          { label: 'Featured', value: stats.featured },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950"
          >
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
              {stat.value}
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <FaSpinner className="mr-2 animate-spin" /> Loading testimonials...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-600 dark:border-red-500/10 dark:bg-red-500/5 dark:text-red-400">
          {error}
        </div>
      ) : testimonials.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
          No testimonials yet. Click "New Testimonial" to add your first one.
        </div>
      ) : (
        <div className="space-y-4">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial._id}
              className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-950 sm:flex-row sm:items-center"
            >
              {/* Order handle + Avatar */}
              <div className="flex shrink-0 items-center gap-3">
                <span
                  className="hidden text-gray-300 sm:block dark:text-gray-700"
                  title={`Display order: ${testimonial.displayOrder ?? 0}`}
                >
                  <FaGripLines />
                </span>

                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-900">
                  {testimonial.avatar ? (
                    <img
                      src={
                        resolveMediaUrl(testimonial.avatar) ||
                        testimonial.avatar
                      }
                      alt={testimonial.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-indigo-300 dark:text-indigo-500/40">
                      <FaUser />
                    </div>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-base font-bold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </h3>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      testimonial.isVisible
                        ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                    }`}
                  >
                    {testimonial.isVisible ? 'Visible' : 'Hidden'}
                  </span>

                  {testimonial.featured && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2.5 py-0.5 text-[11px] font-bold text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400">
                      <FaStar className="text-[10px]" /> Featured
                    </span>
                  )}
                </div>

                {(testimonial.role || testimonial.company) && (
                  <p className="mt-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    {[testimonial.role, testimonial.company]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                )}

                <p className="mt-1.5 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                  {testimonial.message}
                </p>

                <div className="mt-2 flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`text-xs ${
                        star <= (testimonial.rating || 5)
                          ? 'text-yellow-400'
                          : 'text-gray-200 dark:text-gray-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleVisibility(testimonial)}
                  title={testimonial.isVisible ? 'Hide' : 'Show'}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  {testimonial.isVisible ? <FaEyeSlash /> : <FaEye />}
                </button>

                <button
                  type="button"
                  onClick={() => toggleFeatured(testimonial)}
                  title={
                    testimonial.featured ? 'Remove featured' : 'Mark featured'
                  }
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                    testimonial.featured
                      ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100 dark:bg-yellow-500/10 dark:text-yellow-400'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  <FaStar />
                </button>

                <button
                  type="button"
                  onClick={() => openEditModal(testimonial)}
                  title="Edit"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition-colors hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400"
                >
                  <FaEdit />
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(testimonial)}
                  disabled={deletingId === testimonial._id}
                  title="Delete"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50 dark:bg-red-500/10 dark:text-red-400"
                >
                  {deletingId === testimonial._id ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaTrash />
                  )}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* ============================ MODAL ============================ */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 px-4 py-8 backdrop-blur-sm sm:px-6">
          <div className="mx-auto w-full max-w-2xl rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-800 sm:p-7">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-400">
                  Testimonial Management
                </p>
                <h2 className="mt-1 text-2xl font-extrabold text-gray-900 dark:text-white">
                  {editingTestimonial ? 'Edit Testimonial' : 'New Testimonial'}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-2xl text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Avatar */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Avatar
                </label>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FaUser className="text-2xl text-gray-300 dark:text-gray-600" />
                    )}
                  </div>

                  <label className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">
                    {uploadingAvatar ? (
                      <>
                        <FaSpinner className="animate-spin" /> Uploading...
                      </>
                    ) : (
                      <>
                        <FaUpload /> Upload avatar
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      disabled={uploadingAvatar}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Name / Role / Company */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Priya Sharma"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="role"
                    className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Role
                  </label>
                  <input
                    id="role"
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="Product Manager"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="company"
                    className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Company
                  </label>
                  <input
                    id="company"
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Acme Inc."
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="profileUrl"
                    className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Profile / LinkedIn URL
                  </label>
                  <div className="relative">
                    <FaLink className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400" />
                    <input
                      id="profileUrl"
                      type="text"
                      name="profileUrl"
                      value={formData.profileUrl}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-9 pr-4 text-sm text-gray-900 outline-none transition-colors focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Testimonial Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Working with them was a fantastic experience — delivered on time with clean, well-documented code."
                  className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition-colors focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </div>

              {/* Rating / Display Order */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Rating
                  </label>
                  <StarRatingInput
                    value={formData.rating}
                    onChange={(star) =>
                      setFormData((prev) => ({ ...prev, rating: star }))
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="displayOrder"
                    className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Display Order
                  </label>
                  <input
                    id="displayOrder"
                    type="number"
                    name="displayOrder"
                    value={formData.displayOrder}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                  <p className="mt-1.5 text-xs text-gray-400">
                    Lower numbers appear first.
                  </p>
                </div>
              </div>

              {/* Visibility / Featured toggles */}
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                  <input
                    type="checkbox"
                    name="isVisible"
                    checked={formData.isVisible}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 accent-indigo-600"
                  />
                  <span>
                    <span className="block text-sm font-bold text-gray-800 dark:text-gray-200">
                      Visible
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-gray-500 dark:text-gray-400">
                      Shown on the public testimonials section.
                    </span>
                  </span>
                </label>

                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 dark:border-indigo-500/10 dark:bg-indigo-500/5">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 accent-indigo-600"
                  />
                  <span>
                    <span className="block text-sm font-bold text-gray-800 dark:text-gray-200">
                      Feature this testimonial
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-gray-500 dark:text-gray-400">
                      Highlighted above the rest.
                    </span>
                  </span>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <button
                  type="submit"
                  disabled={saving || uploadingAvatar}
                  className="flex-1 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition-all duration-300 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? 'Saving...'
                    : editingTestimonial
                      ? 'Update Testimonial'
                      : 'Create Testimonial'}
                </button>

                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-xl bg-gray-200 px-5 py-3 font-semibold text-gray-800 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default TestimonialManager;
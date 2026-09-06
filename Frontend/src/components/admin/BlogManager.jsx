import { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { toast } from 'react-toastify';
import {
  FaNewspaper,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSyncAlt,
  FaEye,
  FaEyeSlash,
  FaStar,
  FaRegClock,
  FaRegEye,
  FaUpload,
  FaSpinner,
  FaPen,
} from 'react-icons/fa';

import API from '../../utils/axios';
import { resolveMediaUrl } from '../../utils/mediaUrl';

/*
|--------------------------------------------------------------------------
| Blog Manager
|--------------------------------------------------------------------------
|
| Admin dashboard ke andar Blog posts ka full CRUD:
| - List (drafts + published)
| - Create / Edit (Markdown editor + live preview)
| - Cover image upload (Cloudinary)
| - Publish / Draft toggle, Featured toggle
| - Delete
|
|--------------------------------------------------------------------------
*/

const emptyForm = {
  title: '',
  excerpt: '',
  content: '',
  coverImage: '',
  tags: '',
  isPublished: false,
  featured: false,
};

function BlogManager() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false);

  const [editorTab, setEditorTab] = useState('write'); // 'write' | 'preview'
  const [uploadingCover, setUploadingCover] = useState(false);
  const [coverPreview, setCoverPreview] = useState('');

  const [deletingId, setDeletingId] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | Fetch Posts
  |--------------------------------------------------------------------------
  */

  const fetchPosts = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await API.get('/blog/admin');
      setPosts(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to load blog posts. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Stats
  |--------------------------------------------------------------------------
  */

  const stats = useMemo(() => {
    const total = posts.length;
    const published = posts.filter((p) => p.isPublished).length;
    const drafts = total - published;
    const featured = posts.filter((p) => p.featured).length;
    return { total, published, drafts, featured };
  }, [posts]);

  /*
  |--------------------------------------------------------------------------
  | Modal Open / Close
  |--------------------------------------------------------------------------
  */

  const openCreateModal = () => {
    setEditingPost(null);
    setFormData(emptyForm);
    setCoverPreview('');
    setEditorTab('write');
    setShowModal(true);
  };

  const openEditModal = async (post) => {
    setLoadingPost(true);
    setShowModal(true);
    setEditingPost(post);
    setEditorTab('write');

    try {
      // Admin list drops "content" for performance, so fetch full post.
      const res = await API.get(`/blog/admin/${post._id}`);
      const full = res.data?.data;

      setFormData({
        title: full.title || '',
        excerpt: full.excerpt || '',
        content: full.content || '',
        coverImage: full.coverImage || '',
        tags: Array.isArray(full.tags) ? full.tags.join(', ') : '',
        isPublished: Boolean(full.isPublished),
        featured: Boolean(full.featured),
      });

      setCoverPreview(full.coverImage || '');
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Failed to load post details'
      );
      setShowModal(false);
    } finally {
      setLoadingPost(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPost(null);
    setFormData(emptyForm);
    setCoverPreview('');
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
  | Cover Image Upload
  |--------------------------------------------------------------------------
  */

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Cover image must be 5 MB or smaller.');
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setCoverPreview(localPreview);

    try {
      setUploadingCover(true);

      const uploadData = new FormData();
      uploadData.append('blogImage', file);
      if (editingPost?._id) {
        uploadData.append('postId', editingPost._id);
      }

      const res = await API.post('/blog/upload-image', uploadData);
      const uploadedImage = res.data?.data?.image;

      if (!uploadedImage) {
        throw new Error('Image URL was not returned by server.');
      }

      setFormData((prev) => ({ ...prev, coverImage: uploadedImage }));
      setCoverPreview(uploadedImage);

      if (editingPost?._id) {
        setPosts((prev) =>
          prev.map((p) =>
            p._id === editingPost._id ? { ...p, coverImage: uploadedImage } : p
          )
        );
      }

      toast.success('Cover image uploaded successfully.');
    } catch (err) {
      console.error('Cover upload error:', err);
      setCoverPreview(formData.coverImage || '');
      toast.error(
        err.response?.data?.message || 'Failed to upload cover image'
      );
    } finally {
      setUploadingCover(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Save (Create / Update)
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!formData.content.trim()) {
      toast.error('Content is required');
      return;
    }

    const payload = {
      title: formData.title.trim(),
      excerpt: formData.excerpt.trim(),
      content: formData.content,
      coverImage: formData.coverImage.trim(),
      tags: formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      isPublished: formData.isPublished,
      featured: formData.featured,
    };

    setSaving(true);

    try {
      if (editingPost) {
        const res = await API.put(`/blog/${editingPost._id}`, payload);
        const updated = res.data?.data;
        setPosts((prev) =>
          prev.map((p) => (p._id === editingPost._id ? updated : p))
        );
        toast.success('Blog post updated successfully');
      } else {
        const res = await API.post('/blog', payload);
        const created = res.data?.data;
        setPosts((prev) => [created, ...prev]);
        toast.success('Blog post created successfully');
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
  | Quick Toggle: Publish / Featured
  |--------------------------------------------------------------------------
  */

  const togglePublish = async (post) => {
    try {
      const res = await API.put(`/blog/${post._id}`, {
        isPublished: !post.isPublished,
      });
      const updated = res.data?.data;
      setPosts((prev) => prev.map((p) => (p._id === post._id ? updated : p)));
      toast.success(
        updated.isPublished ? 'Post published' : 'Post moved to draft'
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update post');
    }
  };

  const toggleFeatured = async (post) => {
    try {
      const res = await API.put(`/blog/${post._id}`, {
        featured: !post.featured,
      });
      const updated = res.data?.data;
      setPosts((prev) => prev.map((p) => (p._id === post._id ? updated : p)));
      toast.success(
        updated.featured ? 'Marked as featured' : 'Removed from featured'
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update post');
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Delete
  |--------------------------------------------------------------------------
  */

  const handleDelete = async (post) => {
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) {
      return;
    }

    setDeletingId(post._id);

    try {
      await API.delete(`/blog/${post._id}`);
      setPosts((prev) => prev.filter((p) => p._id !== post._id));
      toast.success('Blog post deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete post');
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
            <FaNewspaper />
            Content
          </p>
          <h2 className="mt-1 text-2xl font-extrabold text-gray-900 dark:text-white">
            Blog Posts
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400">
            Write, publish and manage articles shown on your public blog.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={fetchPosts}
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
            New Post
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-7 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Posts', value: stats.total },
          { label: 'Published', value: stats.published },
          { label: 'Drafts', value: stats.drafts },
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
          <FaSpinner className="mr-2 animate-spin" /> Loading posts...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-600 dark:border-red-500/10 dark:bg-red-500/5 dark:text-red-400">
          {error}
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
          No blog posts yet. Click "New Post" to write your first article.
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <article
              key={post._id}
              className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-950 sm:flex-row sm:items-center"
            >
              {/* Cover thumb */}
              <div className="h-20 w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-900 sm:h-16 sm:w-24">
                {post.coverImage ? (
                  <img
                    src={resolveMediaUrl(post.coverImage) || post.coverImage}
                    alt={post.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-indigo-300 dark:text-indigo-500/40">
                    <FaNewspaper />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-base font-bold text-gray-900 dark:text-white">
                    {post.title}
                  </h3>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      post.isPublished
                        ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                    }`}
                  >
                    {post.isPublished ? 'Published' : 'Draft'}
                  </span>

                  {post.featured && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2.5 py-0.5 text-[11px] font-bold text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400">
                      <FaStar className="text-[10px]" /> Featured
                    </span>
                  )}
                </div>

                <p className="mt-1.5 line-clamp-1 text-sm text-gray-500 dark:text-gray-400">
                  {post.excerpt || 'No excerpt added yet.'}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <FaRegClock /> {post.readTime || 1} min read
                  </span>
                  <span className="flex items-center gap-1">
                    <FaRegEye /> {post.views || 0} views
                  </span>
                  {Array.isArray(post.tags) && post.tags.length > 0 && (
                    <span className="truncate">
                      #{post.tags.slice(0, 3).join(', #')}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => togglePublish(post)}
                  title={post.isPublished ? 'Move to draft' : 'Publish'}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  {post.isPublished ? <FaEyeSlash /> : <FaEye />}
                </button>

                <button
                  type="button"
                  onClick={() => toggleFeatured(post)}
                  title={post.featured ? 'Remove featured' : 'Mark featured'}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                    post.featured
                      ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100 dark:bg-yellow-500/10 dark:text-yellow-400'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  <FaStar />
                </button>

                <button
                  type="button"
                  onClick={() => openEditModal(post)}
                  title="Edit"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition-colors hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400"
                >
                  <FaEdit />
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(post)}
                  disabled={deletingId === post._id}
                  title="Delete"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50 dark:bg-red-500/10 dark:text-red-400"
                >
                  {deletingId === post._id ? (
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
          <div className="mx-auto w-full max-w-3xl rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-800 sm:p-7">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-400">
                  Blog Management
                </p>
                <h2 className="mt-1 text-2xl font-extrabold text-gray-900 dark:text-white">
                  {editingPost ? 'Edit Post' : 'Write New Post'}
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

            {loadingPost ? (
              <div className="flex items-center justify-center py-16 text-gray-400">
                <FaSpinner className="mr-2 animate-spin" /> Loading post...
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Title */}
                <div>
                  <label
                    htmlFor="title"
                    className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Post Title *
                  </label>
                  <input
                    id="title"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="How I built a full-stack e-commerce app with MERN"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <label
                    htmlFor="excerpt"
                    className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Excerpt / Short Summary
                  </label>
                  <textarea
                    id="excerpt"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    rows="2"
                    placeholder="Leave blank to auto-generate from content."
                    className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition-colors focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                </div>

                {/* Cover Image */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Cover Image
                  </label>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex h-24 w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900 sm:w-40">
                      {coverPreview ? (
                        <img
                          src={coverPreview}
                          alt="Cover preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <FaNewspaper className="text-2xl text-gray-300 dark:text-gray-600" />
                      )}
                    </div>

                    <label className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">
                      {uploadingCover ? (
                        <>
                          <FaSpinner className="animate-spin" /> Uploading...
                        </>
                      ) : (
                        <>
                          <FaUpload /> Upload cover image
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverUpload}
                        disabled={uploadingCover}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Content — Markdown Editor */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Content (Markdown) *
                    </label>

                    <div className="flex overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
                      <button
                        type="button"
                        onClick={() => setEditorTab('write')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-colors ${
                          editorTab === 'write'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-300'
                        }`}
                      >
                        <FaPen className="text-[10px]" /> Write
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditorTab('preview')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-colors ${
                          editorTab === 'preview'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-300'
                        }`}
                      >
                        <FaEye className="text-[10px]" /> Preview
                      </button>
                    </div>
                  </div>

                  {editorTab === 'write' ? (
                    <textarea
                      id="content"
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      rows="14"
                      placeholder={`## Introduction\n\nWrite your post using Markdown — headings, **bold**, _italics_, lists, code blocks, tables (GFM supported) and links all work.`}
                      className="w-full resize-y rounded-xl border border-gray-300 bg-white px-4 py-3 font-mono text-sm leading-6 text-gray-900 outline-none transition-colors focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    />
                  ) : (
                    <div className="markdown-content max-h-[24rem] min-h-[16rem] overflow-y-auto rounded-xl border border-gray-300 bg-white px-5 py-4 text-sm leading-7 text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                      {formData.content.trim() ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {formData.content}
                        </ReactMarkdown>
                      ) : (
                        <p className="text-gray-400">
                          Nothing to preview yet — start writing in the Write
                          tab.
                        </p>
                      )}
                    </div>
                  )}

                  <p className="mt-1.5 text-xs text-gray-400">
                    Supports GitHub Flavored Markdown (tables, task lists,
                    strikethrough).
                  </p>
                </div>

                {/* Tags */}
                <div>
                  <label
                    htmlFor="tags"
                    className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Tags
                  </label>
                  <input
                    id="tags"
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="MERN, React, Node.js, MongoDB"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  />
                  <p className="mt-1.5 text-xs text-gray-400">
                    Separate tags with commas.
                  </p>
                </div>

                {/* Publish / Featured toggles */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900">
                    <input
                      type="checkbox"
                      name="isPublished"
                      checked={formData.isPublished}
                      onChange={handleChange}
                      className="mt-1 h-4 w-4 accent-indigo-600"
                    />
                    <span>
                      <span className="block text-sm font-bold text-gray-800 dark:text-gray-200">
                        Publish
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-gray-500 dark:text-gray-400">
                        Visible on the public blog. Leave unchecked to save as
                        draft.
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
                        Feature on homepage
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-gray-500 dark:text-gray-400">
                        Shown in the blog preview section.
                      </span>
                    </span>
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <button
                    type="submit"
                    disabled={saving || uploadingCover}
                    className="flex-1 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition-all duration-300 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving
                      ? 'Saving...'
                      : editingPost
                        ? 'Update Post'
                        : 'Create Post'}
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
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default BlogManager;
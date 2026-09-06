const express = require('express');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

const {
  getAllPosts,
  getFeaturedPosts,
  getAllTags,
  getAdminPosts,
  getPostBySlug,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  uploadBlogImage,
} = require('../controllers/blogController');

const { uploadBlogImage: blogImageUpload } = require('../middleware/uploadMiddleware');

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/

// GET /api/blog — published posts, paginated, ?tag= filter
router.get('/', getAllPosts);

// GET /api/blog/featured — home page preview ke liye
router.get('/featured', getFeaturedPosts);

// GET /api/blog/tags — sab unique tags
router.get('/tags', getAllTags);

/*
|--------------------------------------------------------------------------
| ADMIN ROUTES
|--------------------------------------------------------------------------
*/

// GET /api/blog/admin — drafts + published, admin ke liye
router.get('/admin', protect, getAdminPosts);

// GET /api/blog/admin/:id — single post by ID (edit form ke liye)
router.get('/admin/:id', protect, getPostById);

/*
|--------------------------------------------------------------------------
| IMAGE UPLOAD — must come before /:slug
|--------------------------------------------------------------------------
*/

router.post(
  '/upload-image',
  protect,
  blogImageUpload.single('blogImage'),
  uploadBlogImage
);

/*
|--------------------------------------------------------------------------
| SINGLE POST BY SLUG (public)
|--------------------------------------------------------------------------
*/

router.get('/:slug', getPostBySlug);

/*
|--------------------------------------------------------------------------
| CREATE / UPDATE / DELETE
|--------------------------------------------------------------------------
*/

router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

module.exports = router;
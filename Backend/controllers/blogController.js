const cloudinary = require('../config/cloudinary');
const BlogPost = require('../models/BlogPost');

/*
|--------------------------------------------------------------------------
| Slugify Helper
|--------------------------------------------------------------------------
*/

const slugify = (text) =>
  text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/*
|--------------------------------------------------------------------------
| Ensure Unique Slug
|--------------------------------------------------------------------------
|
| Agar slug already exist karta hai, "-2", "-3" etc append karta hai.
|
*/

const generateUniqueSlug = async (title, excludeId = null) => {
  const baseSlug = slugify(title) || 'post';
  let slug = baseSlug;
  let counter = 2;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const query = { slug };

    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const existing = await BlogPost.findOne(query);

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
};

/*
|--------------------------------------------------------------------------
| Calculate Read Time
|--------------------------------------------------------------------------
|
| Average reading speed ~200 words/min.
|
*/

const calculateReadTime = (content = '') => {
  const words = content
    .replace(/[#*`>_~-]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 200));
};

/*
|--------------------------------------------------------------------------
| Get Cloudinary Image URL from uploaded file
|--------------------------------------------------------------------------
*/

const getCloudinaryImageUrl = (file) => file.path || file.secure_url || null;

/*
|--------------------------------------------------------------------------
| Delete Cloudinary Image
|--------------------------------------------------------------------------
*/

const deleteCloudinaryImage = async (imageUrl) => {
  try {
    if (!imageUrl || !imageUrl.includes('cloudinary.com')) {
      return;
    }

    const urlParts = imageUrl.split('/');
    const uploadIndex = urlParts.indexOf('upload');

    if (uploadIndex === -1) return;

    const afterUpload = urlParts.slice(uploadIndex + 2).join('/');
    const publicId = afterUpload.replace(/\.[^/.]+$/, '');

    if (publicId) {
      await cloudinary.uploader.destroy(publicId, {
        resource_type: 'image',
        invalidate: true,
      });
    }
  } catch (error) {
    console.error('Failed to delete blog image from Cloudinary:', error.message);
  }
};

/*
|--------------------------------------------------------------------------
| Upload Blog Cover Image
|--------------------------------------------------------------------------
| @route   POST /api/blog/upload-image
| @access  Protected Admin
|--------------------------------------------------------------------------
*/

const uploadBlogImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please select a cover image.',
      });
    }

    const imageUrl = getCloudinaryImageUrl(req.file);

    if (!imageUrl) {
      return res.status(500).json({
        success: false,
        message: 'Failed to get image URL from Cloudinary.',
      });
    }

    if (req.body.postId) {
      const post = await BlogPost.findById(req.body.postId);

      if (!post) {
        await deleteCloudinaryImage(imageUrl);

        return res.status(404).json({
          success: false,
          message: 'Blog post not found.',
        });
      }

      const oldImage = post.coverImage;
      post.coverImage = imageUrl;
      await post.save();

      if (oldImage && oldImage !== imageUrl) {
        await deleteCloudinaryImage(oldImage);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Cover image uploaded successfully.',
      data: { image: imageUrl },
    });
  } catch (error) {
    console.error('Upload Blog Image Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to upload cover image.',
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get All Published Posts (Public)
|--------------------------------------------------------------------------
| @route   GET /api/blog
| @access  Public
|--------------------------------------------------------------------------
|
| Query params: ?tag=xyz&page=1&limit=6
|
*/

const getAllPosts = async (req, res) => {
  try {
    const { tag, page = 1, limit = 9 } = req.query;

    const query = { isPublished: true };

    if (tag) {
      query.tags = tag;
    }

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Number(limit) || 9);

    const [posts, total] = await Promise.all([
      BlogPost.find(query)
        .select('-content')
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      BlogPost.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      message: 'Blog posts fetched successfully',
      data: posts,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get All Posts Error:', error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Featured Posts (Public, for home page preview)
|--------------------------------------------------------------------------
| @route   GET /api/blog/featured
| @access  Public
|--------------------------------------------------------------------------
*/

const getFeaturedPosts = async (req, res) => {
  try {
    let posts = await BlogPost.find({
      isPublished: true,
      featured: true,
    })
      .select('-content')
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(3);

    // Fallback: agar koi featured post nahi hai to latest 3 dikhao
    if (posts.length === 0) {
      posts = await BlogPost.find({ isPublished: true })
        .select('-content')
        .sort({ publishedAt: -1, createdAt: -1 })
        .limit(3);
    }

    res.status(200).json({
      success: true,
      message: 'Featured posts fetched successfully',
      data: posts,
    });
  } catch (error) {
    console.error('Get Featured Posts Error:', error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get All Tags (Public)
|--------------------------------------------------------------------------
| @route   GET /api/blog/tags
| @access  Public
|--------------------------------------------------------------------------
*/

const getAllTags = async (req, res) => {
  try {
    const tags = await BlogPost.distinct('tags', { isPublished: true });

    res.status(200).json({
      success: true,
      message: 'Tags fetched successfully',
      data: tags,
    });
  } catch (error) {
    console.error('Get All Tags Error:', error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get All Posts For Admin (drafts + published)
|--------------------------------------------------------------------------
| @route   GET /api/blog/admin
| @access  Protected Admin
|--------------------------------------------------------------------------
*/

const getAdminPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find()
      .select('-content')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Admin blog posts fetched successfully',
      data: posts,
    });
  } catch (error) {
    console.error('Get Admin Posts Error:', error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Single Post By Slug (Public) — increments view counter
|--------------------------------------------------------------------------
| @route   GET /api/blog/:slug
| @access  Public
|--------------------------------------------------------------------------
*/

const getPostBySlug = async (req, res) => {
  try {
    const post = await BlogPost.findOne({
      slug: req.params.slug,
      isPublished: true,
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    post.views += 1;
    await post.save();

    res.status(200).json({
      success: true,
      message: 'Blog post fetched successfully',
      data: post,
    });
  } catch (error) {
    console.error('Get Post By Slug Error:', error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Single Post By ID (Admin — editing ke liye, draft bhi mil jaye)
|--------------------------------------------------------------------------
| @route   GET /api/blog/admin/:id
| @access  Protected Admin
|--------------------------------------------------------------------------
*/

const getPostById = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Blog post fetched successfully',
      data: post,
    });
  } catch (error) {
    console.error('Get Post By ID Error:', error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Create Post
|--------------------------------------------------------------------------
| @route   POST /api/blog
| @access  Protected Admin
|--------------------------------------------------------------------------
*/

const createPost = async (req, res) => {
  try {
    const {
      title,
      excerpt,
      content,
      coverImage,
      tags,
      isPublished,
      featured,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Blog title is required',
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Blog content is required',
      });
    }

    const slug = await generateUniqueSlug(title);
    const published = isPublished === true || isPublished === 'true';

    const post = await BlogPost.create({
      title: title.trim(),
      slug,
      excerpt: excerpt?.trim() || content.trim().slice(0, 160),
      content,
      coverImage: coverImage?.trim() || '',
      tags: Array.isArray(tags) ? tags : [],
      readTime: calculateReadTime(content),
      isPublished: published,
      publishedAt: published ? new Date() : null,
      featured: featured === true || featured === 'true',
    });

    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: post,
    });
  } catch (error) {
    console.error('Create Post Error:', error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Update Post
|--------------------------------------------------------------------------
| @route   PUT /api/blog/:id
| @access  Protected Admin
|--------------------------------------------------------------------------
*/

const updatePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    if (req.body.title !== undefined && req.body.title.trim() !== post.title) {
      post.title = req.body.title.trim();
      post.slug = await generateUniqueSlug(post.title, post._id);
    }

    if (req.body.excerpt !== undefined) {
      post.excerpt = req.body.excerpt.trim();
    }

    if (req.body.content !== undefined) {
      post.content = req.body.content;
      post.readTime = calculateReadTime(req.body.content);
    }

    if (req.body.coverImage !== undefined) {
      post.coverImage = req.body.coverImage.trim();
    }

    if (req.body.tags !== undefined) {
      post.tags = Array.isArray(req.body.tags) ? req.body.tags : [];
    }

    if (req.body.featured !== undefined) {
      post.featured = req.body.featured === true || req.body.featured === 'true';
    }

    if (req.body.isPublished !== undefined) {
      const nowPublished =
        req.body.isPublished === true || req.body.isPublished === 'true';

      // Pehli baar publish hone par hi publishedAt set karo
      if (nowPublished && !post.isPublished) {
        post.publishedAt = new Date();
      }

      post.isPublished = nowPublished;
    }

    const updatedPost = await post.save();

    res.status(200).json({
      success: true,
      message: 'Blog post updated successfully',
      data: updatedPost,
    });
  } catch (error) {
    console.error('Update Post Error:', error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Delete Post
|--------------------------------------------------------------------------
| @route   DELETE /api/blog/:id
| @access  Protected Admin
|--------------------------------------------------------------------------
*/

const deletePost = async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    if (post.coverImage) {
      await deleteCloudinaryImage(post.coverImage);
    }

    res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully',
      data: {},
    });
  } catch (error) {
    console.error('Delete Post Error:', error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  uploadBlogImage,
  getAllPosts,
  getFeaturedPosts,
  getAllTags,
  getAdminPosts,
  getPostBySlug,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
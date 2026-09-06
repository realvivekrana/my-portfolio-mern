const Project = require('../models/Project');

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
*/

const generateUniqueSlug = async (title, excludeId = null) => {
  const baseSlug = slugify(title) || 'project';
  let slug = baseSlug;
  let counter = 2;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const query = { slug };

    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const existing = await Project.findOne(query);

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: 'Projects fetched successfully',
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get featured projects
// @route   GET /api/projects/featured
// @access  Public
const getFeaturedProjects = async (req, res) => {
  try {
    const projects = await Project.find({ featured: true }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: 'Featured projects fetched successfully',
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single project case study by slug
// @route   GET /api/projects/case-study/:slug
// @access  Public
//
// NOTE: This must be registered BEFORE /:id in routes so Express
// doesn't treat "case-study" as a project ID.
const getProjectBySlug = async (req, res) => {
  try {
    const project = await Project.findOne({
      slug: req.params.slug,
      hasCaseStudy: true,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Case study not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project case study fetched successfully',
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
// @access  Public
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project fetched successfully',
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Admin (protected)
const createProject = async (req, res) => {
  try {
    const payload = { ...req.body };

    // Agar case study enable hai to slug generate karo
    if (payload.hasCaseStudy === true || payload.hasCaseStudy === 'true') {
      payload.slug = await generateUniqueSlug(payload.title || 'project');
    } else {
      delete payload.slug;
    }

    const project = await Project.create(payload);
    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Admin (protected)
const updateProject = async (req, res) => {
  try {
    const existing = await Project.findById(req.params.id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    const payload = { ...req.body };
    const wantsCaseStudy = payload.hasCaseStudy === true || payload.hasCaseStudy === 'true';

    if (wantsCaseStudy) {
      // Agar pehle se slug nahi hai ya title badla hai, naya unique slug banao
      if (!existing.slug || (payload.title && payload.title !== existing.title)) {
        payload.slug = await generateUniqueSlug(payload.title || existing.title, existing._id);
      }
    } else if (payload.hasCaseStudy !== undefined) {
      // Case study disable ki gayi — slug hata do
      payload.slug = undefined;
    }

    const project = await Project.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Admin (protected)
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllProjects,
  getFeaturedProjects,
  getProjectBySlug,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
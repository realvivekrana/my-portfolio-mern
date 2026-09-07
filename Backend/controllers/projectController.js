const Project = require('../models/Project');
const { logAudit, diffChangedFields } = require('../utils/auditLogger');

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
    const projects = await Project.find({ status: 'published' }).sort({
      displayOrder: 1,
      createdAt: -1,
    });
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

// @desc    Get all projects for admin (includes drafts)
// @route   GET /api/projects/admin
// @access  Admin (protected)
const getAdminProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({
      displayOrder: 1,
      createdAt: -1,
    });
    res.status(200).json({
      success: true,
      message: 'Admin projects fetched successfully',
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
    const projects = await Project.find({ featured: true, status: 'published' }).sort({
      displayOrder: 1,
      createdAt: -1,
    });
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

    await logAudit({
      req,
      action: 'create',
      resourceType: 'Project',
      resourceId: project._id,
      resourceLabel: project.title,
    });

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

    const beforeSnapshot = existing.toObject();

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

    const changes = diffChangedFields(beforeSnapshot, project.toObject());

    if (
      payload.status !== undefined &&
      beforeSnapshot.status !== project.status
    ) {
      await logAudit({
        req,
        action: project.status === 'published' ? 'publish' : 'unpublish',
        resourceType: 'Project',
        resourceId: project._id,
        resourceLabel: project.title,
      });
    } else if (changes.length > 0) {
      await logAudit({
        req,
        action: 'update',
        resourceType: 'Project',
        resourceId: project._id,
        resourceLabel: project.title,
        changes,
      });
    }

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

// @desc    Reorder projects
// @route   PATCH /api/projects/reorder
// @access  Admin (protected)
// Body: { order: [{ id: '...', displayOrder: 0 }, ...] }
const reorderProjects = async (req, res) => {
  try {
    const { order } = req.body;

    if (!Array.isArray(order) || order.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'order array is required',
      });
    }

    await Promise.all(
      order.map(({ id, displayOrder }) =>
        Project.findByIdAndUpdate(id, { displayOrder })
      )
    );

    await logAudit({
      req,
      action: 'reorder',
      resourceType: 'Project',
      resourceLabel: `${order.length} projects reordered`,
    });

    const projects = await Project.find().sort({
      displayOrder: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      message: 'Projects reordered successfully',
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
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

    await logAudit({
      req,
      action: 'delete',
      resourceType: 'Project',
      resourceId: project._id,
      resourceLabel: project.title,
    });

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
  getAdminProjects,
  getFeaturedProjects,
  getProjectBySlug,
  getProjectById,
  createProject,
  updateProject,
  reorderProjects,
  deleteProject,
};
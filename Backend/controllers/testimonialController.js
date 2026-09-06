const cloudinary = require('../config/cloudinary');
const Testimonial = require('../models/Testimonial');

/*
|--------------------------------------------------------------------------
| Get Cloudinary Image URL from uploaded file
|--------------------------------------------------------------------------
*/

const getCloudinaryImageUrl = (file) => file.path || file.secure_url || null;

/*
|--------------------------------------------------------------------------
| Delete Cloudinary Avatar
|--------------------------------------------------------------------------
*/

const deleteCloudinaryAvatar = async (imageUrl) => {
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
    console.error('Failed to delete testimonial avatar from Cloudinary:', error.message);
  }
};

/*
|--------------------------------------------------------------------------
| Upload Testimonial Avatar
|--------------------------------------------------------------------------
| @route   POST /api/testimonials/upload-image
| @access  Protected Admin
|--------------------------------------------------------------------------
*/

const uploadTestimonialAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please select an avatar image.',
      });
    }

    const imageUrl = getCloudinaryImageUrl(req.file);

    if (!imageUrl) {
      return res.status(500).json({
        success: false,
        message: 'Failed to get image URL from Cloudinary.',
      });
    }

    if (req.body.testimonialId) {
      const testimonial = await Testimonial.findById(req.body.testimonialId);

      if (!testimonial) {
        await deleteCloudinaryAvatar(imageUrl);

        return res.status(404).json({
          success: false,
          message: 'Testimonial not found.',
        });
      }

      const oldAvatar = testimonial.avatar;
      testimonial.avatar = imageUrl;
      await testimonial.save();

      if (oldAvatar && oldAvatar !== imageUrl) {
        await deleteCloudinaryAvatar(oldAvatar);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Avatar uploaded successfully.',
      data: { image: imageUrl },
    });
  } catch (error) {
    console.error('Upload Testimonial Avatar Error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to upload avatar.',
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get All Testimonials (Public)
|--------------------------------------------------------------------------
| @route   GET /api/testimonials
| @access  Public
|--------------------------------------------------------------------------
*/

const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ isVisible: true }).sort({
      displayOrder: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      message: 'Testimonials fetched successfully',
      data: testimonials,
    });
  } catch (error) {
    console.error('Get All Testimonials Error:', error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Featured Testimonials (Public)
|--------------------------------------------------------------------------
| @route   GET /api/testimonials/featured
| @access  Public
|--------------------------------------------------------------------------
*/

const getFeaturedTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({
      featured: true,
      isVisible: true,
    }).sort({ displayOrder: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Featured testimonials fetched successfully',
      data: testimonials,
    });
  } catch (error) {
    console.error('Get Featured Testimonials Error:', error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get All Testimonials For Admin
|--------------------------------------------------------------------------
| @route   GET /api/testimonials/admin
| @access  Protected Admin
|--------------------------------------------------------------------------
*/

const getAdminTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({
      displayOrder: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      message: 'Admin testimonials fetched successfully',
      data: testimonials,
    });
  } catch (error) {
    console.error('Get Admin Testimonials Error:', error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Single Testimonial
|--------------------------------------------------------------------------
| @route   GET /api/testimonials/:id
| @access  Public
|--------------------------------------------------------------------------
*/

const getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Testimonial fetched successfully',
      data: testimonial,
    });
  } catch (error) {
    console.error('Get Testimonial Error:', error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Create Testimonial
|--------------------------------------------------------------------------
| @route   POST /api/testimonials
| @access  Protected Admin
|--------------------------------------------------------------------------
*/

const createTestimonial = async (req, res) => {
  try {
    const {
      name,
      role,
      company,
      message,
      avatar,
      rating,
      profileUrl,
      featured,
      displayOrder,
      isVisible,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Name is required',
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Testimonial message is required',
      });
    }

    const testimonial = await Testimonial.create({
      name: name.trim(),
      role: role?.trim() || '',
      company: company?.trim() || '',
      message: message.trim(),
      avatar: avatar?.trim() || '',
      rating: Number(rating) || 5,
      profileUrl: profileUrl?.trim() || '',
      featured: featured === true || featured === 'true',
      displayOrder: Number(displayOrder) || 0,
      isVisible: !(isVisible === false || isVisible === 'false'),
    });

    res.status(201).json({
      success: true,
      message: 'Testimonial created successfully',
      data: testimonial,
    });
  } catch (error) {
    console.error('Create Testimonial Error:', error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Update Testimonial
|--------------------------------------------------------------------------
| @route   PUT /api/testimonials/:id
| @access  Protected Admin
|--------------------------------------------------------------------------
*/

const updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found',
      });
    }

    if (req.body.name !== undefined) testimonial.name = req.body.name.trim();
    if (req.body.role !== undefined) testimonial.role = req.body.role.trim();
    if (req.body.company !== undefined) testimonial.company = req.body.company.trim();
    if (req.body.message !== undefined) testimonial.message = req.body.message.trim();
    if (req.body.avatar !== undefined) testimonial.avatar = req.body.avatar.trim();
    if (req.body.rating !== undefined) testimonial.rating = Number(req.body.rating) || 5;
    if (req.body.profileUrl !== undefined) testimonial.profileUrl = req.body.profileUrl.trim();

    if (req.body.featured !== undefined) {
      testimonial.featured = req.body.featured === true || req.body.featured === 'true';
    }

    if (req.body.displayOrder !== undefined) {
      testimonial.displayOrder = Number(req.body.displayOrder) || 0;
    }

    if (req.body.isVisible !== undefined) {
      testimonial.isVisible = !(
        req.body.isVisible === false || req.body.isVisible === 'false'
      );
    }

    const updatedTestimonial = await testimonial.save();

    res.status(200).json({
      success: true,
      message: 'Testimonial updated successfully',
      data: updatedTestimonial,
    });
  } catch (error) {
    console.error('Update Testimonial Error:', error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Delete Testimonial
|--------------------------------------------------------------------------
| @route   DELETE /api/testimonials/:id
| @access  Protected Admin
|--------------------------------------------------------------------------
*/

const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found',
      });
    }

    if (testimonial.avatar) {
      await deleteCloudinaryAvatar(testimonial.avatar);
    }

    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully',
      data: {},
    });
  } catch (error) {
    console.error('Delete Testimonial Error:', error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  uploadTestimonialAvatar,
  getAllTestimonials,
  getFeaturedTestimonials,
  getAdminTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
const fs = require('fs');
const path = require('path');

const cloudinary = require('../config/cloudinary');
const Certificate = require('../models/Certificate');

/*
|--------------------------------------------------------------------------
| Get Cloudinary Image URL from uploaded file
|--------------------------------------------------------------------------
|
| multer-storage-cloudinary sets:
|   file.path       → secure_url  (always present)
|   file.filename   → public_id   (always present)
|
|--------------------------------------------------------------------------
*/

const getCloudinaryImageUrl = (file) => {
  // secure_url is stored in file.path by multer-storage-cloudinary
  return file.path || file.secure_url || null;
};

const getCloudinaryPublicId = (file) => {
  return file.filename || file.public_id || null;
};

/*
|--------------------------------------------------------------------------
| Delete Cloudinary Certificate Image
|--------------------------------------------------------------------------
*/

const deleteCloudinaryCertificateImage = async (imageUrl) => {
  try {
    if (!imageUrl || !imageUrl.includes('cloudinary.com')) {
      return;
    }

    // Extract public_id from the Cloudinary URL
    // URL format: https://res.cloudinary.com/<cloud>/image/upload/v<ver>/<folder>/<public_id>.<ext>
    const urlParts = imageUrl.split('/');
    const uploadIndex = urlParts.indexOf('upload');

    if (uploadIndex === -1) return;

    // Everything after 'upload/v<version>/' is folder/public_id.ext
    const afterUpload = urlParts.slice(uploadIndex + 2).join('/');
    const publicId = afterUpload.replace(/\.[^/.]+$/, ''); // remove extension

    if (publicId) {
      await cloudinary.uploader.destroy(publicId, {
        resource_type: 'image',
        invalidate: true,
      });
    }
  } catch (error) {
    console.error(
      'Failed to delete certificate image from Cloudinary:',
      error.message
    );
  }
};

/*
|--------------------------------------------------------------------------
| Upload Certificate Image
|--------------------------------------------------------------------------
| @route   POST /api/certificates/upload-image
| @access  Protected Admin
|--------------------------------------------------------------------------
|
| The frontend can upload an image before the certificate itself is saved.
| If certificateId is supplied, the existing certificate image is updated
| immediately. Otherwise the new image URL is simply returned to the
| frontend, which can save it with the new certificate.
|
|--------------------------------------------------------------------------
*/

const uploadCertificateImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please select a certificate image.',
      });
    }

    // multer-storage-cloudinary puts the secure_url in file.path
    const imageUrl = getCloudinaryImageUrl(req.file);

    if (!imageUrl) {
      return res.status(500).json({
        success: false,
        message: 'Failed to get image URL from Cloudinary.',
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Update Existing Certificate When Editing
    |--------------------------------------------------------------------------
    */

    if (req.body.certificateId) {
      const certificate = await Certificate.findById(
        req.body.certificateId
      );

      if (!certificate) {
        // Delete the just-uploaded Cloudinary image since cert not found
        await deleteCloudinaryCertificateImage(imageUrl);

        return res.status(404).json({
          success: false,
          message: 'Certificate not found.',
        });
      }

      const oldImage = certificate.image;

      certificate.image = imageUrl;

      await certificate.save();

      // Delete old image from Cloudinary
      if (oldImage && oldImage !== imageUrl) {
        await deleteCloudinaryCertificateImage(oldImage);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Certificate image uploaded successfully.',
      data: {
        image: imageUrl,
      },
    });
  } catch (error) {
    console.error(
      'Upload Certificate Image Error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Failed to upload certificate image.',
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get All Certificates
|--------------------------------------------------------------------------
| @route   GET /api/certificates
| @access  Public
|--------------------------------------------------------------------------
*/

const getAllCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({
      isVisible: true,
    }).sort({
      displayOrder: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      message: 'Certificates fetched successfully',
      data: certificates,
    });
  } catch (error) {
    console.error(
      'Get All Certificates Error:',
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get All Certificates For Admin
|--------------------------------------------------------------------------
| @route   GET /api/certificates/admin
| @access  Protected Admin
|--------------------------------------------------------------------------
|
| Admin ko hidden certificates bhi dikhne chahiye.
|
*/

const getAdminCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find().sort({
      displayOrder: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      message:
        'Admin certificates fetched successfully',
      data: certificates,
    });
  } catch (error) {
    console.error(
      'Get Admin Certificates Error:',
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Featured Certificates
|--------------------------------------------------------------------------
| @route   GET /api/certificates/featured
| @access  Public
|--------------------------------------------------------------------------
*/

const getFeaturedCertificates = async (
  req,
  res
) => {
  try {
    const certificates =
      await Certificate.find({
        featured: true,
        isVisible: true,
      }).sort({
        displayOrder: 1,
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      message:
        'Featured certificates fetched successfully',
      data: certificates,
    });
  } catch (error) {
    console.error(
      'Get Featured Certificates Error:',
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Single Certificate
|--------------------------------------------------------------------------
| @route   GET /api/certificates/:id
| @access  Public
|--------------------------------------------------------------------------
*/

const getCertificateById = async (
  req,
  res
) => {
  try {
    const certificate =
      await Certificate.findById(
        req.params.id
      );

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found',
      });
    }

    res.status(200).json({
      success: true,
      message:
        'Certificate fetched successfully',
      data: certificate,
    });
  } catch (error) {
    console.error(
      'Get Certificate Error:',
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Create Certificate
|--------------------------------------------------------------------------
| @route   POST /api/certificates
| @access  Protected Admin
|--------------------------------------------------------------------------
*/

const createCertificate = async (
  req,
  res
) => {
  try {
    const {
      title,
      issuer,
      issueDate,
      description,
      image,
      credentialUrl,
      skills,
      featured,
      displayOrder,
      isVisible,
    } = req.body;

    /*
    |--------------------------------------------------------------------------
    | Basic Validation
    |--------------------------------------------------------------------------
    */

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message:
          'Certificate title is required',
      });
    }

    if (!issuer || !issuer.trim()) {
      return res.status(400).json({
        success: false,
        message:
          'Certificate issuer is required',
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Create Certificate
    |--------------------------------------------------------------------------
    */

    const certificate =
      await Certificate.create({
        title: title.trim(),

        issuer: issuer.trim(),

        issueDate:
          issueDate?.trim() || '',

        description:
          description?.trim() || '',

        image:
          image?.trim() || '',

        credentialUrl:
          credentialUrl?.trim() || '',

        skills: Array.isArray(skills)
          ? skills
          : [],

        featured:
          featured === true ||
          featured === 'true',

        displayOrder:
          Number(displayOrder) || 0,

        isVisible:
          isVisible === false ||
          isVisible === 'false'
            ? false
            : true,
      });

    res.status(201).json({
      success: true,
      message:
        'Certificate created successfully',
      data: certificate,
    });
  } catch (error) {
    console.error(
      'Create Certificate Error:',
      error
    );

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Update Certificate
|--------------------------------------------------------------------------
| @route   PUT /api/certificates/:id
| @access  Protected Admin
|--------------------------------------------------------------------------
*/

const updateCertificate = async (
  req,
  res
) => {
  try {
    const certificate =
      await Certificate.findById(
        req.params.id
      );

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found',
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Update Only Provided Fields
    |--------------------------------------------------------------------------
    */

    if (req.body.title !== undefined) {
      certificate.title =
        req.body.title.trim();
    }

    if (req.body.issuer !== undefined) {
      certificate.issuer =
        req.body.issuer.trim();
    }

    if (req.body.issueDate !== undefined) {
      certificate.issueDate =
        req.body.issueDate.trim();
    }

    if (
      req.body.description !== undefined
    ) {
      certificate.description =
        req.body.description.trim();
    }

    if (req.body.image !== undefined) {
      certificate.image =
        req.body.image.trim();
    }

    if (
      req.body.credentialUrl !==
      undefined
    ) {
      certificate.credentialUrl =
        req.body.credentialUrl.trim();
    }

    if (req.body.skills !== undefined) {
      certificate.skills =
        Array.isArray(req.body.skills)
          ? req.body.skills
          : [];
    }

    if (req.body.featured !== undefined) {
      certificate.featured =
        req.body.featured === true ||
        req.body.featured === 'true';
    }

    if (
      req.body.displayOrder !==
      undefined
    ) {
      certificate.displayOrder =
        Number(req.body.displayOrder) || 0;
    }

    if (
      req.body.isVisible !== undefined
    ) {
      certificate.isVisible =
        !(
          req.body.isVisible === false ||
          req.body.isVisible === 'false'
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Save
    |--------------------------------------------------------------------------
    */

    const updatedCertificate =
      await certificate.save();

    res.status(200).json({
      success: true,
      message:
        'Certificate updated successfully',
      data: updatedCertificate,
    });
  } catch (error) {
    console.error(
      'Update Certificate Error:',
      error
    );

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Delete Certificate
|--------------------------------------------------------------------------
| @route   DELETE /api/certificates/:id
| @access  Protected Admin
|--------------------------------------------------------------------------
*/

const deleteCertificate = async (
  req,
  res
) => {
  try {
    const certificate =
      await Certificate.findByIdAndDelete(
        req.params.id
      );

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found',
      });
    }

    res.status(200).json({
      success: true,
      message:
        'Certificate deleted successfully',
      data: {},
    });
  } catch (error) {
    console.error(
      'Delete Certificate Error:',
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Export Controllers
|--------------------------------------------------------------------------
*/

module.exports = {
  uploadCertificateImage,
  getAllCertificates,
  getAdminCertificates,
  getFeaturedCertificates,
  getCertificateById,
  createCertificate,
  updateCertificate,
  deleteCertificate,
};
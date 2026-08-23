const cloudinary = require('../config/cloudinary');

const PortfolioContent = require('../models/PortfolioContent');

/*
|--------------------------------------------------------------------------
| Cloudinary Helpers
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Get Cloudinary Public ID
|--------------------------------------------------------------------------
|
| multer-storage-cloudinary provides:
|
| req.file.public_id
| req.file.path
| req.file.secure_url
|
|--------------------------------------------------------------------------
*/

const getCloudinaryPublicId = (file) => {
  if (!file) {
    return null;
  }

  return (
    file.public_id ||
    file.publicId ||
    null
  );
};

/*
|--------------------------------------------------------------------------
| Delete Cloudinary File
|--------------------------------------------------------------------------
*/

const deleteCloudinaryFile = async (
  publicId,
  resourceType = 'image'
) => {
  try {
    if (!publicId) {
      return;
    }

    await cloudinary.uploader.destroy(
      publicId,
      {
        resource_type:
          resourceType,

        invalidate: true,
      }
    );
  } catch (error) {
    console.error(
      'Failed to delete Cloudinary file:',
      error.message
    );
  }
};

/*
|--------------------------------------------------------------------------
| Generate Secure Resume URL
|--------------------------------------------------------------------------
|
| Resume is stored as a RAW resource on Cloudinary.
|
| We generate a signed URL instead of storing a permanent
| public URL in the database.
|
|--------------------------------------------------------------------------
*/

const getResumeDeliveryUrl = (
  publicId
) => {
  if (!publicId) {
    return null;
  }

  return cloudinary.url(
    publicId,
    {
      resource_type: 'raw',

      type: 'upload',

      secure: true,

      sign_url: true,
    }
  );
};

/*
|--------------------------------------------------------------------------
| Upload Resume
|--------------------------------------------------------------------------
| @route   POST /api/portfolio/upload/resume
| @access  Protected Admin
|--------------------------------------------------------------------------
*/

const uploadResume = async (
  req,
  res
) => {
  try {
    /*
    |--------------------------------------------------------------------------
    | Check File
    |--------------------------------------------------------------------------
    */

    if (!req.file) {
      return res.status(400).json({
        success: false,

        message:
          'Please select a PDF resume file.',
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Validate PDF
    |--------------------------------------------------------------------------
    */

    const isPdf =
      req.file.mimetype ===
        'application/pdf' ||
      (
        req.file.originalname &&
        req.file.originalname
          .toLowerCase()
          .endsWith('.pdf')
      );

    if (!isPdf) {
      /*
      |--------------------------------------------------------------------------
      | Delete Invalid Cloudinary Upload
      |--------------------------------------------------------------------------
      */

      const uploadedPublicId =
        getCloudinaryPublicId(
          req.file
        );

      if (uploadedPublicId) {
        await deleteCloudinaryFile(
          uploadedPublicId,
          'raw'
        );
      }

      return res.status(400).json({
        success: false,

        message:
          'Only PDF resume files are allowed.',
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Find Portfolio
    |--------------------------------------------------------------------------
    */

    let portfolio =
      await PortfolioContent.findOne({
        key: 'main',
      });

    if (!portfolio) {
      portfolio =
        await PortfolioContent.create({
          key: 'main',
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Old Resume Public ID
    |--------------------------------------------------------------------------
    |
    | We store Cloudinary public_id in resume.fileName.
    |
    |--------------------------------------------------------------------------
    */

    const oldResumePublicId =
      portfolio.resume?.fileName ||
      null;

    /*
    |--------------------------------------------------------------------------
    | New Cloudinary Public ID
    |--------------------------------------------------------------------------
    */

    const newResumePublicId =
      getCloudinaryPublicId(
        req.file
      );

    if (!newResumePublicId) {
      return res.status(500).json({
        success: false,

        message:
          'Cloudinary upload completed but public ID was not returned.',
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Save Resume Metadata
    |--------------------------------------------------------------------------
    */

    portfolio.resume.fileName =
      newResumePublicId;

    portfolio.resume.originalName =
      req.file.originalname ||
      'Resume.pdf';

    portfolio.resume.uploadedAt =
      new Date();

    /*
    |--------------------------------------------------------------------------
    | IMPORTANT
    |--------------------------------------------------------------------------
    |
    | We DO NOT store the permanent Cloudinary URL.
    |
    | The URL is generated only when resume is requested.
    |
    |--------------------------------------------------------------------------
    */

    portfolio.resume.url =
      '/api/portfolio/resume/public';

    await portfolio.save();

    /*
    |--------------------------------------------------------------------------
    | Delete Previous Resume
    |--------------------------------------------------------------------------
    */

    if (
      oldResumePublicId &&
      oldResumePublicId !==
        newResumePublicId
    ) {
      await deleteCloudinaryFile(
        oldResumePublicId,
        'raw'
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Generate Response URL
    |--------------------------------------------------------------------------
    */

    const resumeUrl =
      getResumeDeliveryUrl(
        newResumePublicId
      );

    return res.status(200).json({
      success: true,

      message:
        'Resume uploaded successfully.',

      data: {
        resume: {
          exists: true,

          fileName:
            newResumePublicId,

          originalName:
            portfolio.resume.originalName,

          uploadedAt:
            portfolio.resume.uploadedAt,

          url:
            '/api/portfolio/resume/public',

          deliveryUrl:
            resumeUrl,
        },
      },
    });
  } catch (error) {
    console.error(
      'Upload Resume Error:',
      error
    );

    /*
    |--------------------------------------------------------------------------
    | Cleanup Newly Uploaded Cloudinary File
    |--------------------------------------------------------------------------
    */

    const uploadedPublicId =
      getCloudinaryPublicId(
        req.file
      );

    if (uploadedPublicId) {
      await deleteCloudinaryFile(
        uploadedPublicId,
        'raw'
      );
    }

    return res.status(500).json({
      success: false,

      message:
        'Failed to upload resume.',

      error:
        error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET PUBLIC RESUME
|--------------------------------------------------------------------------
| @route   GET /api/portfolio/resume/public
| @access  Public
|--------------------------------------------------------------------------
|
| Public portfolio:
|   Resume accessible
|
| Private portfolio:
|   Resume blocked
|
|--------------------------------------------------------------------------
*/

const getPublicResume = async (
  req,
  res
) => {
  try {
    /*
    |--------------------------------------------------------------------------
    | Find Portfolio
    |--------------------------------------------------------------------------
    */

    const portfolio =
      await PortfolioContent.findOne({
        key: 'main',
      });

    if (!portfolio) {
      return res.status(404).json({
        success: false,

        message:
          'Portfolio not found.',
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Portfolio Visibility
    |--------------------------------------------------------------------------
    */

    const visibility =
      portfolio.settings
        ?.portfolioVisibility ||
      'public';

    /*
    |--------------------------------------------------------------------------
    | PRIVATE PORTFOLIO
    |--------------------------------------------------------------------------
    */

    if (
      visibility === 'private'
    ) {
      return res.status(403).json({
        success: false,

        message:
          'Resume is currently private.',
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Resume Exists Check
    |--------------------------------------------------------------------------
    */

    const publicId =
      portfolio.resume?.fileName;

    if (!publicId) {
      return res.status(404).json({
        success: false,

        message:
          'No resume has been uploaded yet.',
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Generate Signed Cloudinary URL
    |--------------------------------------------------------------------------
    */

    const resumeUrl =
      getResumeDeliveryUrl(
        publicId
      );

    if (!resumeUrl) {
      return res.status(404).json({
        success: false,

        message:
          'Resume file could not be located.',
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Redirect To Cloudinary
    |--------------------------------------------------------------------------
    */

    return res.redirect(
      resumeUrl
    );
  } catch (error) {
    console.error(
      'Get Public Resume Error:',
      error
    );

    return res.status(500).json({
      success: false,

      message:
        'Failed to load public resume.',

      error:
        error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET PROTECTED RESUME
|--------------------------------------------------------------------------
| @route   GET /api/portfolio/upload/resume
| @access  Protected Admin
|--------------------------------------------------------------------------
*/

const getProtectedResume =
  async (
    req,
    res
  ) => {
    try {
      /*
      |--------------------------------------------------------------------------
      | Find Portfolio
      |--------------------------------------------------------------------------
      */

      const portfolio =
        await PortfolioContent.findOne({
          key: 'main',
        });

      if (!portfolio) {
        return res.status(404).json({
          success: false,

          message:
            'Portfolio not found.',
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Resume Public ID
      |--------------------------------------------------------------------------
      */

      const publicId =
        portfolio.resume?.fileName;

      if (!publicId) {
        return res.status(404).json({
          success: false,

          message:
            'No resume has been uploaded yet.',
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Generate Signed URL
      |--------------------------------------------------------------------------
      */

      const resumeUrl =
        getResumeDeliveryUrl(
          publicId
        );

      if (!resumeUrl) {
        return res.status(404).json({
          success: false,

          message:
            'Resume file could not be located.',
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Admin Resume Access
      |--------------------------------------------------------------------------
      */

      return res.redirect(
        resumeUrl
      );
    } catch (error) {
      console.error(
        'Get Protected Resume Error:',
        error
      );

      return res.status(500).json({
        success: false,

        message:
          'Failed to load resume.',

        error:
          error.message,
      });
    }
  };

/*
|--------------------------------------------------------------------------
| GET RESUME INFO
|--------------------------------------------------------------------------
| @route   GET /api/portfolio/upload/resume/info
| @access  Protected Admin
|--------------------------------------------------------------------------
*/

const getResumeInfo =
  async (
    req,
    res
  ) => {
    try {
      /*
      |--------------------------------------------------------------------------
      | Find Portfolio
      |--------------------------------------------------------------------------
      */

      const portfolio =
        await PortfolioContent.findOne({
          key: 'main',
        });

      /*
      |--------------------------------------------------------------------------
      | No Resume
      |--------------------------------------------------------------------------
      */

      if (
        !portfolio ||
        !portfolio.resume ||
        !portfolio.resume.fileName
      ) {
        return res.status(200).json({
          success: true,

          data: {
            exists: false,

            resume: null,
          },
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Cloudinary Public ID
      |--------------------------------------------------------------------------
      */

      const publicId =
        portfolio.resume.fileName;

      /*
      |--------------------------------------------------------------------------
      | Generate Signed URL
      |--------------------------------------------------------------------------
      */

      const resumeUrl =
        getResumeDeliveryUrl(
          publicId
        );

      /*
      |--------------------------------------------------------------------------
      | Response
      |--------------------------------------------------------------------------
      |
      | Size is not read from local filesystem anymore.
      |
      | Cloudinary remains the source of truth.
      |
      |--------------------------------------------------------------------------
      */

      return res.status(200).json({
        success: true,

        data: {
          exists: true,

          resume: {
            fileName:
              publicId,

            originalName:
              portfolio.resume
                .originalName ||
              'Resume.pdf',

            uploadedAt:
              portfolio.resume
                .uploadedAt,

            size: null,

            sizeFormatted:
              'Stored on Cloudinary',

            url:
              '/api/portfolio/upload/resume',

            deliveryUrl:
              resumeUrl,
          },
        },
      });
    } catch (error) {
      console.error(
        'Get Resume Info Error:',
        error
      );

      return res.status(500).json({
        success: false,

        message:
          'Failed to fetch resume information.',

        error:
          error.message,
      });
    }
  };

/*
|--------------------------------------------------------------------------
| Upload Profile Image
|--------------------------------------------------------------------------
| @route   POST /api/portfolio/upload/profile-image
| @access  Protected Admin
|--------------------------------------------------------------------------
*/

const uploadProfileImage =
  async (
    req,
    res
  ) => {
    try {
      /*
      |--------------------------------------------------------------------------
      | Check File
      |--------------------------------------------------------------------------
      */

      if (!req.file) {
        return res.status(400).json({
          success: false,

          message:
            'Please select a profile image.',
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Find Portfolio
      |--------------------------------------------------------------------------
      */

      let portfolio =
        await PortfolioContent.findOne({
          key: 'main',
        });

      if (!portfolio) {
        portfolio =
          await PortfolioContent.create({
            key: 'main',
          });
      }

      /*
      |--------------------------------------------------------------------------
      | Cloudinary Image URL
      |--------------------------------------------------------------------------
      */

      const imageUrl =
        req.file.secure_url ||
        req.file.path ||
        null;

      if (!imageUrl) {
        return res.status(500).json({
          success: false,

          message:
            'Cloudinary image URL was not returned.',
        });
      }

      /*
      |--------------------------------------------------------------------------
      | Save Profile Image
      |--------------------------------------------------------------------------
      */

      portfolio.hero.profileImage =
        imageUrl;

      await portfolio.save();

      /*
      |--------------------------------------------------------------------------
      | Response
      |--------------------------------------------------------------------------
      */

      return res.status(200).json({
        success: true,

        message:
          'Profile image uploaded successfully.',

        data: {
          profileImage:
            portfolio.hero
              .profileImage,
        },
      });
    } catch (error) {
      console.error(
        'Upload Profile Image Error:',
        error
      );

      /*
      |--------------------------------------------------------------------------
      | Cleanup New Cloudinary Image
      |--------------------------------------------------------------------------
      */

      const uploadedPublicId =
        getCloudinaryPublicId(
          req.file
        );

      if (uploadedPublicId) {
        await deleteCloudinaryFile(
          uploadedPublicId,
          'image'
        );
      }

      return res.status(500).json({
        success: false,

        message:
          'Failed to upload profile image.',

        error:
          error.message,
      });
    }
  };

/*
|--------------------------------------------------------------------------
| EXPORTS
|--------------------------------------------------------------------------
*/

module.exports = {
  uploadResume,

  getPublicResume,

  getProtectedResume,

  getResumeInfo,

  uploadProfileImage,
};
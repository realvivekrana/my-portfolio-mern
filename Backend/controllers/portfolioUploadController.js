const fs = require('fs');
const path = require('path');

const PortfolioContent = require('../models/PortfolioContent');

/*
|--------------------------------------------------------------------------
| Uploads Directory
|--------------------------------------------------------------------------
*/

const uploadsDirectory = path.join(
  __dirname,
  '../uploads'
);

/*
|--------------------------------------------------------------------------
| Get Public File URL
|--------------------------------------------------------------------------
*/

const getPublicFileUrl = (req, filename) => {
  const protocol = req.protocol;
  const host = req.get('host');

  return `${protocol}://${host}/uploads/${filename}`;
};

/*
|--------------------------------------------------------------------------
| Delete Existing Uploaded File
|--------------------------------------------------------------------------
*/

const deleteUploadedFile = (fileUrl) => {
  try {
    if (!fileUrl) {
      return;
    }

    const fileName = path.basename(fileUrl);

    const filePath = path.join(
      uploadsDirectory,
      fileName
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error(
      'Failed to delete old uploaded file:',
      error.message
    );
  }
};

/*
|--------------------------------------------------------------------------
| Delete File By Filename
|--------------------------------------------------------------------------
*/

const deleteUploadedFileByName = (filename) => {
  try {
    if (!filename) {
      return;
    }

    const safeFileName =
      path.basename(filename);

    const filePath = path.join(
      uploadsDirectory,
      safeFileName
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error(
      'Failed to delete uploaded file:',
      error.message
    );
  }
};

/*
|--------------------------------------------------------------------------
| SEND RESUME FILE
|--------------------------------------------------------------------------
|
| Common helper used by public/admin resume endpoints.
|
|--------------------------------------------------------------------------
*/

const sendResumeFile = async (
  req,
  res,
  portfolio
) => {
  if (
    !portfolio ||
    !portfolio.resume ||
    !portfolio.resume.fileName
  ) {
    return res.status(404).json({
      success: false,
      message:
        'No resume has been uploaded yet.',
    });
  }

  const fileName = path.basename(
    portfolio.resume.fileName
  );

  const filePath = path.join(
    uploadsDirectory,
    fileName
  );

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      success: false,
      message:
        'Resume file not found on server.',
    });
  }

  const originalName =
    portfolio.resume.originalName ||
    'Resume.pdf';

  res.setHeader(
    'Content-Type',
    'application/pdf'
  );

  res.setHeader(
    'Content-Disposition',
    `inline; filename="${originalName.replace(
      /"/g,
      ''
    )}"`
  );

  res.setHeader(
    'Cache-Control',
    'private, no-store, no-cache, must-revalidate'
  );

  res.setHeader(
    'Pragma',
    'no-cache'
  );

  res.setHeader(
    'Expires',
    '0'
  );

  return res.sendFile(filePath);
};

/*
|--------------------------------------------------------------------------
| Upload Resume
|--------------------------------------------------------------------------
| @route   POST /api/portfolio/upload/resume
| @access  Protected Admin
|--------------------------------------------------------------------------
*/

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          'Please select a PDF resume file.',
      });
    }

    const isPdf =
      req.file.mimetype ===
        'application/pdf' ||
      path
        .extname(req.file.originalname || '')
        .toLowerCase() === '.pdf';

    if (!isPdf) {
      deleteUploadedFileByName(
        req.file.filename
      );

      return res.status(400).json({
        success: false,
        message:
          'Only PDF resume files are allowed.',
      });
    }

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

    let oldResumeFileName = null;

    if (
      portfolio.resume &&
      portfolio.resume.fileName
    ) {
      oldResumeFileName =
        portfolio.resume.fileName;
    }

    /*
    |--------------------------------------------------------------------------
    | Save New Resume
    |--------------------------------------------------------------------------
    */

    portfolio.resume.fileName =
      req.file.filename;

    portfolio.resume.originalName =
      req.file.originalname;

    portfolio.resume.uploadedAt =
      new Date();

    /*
    |--------------------------------------------------------------------------
    | IMPORTANT
    |--------------------------------------------------------------------------
    |
    | Public URL is no longer stored as the resume URL.
    |
    | Resume is accessed through:
    |
    | /api/portfolio/resume/public
    |
    |--------------------------------------------------------------------------
    */

    portfolio.resume.url =
      '/api/portfolio/resume/public';

    await portfolio.save();

    /*
    |--------------------------------------------------------------------------
    | Delete Old Resume
    |--------------------------------------------------------------------------
    */

    if (
      oldResumeFileName &&
      oldResumeFileName !== req.file.filename
    ) {
      deleteUploadedFileByName(
        oldResumeFileName
      );
    }

    return res.status(200).json({
      success: true,
      message:
        'Resume uploaded successfully.',
      data: {
        resume: {
          exists: true,
          fileName:
            portfolio.resume.fileName,
          originalName:
            portfolio.resume.originalName,
          uploadedAt:
            portfolio.resume.uploadedAt,
          url:
            '/api/portfolio/resume/public',
        },
      },
    });
  } catch (error) {
    console.error(
      'Upload Resume Error:',
      error
    );

    if (req.file?.filename) {
      deleteUploadedFileByName(
        req.file.filename
      );
    }

    return res.status(500).json({
      success: false,
      message:
        'Failed to upload resume.',
      error: error.message,
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
|   → Resume accessible
|
| Private portfolio:
|   → Resume blocked
|
|--------------------------------------------------------------------------
*/

const getPublicResume = async (
  req,
  res
) => {
  try {
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

    const visibility =
      portfolio.settings?.portfolioVisibility ||
      'public';

    /*
    |--------------------------------------------------------------------------
    | PRIVATE PORTFOLIO
    |--------------------------------------------------------------------------
    */

    if (visibility === 'private') {
      return res.status(403).json({
        success: false,
        message:
          'Resume is currently private.',
      });
    }

    /*
    |--------------------------------------------------------------------------
    | PUBLIC PORTFOLIO
    |--------------------------------------------------------------------------
    */

    return sendResumeFile(
      req,
      res,
      portfolio
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
      error: error.message,
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

const getProtectedResume = async (
  req,
  res
) => {
  try {
    const portfolio =
      await PortfolioContent.findOne({
        key: 'main',
      });

    return sendResumeFile(
      req,
      res,
      portfolio
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
      error: error.message,
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

const getResumeInfo = async (
  req,
  res
) => {
  try {
    const portfolio =
      await PortfolioContent.findOne({
        key: 'main',
      });

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

    const fileName = path.basename(
      portfolio.resume.fileName
    );

    const filePath = path.join(
      uploadsDirectory,
      fileName
    );

    const exists =
      fs.existsSync(filePath);

    let size = 0;

    if (exists) {
      const stats =
        fs.statSync(filePath);

      size = stats.size;
    }

    let sizeFormatted = '0 KB';

    if (size >= 1024 * 1024) {
      sizeFormatted =
        `${(
          size /
          (1024 * 1024)
        ).toFixed(2)} MB`;
    } else if (size >= 1024) {
      sizeFormatted =
        `${(
          size /
          1024
        ).toFixed(2)} KB`;
    } else {
      sizeFormatted =
        `${size} bytes`;
    }

    return res.status(200).json({
      success: true,
      data: {
        exists,
        resume: {
          fileName:
            portfolio.resume.fileName,
          originalName:
            portfolio.resume.originalName ||
            'Resume.pdf',
          uploadedAt:
            portfolio.resume.uploadedAt,
          size,
          sizeFormatted,
          url:
            '/api/portfolio/upload/resume',
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
      error: error.message,
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

const uploadProfileImage = async (
  req,
  res
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          'Please select a profile image.',
      });
    }

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

    if (
      portfolio.hero &&
      portfolio.hero.profileImage &&
      portfolio.hero.profileImage.includes(
        '/uploads/'
      )
    ) {
      deleteUploadedFile(
        portfolio.hero.profileImage
      );
    }

    const imageUrl =
      getPublicFileUrl(
        req,
        req.file.filename
      );

    portfolio.hero.profileImage =
      imageUrl;

    await portfolio.save();

    return res.status(200).json({
      success: true,
      message:
        'Profile image uploaded successfully.',
      data: {
        profileImage:
          portfolio.hero.profileImage,
      },
    });
  } catch (error) {
    console.error(
      'Upload Profile Image Error:',
      error
    );

    if (req.file?.filename) {
      deleteUploadedFileByName(
        req.file.filename
      );
    }

    return res.status(500).json({
      success: false,
      message:
        'Failed to upload profile image.',
      error: error.message,
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
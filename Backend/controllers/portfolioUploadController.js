const fs = require('fs');
const path = require('path');

const PortfolioContent = require('../models/PortfolioContent');

/*
|--------------------------------------------------------------------------
| Get Uploaded File URL
|--------------------------------------------------------------------------
*/

const getFileUrl = (req, filename) => {
  const protocol = req.protocol;

  const host = req.get('host');

  return `${protocol}://${host}/uploads/${filename}`;
};

/*
|--------------------------------------------------------------------------
| Delete Existing File
|--------------------------------------------------------------------------
|
| Old resume/profile image ko replace karte waqt purani file
| server se remove karne ke liye.
|
|--------------------------------------------------------------------------
*/

const deleteUploadedFile = (fileUrl) => {
  try {
    if (!fileUrl) {
      return;
    }

    const fileName = path.basename(fileUrl);

    const filePath = path.join(
      __dirname,
      '../uploads',
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
| Upload Resume
|--------------------------------------------------------------------------
| @route   POST /api/portfolio/upload/resume
| @access  Protected Admin
|--------------------------------------------------------------------------
*/

const uploadResume = async (req, res) => {
  try {
    /*
    |--------------------------------------------------------------------------
    | Check File
    |--------------------------------------------------------------------------
    */

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please select a PDF resume file.',
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

    /*
    |--------------------------------------------------------------------------
    | Create Portfolio If Missing
    |--------------------------------------------------------------------------
    */

    if (!portfolio) {
      portfolio = await PortfolioContent.create({
        key: 'main',
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Delete Previous Resume
    |--------------------------------------------------------------------------
    */

    if (
      portfolio.resume &&
      portfolio.resume.url &&
      portfolio.resume.url.includes('/uploads/')
    ) {
      deleteUploadedFile(
        portfolio.resume.url
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Generate New Resume URL
    |--------------------------------------------------------------------------
    */

    const resumeUrl = getFileUrl(
      req,
      req.file.filename
    );

    /*
    |--------------------------------------------------------------------------
    | Update Resume Information
    |--------------------------------------------------------------------------
    */

    portfolio.resume.url = resumeUrl;

    portfolio.resume.fileName =
      req.file.filename;

    portfolio.resume.originalName =
      req.file.originalname;

    portfolio.resume.uploadedAt =
      new Date();

    /*
    |--------------------------------------------------------------------------
    | Save
    |--------------------------------------------------------------------------
    */

    await portfolio.save();

    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

    res.status(200).json({
      success: true,
      message:
        'Resume uploaded successfully.',
      data: {
        resume: portfolio.resume,
      },
    });
  } catch (error) {
    console.error(
      'Upload Resume Error:',
      error
    );

    /*
    |--------------------------------------------------------------------------
    | Remove Newly Uploaded File If Database Update Fails
    |--------------------------------------------------------------------------
    */

    if (req.file) {
      try {
        const uploadedFilePath =
          path.join(
            __dirname,
            '../uploads',
            req.file.filename
          );

        if (
          fs.existsSync(
            uploadedFilePath
          )
        ) {
          fs.unlinkSync(
            uploadedFilePath
          );
        }
      } catch (deleteError) {
        console.error(
          'Failed to remove uploaded file:',
          deleteError.message
        );
      }
    }

    res.status(500).json({
      success: false,
      message:
        'Failed to upload resume.',
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Upload Profile Image
|--------------------------------------------------------------------------
| @route   POST /api/portfolio/profile-image
| @access  Protected Admin
|--------------------------------------------------------------------------
*/

const uploadProfileImage = async (
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

    /*
    |--------------------------------------------------------------------------
    | Create Portfolio If Missing
    |--------------------------------------------------------------------------
    */

    if (!portfolio) {
      portfolio = await PortfolioContent.create({
        key: 'main',
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Delete Previous Profile Image
    |--------------------------------------------------------------------------
    */

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

    /*
    |--------------------------------------------------------------------------
    | Generate Image URL
    |--------------------------------------------------------------------------
    */

    const imageUrl = getFileUrl(
      req,
      req.file.filename
    );

    /*
    |--------------------------------------------------------------------------
    | Update Profile Image
    |--------------------------------------------------------------------------
    */

    portfolio.hero.profileImage =
      imageUrl;

    /*
    |--------------------------------------------------------------------------
    | Save
    |--------------------------------------------------------------------------
    */

    await portfolio.save();

    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

    res.status(200).json({
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

    /*
    |--------------------------------------------------------------------------
    | Remove Newly Uploaded File If Something Fails
    |--------------------------------------------------------------------------
    */

    if (req.file) {
      try {
        const uploadedFilePath =
          path.join(
            __dirname,
            '../uploads',
            req.file.filename
          );

        if (
          fs.existsSync(
            uploadedFilePath
          )
        ) {
          fs.unlinkSync(
            uploadedFilePath
          );
        }
      } catch (deleteError) {
        console.error(
          'Failed to remove uploaded image:',
          deleteError.message
        );
      }
    }

    res.status(500).json({
      success: false,
      message:
        'Failed to upload profile image.',
      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

module.exports = {
  uploadResume,
  uploadProfileImage,
};
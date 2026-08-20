const multer = require('multer');
const path = require('path');
const fs = require('fs');

/*
|--------------------------------------------------------------------------
| Upload Directory
|--------------------------------------------------------------------------
*/

const uploadDirectory = path.join(
  __dirname,
  '../uploads'
);

/*
|--------------------------------------------------------------------------
| Create Upload Directory If It Doesn't Exist
|--------------------------------------------------------------------------
*/

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

/*
|--------------------------------------------------------------------------
| Storage Configuration
|--------------------------------------------------------------------------
*/

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(
      file.originalname
    );

    const baseName = path
      .basename(
        file.originalname,
        extension
      )
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .toLowerCase();

    const uniqueName = `${baseName}-${Date.now()}${extension.toLowerCase()}`;

    cb(null, uniqueName);
  },
});

/*
|--------------------------------------------------------------------------
| Allowed File Types
|--------------------------------------------------------------------------
*/

const allowedMimeTypes = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
];

/*
|--------------------------------------------------------------------------
| File Filter
|--------------------------------------------------------------------------
*/

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Only PDF, JPG, JPEG, PNG and WEBP files are allowed.'
      ),
      false
    );
  }
};

/*
|--------------------------------------------------------------------------
| Multer Configuration
|--------------------------------------------------------------------------
|
| 10 MB maximum file size.
|
|--------------------------------------------------------------------------
*/

const upload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

/*
|--------------------------------------------------------------------------
| Resume Upload
|--------------------------------------------------------------------------
|
| Only PDF should be accepted for resume.
|
|--------------------------------------------------------------------------
*/

const uploadResume = multer({
  storage,

  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(
        new Error(
          'Only PDF files are allowed for resume.'
        ),
        false
      );
    }
  },

  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

/*
|--------------------------------------------------------------------------
| Profile Image Upload
|--------------------------------------------------------------------------
|
| JPG / JPEG / PNG / WEBP
|
|--------------------------------------------------------------------------
*/

const uploadProfileImage = multer({
  storage,

  fileFilter: (req, file, cb) => {
    const allowedImages = [
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (allowedImages.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          'Only JPG, JPEG, PNG and WEBP images are allowed.'
        ),
        false
      );
    }
  },

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = {
  upload,
  uploadResume,
  uploadProfileImage,
};
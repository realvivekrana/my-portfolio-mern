const multer = require('multer');
const {
  CloudinaryStorage,
} = require('multer-storage-cloudinary');

const cloudinary =
  require('../config/cloudinary');

/*
|--------------------------------------------------------------------------
| CLOUDINARY STORAGE
|--------------------------------------------------------------------------
|
| All uploaded files are stored directly on Cloudinary.
|
| Resume:
|   PDF
|   resource_type = raw
|
| Images:
|   JPG / JPEG / PNG / WEBP
|   resource_type = image
|
|--------------------------------------------------------------------------
*/

const storage =
  new CloudinaryStorage({
    cloudinary,

    params: async (
      req,
      file
    ) => {
      /*
      |--------------------------------------------------------------------------
      | DEBUG
      |--------------------------------------------------------------------------
      */

      console.log(
        '\n========================================'
      );

      console.log(
        '☁️ CloudinaryStorage received file'
      );

      console.log(
        'Original name:',
        file?.originalname
      );

      console.log(
        'MIME type:',
        file?.mimetype
      );

      console.log(
        'Field name:',
        file?.fieldname
      );

      console.log(
        '========================================\n'
      );

      /*
      |--------------------------------------------------------------------------
      | FILE NAME
      |--------------------------------------------------------------------------
      */

      const originalName =
        file?.originalname ||
        'file';

      const lowerFileName =
        originalName.toLowerCase();

      /*
      |--------------------------------------------------------------------------
      | PDF DETECTION
      |--------------------------------------------------------------------------
      |
      | MIME type OR extension.
      |
      |--------------------------------------------------------------------------
      */

      const isPdf =
        file?.mimetype ===
          'application/pdf' ||
        lowerFileName.endsWith(
          '.pdf'
        );

      /*
      |--------------------------------------------------------------------------
      | IMAGE DETECTION
      |--------------------------------------------------------------------------
      */

      const isImage =
        file?.mimetype ===
          'image/jpeg' ||
        file?.mimetype ===
          'image/jpg' ||
        file?.mimetype ===
          'image/png' ||
        file?.mimetype ===
          'image/webp' ||
        /\.(jpe?g|png|webp)$/i.test(
          lowerFileName
        );

      /*
      |--------------------------------------------------------------------------
      | CLOUDINARY FOLDER
      |--------------------------------------------------------------------------
      */

      let folder =
        'vivek-portfolio/uploads';

      if (isPdf) {
        folder =
          'vivek-portfolio/resume';
      } else if (isImage) {
        folder =
          'vivek-portfolio/images';
      }

      /*
      |--------------------------------------------------------------------------
      | CLOUDINARY RESOURCE TYPE
      |--------------------------------------------------------------------------
      */

      const resourceType =
        isPdf
          ? 'raw'
          : 'image';

      /*
      |--------------------------------------------------------------------------
      | FILE EXTENSION
      |--------------------------------------------------------------------------
      */

      const extension =
        originalName.includes('.')
          ? originalName
              .substring(
                originalName.lastIndexOf('.') +
                  1
              )
              .toLowerCase()
          : '';

      /*
      |--------------------------------------------------------------------------
      | CLEAN BASE NAME
      |--------------------------------------------------------------------------
      */

      const baseName =
        originalName
          .replace(
            /\.[^/.]+$/,
            ''
          )
          .replace(
            /[^a-zA-Z0-9-_]/g,
            '-'
          )
          .replace(
            /-+/g,
            '-'
          )
          .replace(
            /^-|-$/g,
            ''
          )
          .toLowerCase() ||
        'file';

      /*
      |--------------------------------------------------------------------------
      | UNIQUE PUBLIC ID
      |--------------------------------------------------------------------------
      */

      const uniqueName =
        `${baseName}-${Date.now()}`;

      /*
      |--------------------------------------------------------------------------
      | DEBUG CLOUDINARY PARAMS
      |--------------------------------------------------------------------------
      */

      console.log(
        '📁 Cloudinary folder:',
        folder
      );

      console.log(
        '📦 Cloudinary resource type:',
        resourceType
      );

      console.log(
        '🆔 Cloudinary public ID:',
        uniqueName
      );

      /*
      |--------------------------------------------------------------------------
      | CLOUDINARY PARAMS
      |--------------------------------------------------------------------------
      */

      return {
        folder,

        resource_type:
          resourceType,

        public_id:
          uniqueName,

        use_filename:
          false,

        unique_filename:
          false,

        overwrite:
          false,

        /*
        |--------------------------------------------------------------------------
        | PDF FORMAT
        |--------------------------------------------------------------------------
        */

        ...(isPdf && extension
          ? {
              format:
                extension,
            }
          : {}),
      };
    },
  });

/*
|--------------------------------------------------------------------------
| GENERAL FILE TYPES
|--------------------------------------------------------------------------
*/

const allowedMimeTypes = [
  'application/pdf',

  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

/*
|--------------------------------------------------------------------------
| GENERAL FILE FILTER
|--------------------------------------------------------------------------
*/

const fileFilter = (
  req,
  file,
  cb
) => {
  /*
  |--------------------------------------------------------------------------
  | DEBUG - FILE RECEIVED BY MULTER
  |--------------------------------------------------------------------------
  */

  console.log(
    '\n========================================'
  );

  console.log(
    '📥 MULTER FILE FILTER'
  );

  console.log(
    'Field name:',
    file?.fieldname
  );

  console.log(
    'Original name:',
    file?.originalname
  );

  console.log(
    'MIME type:',
    file?.mimetype
  );

  console.log(
    '========================================\n'
  );

  /*
  |--------------------------------------------------------------------------
  | FILE NAME
  |--------------------------------------------------------------------------
  */

  const fileName =
    (
      file?.originalname ||
      ''
    ).toLowerCase();

  /*
  |--------------------------------------------------------------------------
  | PDF CHECK
  |--------------------------------------------------------------------------
  */

  const isPdf =
    file?.mimetype ===
      'application/pdf' ||
    fileName.endsWith(
      '.pdf'
    );

  /*
  |--------------------------------------------------------------------------
  | IMAGE CHECK
  |--------------------------------------------------------------------------
  */

  const isImageByMime =
    allowedMimeTypes.includes(
      file?.mimetype
    ) &&
    file?.mimetype !==
      'application/pdf';

  const isImageByExtension =
    /\.(jpe?g|png|webp)$/i.test(
      fileName
    );

  /*
  |--------------------------------------------------------------------------
  | ALLOW FILE
  |--------------------------------------------------------------------------
  */

  if (
    isPdf ||
    isImageByMime ||
    isImageByExtension
  ) {
    console.log(
      '✅ Multer accepted file:',
      file?.originalname
    );

    return cb(
      null,
      true
    );
  }

  /*
  |--------------------------------------------------------------------------
  | REJECT FILE
  |--------------------------------------------------------------------------
  */

  console.error(
    '❌ Multer rejected file:',
    file?.originalname
  );

  console.error(
    '❌ MIME:',
    file?.mimetype
  );

  return cb(
    new Error(
      'Only PDF, JPG, JPEG, PNG and WEBP files are allowed.'
    ),
    false
  );
};

/*
|--------------------------------------------------------------------------
| GENERAL UPLOAD
|--------------------------------------------------------------------------
|
| Maximum file size:
| 10 MB
|
|--------------------------------------------------------------------------
*/

const upload =
  multer({
    storage,

    fileFilter,

    limits: {
      fileSize:
        10 * 1024 * 1024,
    },
  });

/*
|--------------------------------------------------------------------------
| RESUME UPLOAD
|--------------------------------------------------------------------------
|
| Only PDF files are accepted.
|
| PDF detection:
|   MIME type OR .pdf extension
|
| Maximum:
|   10 MB
|
|--------------------------------------------------------------------------
*/

const uploadResume =
  multer({
    storage,

    fileFilter: (
      req,
      file,
      cb
    ) => {
      /*
      |--------------------------------------------------------------------------
      | DEBUG
      |--------------------------------------------------------------------------
      */

      console.log(
        '\n========================================'
      );

      console.log(
        '📄 RESUME UPLOAD FILTER'
      );

      console.log(
        'Field:',
        file?.fieldname
      );

      console.log(
        'Name:',
        file?.originalname
      );

      console.log(
        'MIME:',
        file?.mimetype
      );

      console.log(
        '========================================\n'
      );

      /*
      |--------------------------------------------------------------------------
      | FILE NAME
      |--------------------------------------------------------------------------
      */

      const fileName =
        (
          file?.originalname ||
          ''
        ).toLowerCase();

      /*
      |--------------------------------------------------------------------------
      | PDF CHECK
      |--------------------------------------------------------------------------
      */

      const isPdf =
        file?.mimetype ===
          'application/pdf' ||
        fileName.endsWith(
          '.pdf'
        );

      /*
      |--------------------------------------------------------------------------
      | ACCEPT PDF
      |--------------------------------------------------------------------------
      */

      if (isPdf) {
        console.log(
          '✅ Resume PDF accepted by Multer'
        );

        return cb(
          null,
          true
        );
      }

      /*
      |--------------------------------------------------------------------------
      | REJECT NON-PDF
      |--------------------------------------------------------------------------
      */

      console.error(
        '❌ Resume rejected by Multer'
      );

      console.error(
        'Name:',
        file?.originalname
      );

      console.error(
        'MIME:',
        file?.mimetype
      );

      return cb(
        new Error(
          'Only PDF files are allowed for resume.'
        ),
        false
      );
    },

    limits: {
      fileSize:
        10 * 1024 * 1024,
    },
  });

/*
|--------------------------------------------------------------------------
| PROFILE IMAGE UPLOAD
|--------------------------------------------------------------------------
|
| Allowed:
|   JPG
|   JPEG
|   PNG
|   WEBP
|
| Maximum:
|   5 MB
|
|--------------------------------------------------------------------------
*/

const uploadProfileImage =
  multer({
    storage,

    fileFilter: (
      req,
      file,
      cb
    ) => {
      const fileName =
        (
          file?.originalname ||
          ''
        ).toLowerCase();

      const allowedImages = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
      ];

      const isValidMime =
        allowedImages.includes(
          file?.mimetype
        );

      const isValidExtension =
        /\.(jpe?g|png|webp)$/i.test(
          fileName
        );

      /*
      |--------------------------------------------------------------------------
      | ACCEPT IMAGE
      |--------------------------------------------------------------------------
      */

      if (
        isValidMime ||
        isValidExtension
      ) {
        console.log(
          '✅ Profile image accepted:',
          file?.originalname
        );

        return cb(
          null,
          true
        );
      }

      /*
      |--------------------------------------------------------------------------
      | REJECT IMAGE
      |--------------------------------------------------------------------------
      */

      console.error(
        '❌ Profile image rejected:',
        file?.originalname
      );

      return cb(
        new Error(
          'Only JPG, JPEG, PNG and WEBP images are allowed.'
        ),
        false
      );
    },

    limits: {
      fileSize:
        5 * 1024 * 1024,
    },
  });

/*
|--------------------------------------------------------------------------
| CERTIFICATE IMAGE UPLOAD
|--------------------------------------------------------------------------
|
| Allowed:
|   JPG
|   JPEG
|   PNG
|   WEBP
|
| Maximum:
|   5 MB
|
|--------------------------------------------------------------------------
*/

const uploadCertificateImage =
  multer({
    storage,

    fileFilter: (
      req,
      file,
      cb
    ) => {
      const fileName =
        (
          file?.originalname ||
          ''
        ).toLowerCase();

      const allowedImages = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
      ];

      const isValidMime =
        allowedImages.includes(
          file?.mimetype
        );

      const isValidExtension =
        /\.(jpe?g|png|webp)$/i.test(
          fileName
        );

      /*
      |--------------------------------------------------------------------------
      | ACCEPT IMAGE
      |--------------------------------------------------------------------------
      */

      if (
        isValidMime ||
        isValidExtension
      ) {
        console.log(
          '✅ Certificate image accepted:',
          file?.originalname
        );

        return cb(
          null,
          true
        );
      }

      /*
      |--------------------------------------------------------------------------
      | REJECT IMAGE
      |--------------------------------------------------------------------------
      */

      console.error(
        '❌ Certificate image rejected:',
        file?.originalname
      );

      return cb(
        new Error(
          'Only JPG, JPEG, PNG and WEBP files are allowed for certificates.'
        ),
        false
      );
    },

    limits: {
      fileSize:
        5 * 1024 * 1024,
    },
  });

/*
|--------------------------------------------------------------------------
| EXPORTS
|--------------------------------------------------------------------------
*/

module.exports = {
  upload,

  uploadResume,

  uploadProfileImage,

  uploadCertificateImage,
};
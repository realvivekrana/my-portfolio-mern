const express = require('express');

const router = express.Router();

const {
  protect,
} = require('../middleware/authMiddleware');

const {
  getAllCertificates,
  getAdminCertificates,
  getFeaturedCertificates,
  getCertificateById,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  uploadCertificateImage,
} = require('../controllers/certificateController');

const {
  uploadCertificateImage: certificateImageUpload,
} = require('../middleware/uploadMiddleware');

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/

/*
| GET /api/certificates
|
| Portfolio frontend ke liye.
|
| Sirf visible certificates return honge.
*/

router.get(
  '/',
  getAllCertificates
);

/*
| GET /api/certificates/featured
|
| Featured certificates ke liye.
*/

router.get(
  '/featured',
  getFeaturedCertificates
);

/*
|--------------------------------------------------------------------------
| ADMIN ROUTES
|--------------------------------------------------------------------------
*/

/*
| GET /api/certificates/admin
|
| Admin ko ALL certificates milenge,
| including hidden certificates.
*/

router.get(
  '/admin',
  protect,
  getAdminCertificates
);

/*
|--------------------------------------------------------------------------
| CERTIFICATE IMAGE UPLOAD
|--------------------------------------------------------------------------
|
| POST /api/certificates/upload-image
|
| Protected Admin
|
| IMPORTANT:
| This route must come before /:id so Express does not treat
| "upload-image" as a certificate ID.
|
*/

router.post(
  '/upload-image',
  protect,
  certificateImageUpload.single('certificateImage'),
  uploadCertificateImage
);

/*
|--------------------------------------------------------------------------
| SINGLE CERTIFICATE
|--------------------------------------------------------------------------
*/

/*
| GET /api/certificates/:id
*/

router.get(
  '/:id',
  getCertificateById
);

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
|
| POST /api/certificates
|
| Protected Admin
|
*/

router.post(
  '/',
  protect,
  createCertificate
);

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
|
| PUT /api/certificates/:id
|
| Protected Admin
|
*/

router.put(
  '/:id',
  protect,
  updateCertificate
);

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
|
| DELETE /api/certificates/:id
|
| Protected Admin
|
*/

router.delete(
  '/:id',
  protect,
  deleteCertificate
);

module.exports = router;
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
} = require('../controllers/certificateController');

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
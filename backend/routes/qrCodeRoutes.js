// routes/qrCodeRoutes.js
const express = require('express');
const {
    createQRCode,
    getQRCodes,
    getQRCode,
    updateQRCode,
    deleteQRCode
} = require('../controllers/qrCodeController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

router.route('/')
    .post(createQRCode)
    .get(getQRCodes);

router.route('/:id')
    .get(getQRCode)
    .put(updateQRCode)
    .delete(deleteQRCode);

module.exports = router;
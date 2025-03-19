// routes/businessRoutes.js
const express = require('express');
const {
    getBusinessProfile,
    updateBusinessProfile,
    changePassword
} = require('../controllers/businessController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Zabezpieczenie wszystkich tras
router.use(protect);

// Trasy profilu
router.route('/profile')
    .get(getBusinessProfile)
    .put(updateBusinessProfile);

// Trasa zmiany hasła
router.route('/change-password')
    .put(changePassword);

module.exports = router;
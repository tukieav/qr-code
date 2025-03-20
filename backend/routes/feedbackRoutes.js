// routes/feedbackRoutes.js - zaktualizowane trasy

const express = require('express');
const {
    getFeedback,
    getSingleFeedback,
    getFeedbackStats,
    respondToFeedback,  // Nowa funkcja
    exportFeedback,     // Nowa funkcja
    reportFeedback      // Nowa funkcja
} = require('../controllers/feedbackController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Zabezpieczenie wszystkich tras
router.use(protect);

router.route('/')
    .get(getFeedback);

router.route('/stats')
    .get(getFeedbackStats);

router.route('/export')
    .get(exportFeedback);  // Nowa trasa

router.route('/:id')
    .get(getSingleFeedback);

router.route('/:id/respond')
    .post(respondToFeedback);  // Nowa trasa

router.route('/:id/report')
    .post(reportFeedback);  // Nowa trasa

module.exports = router;
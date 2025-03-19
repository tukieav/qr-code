// routes/feedbackRoutes.js
const express = require('express');
const {
    getFeedback,
    getSingleFeedback,
    getFeedbackStats
} = require('../controllers/feedbackController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

router.route('/')
    .get(getFeedback);

router.route('/stats')
    .get(getFeedbackStats);

router.route('/:id')
    .get(getSingleFeedback);

module.exports = router;
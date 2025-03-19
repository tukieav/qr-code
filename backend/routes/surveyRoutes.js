// routes/surveyRoutes.js
const express = require('express');
const {
    createSurvey,
    getSurveys,
    getSurvey,
    updateSurvey,
    deleteSurvey
} = require('../controllers/surveyController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

router.route('/')
    .post(createSurvey)
    .get(getSurveys);

router.route('/:id')
    .get(getSurvey)
    .put(updateSurvey)
    .delete(deleteSurvey);

module.exports = router;
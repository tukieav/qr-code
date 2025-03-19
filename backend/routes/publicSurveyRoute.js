// routes/publicSurveyRoute.js
const express = require('express');
const { submitFeedback } = require('../controllers/feedbackController');
const QRCode = require('../models/QRCode');
const Survey = require('../models/Survey');

const router = express.Router();

// Get survey by QR code unique identifier (public, no auth)
router.get('/:uniqueCode', async (req, res, next) => {
    try {
        const qrCode = await QRCode.findOne({ unique_code: req.params.uniqueCode });

        if (!qrCode) {
            return res.status(404).json({
                success: false,
                message: 'QR code not found'
            });
        }

        const survey = await Survey.findById(qrCode.survey_id);

        if (!survey || !survey.is_active) {
            return res.status(404).json({
                success: false,
                message: 'Survey not found or inactive'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                qr_code_id: qrCode.unique_code,
                title: survey.title,
                description: survey.description,
                questions: survey.questions
            }
        });
    } catch (error) {
        next(error);
    }
});

// Submit feedback (public, no auth)
router.post('/:uniqueCode/submit', submitFeedback);

module.exports = router;
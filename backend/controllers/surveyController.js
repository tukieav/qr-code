// controllers/surveyController.js
const Survey = require('../models/Survey');

// Create a new survey
exports.createSurvey = async (req, res, next) => {
    try {
        // Add business_id from the authenticated business
        req.body.business_id = req.business._id;

        const survey = await Survey.create(req.body);

        res.status(201).json({
            success: true,
            data: survey
        });
    } catch (error) {
        next(error);
    }
};

// Get all surveys for a business
exports.getSurveys = async (req, res, next) => {
    try {
        const surveys = await Survey.find({ business_id: req.business._id });

        res.status(200).json({
            success: true,
            count: surveys.length,
            data: surveys
        });
    } catch (error) {
        next(error);
    }
};

// Get single survey
exports.getSurvey = async (req, res, next) => {
    try {
        const survey = await Survey.findById(req.params.id);

        if (!survey) {
            return res.status(404).json({
                success: false,
                message: 'Survey not found'
            });
        }

        // Make sure business owns the survey
        if (survey.business_id.toString() !== req.business._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this survey'
            });
        }

        res.status(200).json({
            success: true,
            data: survey
        });
    } catch (error) {
        next(error);
    }
};

// Update survey
exports.updateSurvey = async (req, res, next) => {
    try {
        let survey = await Survey.findById(req.params.id);

        if (!survey) {
            return res.status(404).json({
                success: false,
                message: 'Survey not found'
            });
        }

        // Make sure business owns the survey
        if (survey.business_id.toString() !== req.business._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this survey'
            });
        }

        survey = await Survey.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: survey
        });
    } catch (error) {
        next(error);
    }
};

// Delete survey
exports.deleteSurvey = async (req, res, next) => {
    try {
        const survey = await Survey.findById(req.params.id);

        if (!survey) {
            return res.status(404).json({
                success: false,
                message: 'Survey not found'
            });
        }

        // Make sure business owns the survey
        if (survey.business_id.toString() !== req.business._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this survey'
            });
        }

        await survey.remove();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};
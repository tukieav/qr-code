// controllers/qrCodeController.js
const QRCode = require('../models/QRCode');
const Survey = require('../models/Survey');
const { generateQRCode } = require('../utils/qrGenerator');
const crypto = require('crypto');

// Create a new QR code
exports.createQRCode = async (req, res, next) => {
    try {
        // Check if the survey exists and belongs to the business
        const survey = await Survey.findById(req.body.survey_id);

        if (!survey) {
            return res.status(404).json({
                success: false,
                message: 'Survey not found'
            });
        }

        if (survey.business_id.toString() !== req.business._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this survey'
            });
        }

        // Generate a unique code
        const unique_code = crypto.randomBytes(10).toString('hex');

        // Create QR code object
        const qrCodeData = {
            survey_id: req.body.survey_id,
            business_id: req.business._id,
            unique_code,
            name: req.body.name || 'QR Code'
        };

        // Save QR code to database
        const qrCode = await QRCode.create(qrCodeData);

        // Generate QR code image URL (frontend will show this)
        const surveyUrl = `${process.env.FRONTEND_URL}/survey/${unique_code}`;
        const qrCodeImage = await generateQRCode(surveyUrl);

        res.status(201).json({
            success: true,
            data: {
                ...qrCode.toObject(),
                qrCodeImage,
                surveyUrl
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get all QR codes for a business
exports.getQRCodes = async (req, res, next) => {
    try {
        const qrCodes = await QRCode.find({ business_id: req.business._id }).populate('survey_id', 'title');

        res.status(200).json({
            success: true,
            count: qrCodes.length,
            data: qrCodes
        });
    } catch (error) {
        next(error);
    }
};

// Get single QR code
exports.getQRCode = async (req, res, next) => {
    try {
        const qrCode = await QRCode.findById(req.params.id).populate('survey_id', 'title questions');

        if (!qrCode) {
            return res.status(404).json({
                success: false,
                message: 'QR code not found'
            });
        }

        // Make sure business owns the QR code
        if (qrCode.business_id.toString() !== req.business._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this QR code'
            });
        }

        // Regenerate QR code image
        const surveyUrl = `${process.env.FRONTEND_URL}/survey/${qrCode.unique_code}`;
        const qrCodeImage = await generateQRCode(surveyUrl);

        res.status(200).json({
            success: true,
            data: {
                ...qrCode.toObject(),
                qrCodeImage,
                surveyUrl
            }
        });
    } catch (error) {
        next(error);
    }
};

// Update QR code
exports.updateQRCode = async (req, res, next) => {
    try {
        let qrCode = await QRCode.findById(req.params.id);

        if (!qrCode) {
            return res.status(404).json({
                success: false,
                message: 'QR code not found'
            });
        }

        // Make sure business owns the QR code
        if (qrCode.business_id.toString() !== req.business._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this QR code'
            });
        }

        // Only allow updating the name
        qrCode = await QRCode.findByIdAndUpdate(
            req.params.id,
            { name: req.body.name },
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            data: qrCode
        });
    } catch (error) {
        next(error);
    }
};

// Delete QR code
exports.deleteQRCode = async (req, res, next) => {
    try {
        const qrCode = await QRCode.findById(req.params.id);

        if (!qrCode) {
            return res.status(404).json({
                success: false,
                message: 'QR code not found'
            });
        }

        // Make sure business owns the QR code
        if (qrCode.business_id.toString() !== req.business._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this QR code'
            });
        }

        await qrCode.remove();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};
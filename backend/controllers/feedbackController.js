// controllers/feedbackController.js
const Feedback = require('../models/Feedback');
const QRCode = require('../models/QRCode');
const Survey = require('../models/Survey');
const mongoose = require('mongoose');

// Submit feedback (public route - no authentication)
exports.submitFeedback = async (req, res, next) => {
    try {
        const { qrCodeId, responses, rating, comment } = req.body;

        // Find the QR code
        const qrCode = await QRCode.findOne({ unique_code: qrCodeId });

        if (!qrCode) {
            return res.status(404).json({
                success: false,
                message: 'Invalid QR code'
            });
        }

        // Get related survey to validate responses
        const survey = await Survey.findById(qrCode.survey_id);

        if (!survey || !survey.is_active) {
            return res.status(404).json({
                success: false,
                message: 'Survey not found or inactive'
            });
        }

        // Create feedback
        const feedback = await Feedback.create({
            qr_code_id: qrCode._id,
            business_id: qrCode.business_id,
            tenant_id: req.body.tenant_id || 'anonymous', // You might get tenant_id from another source
            responses,
            rating,
            comment,
            client_info: {
                browser: req.headers['user-agent'],
                device: req.headers['user-agent'],
                ip: req.ip // Be careful with privacy concerns
            }
        });

        // Increment scan count
        await QRCode.findByIdAndUpdate(qrCode._id, {
            $inc: { scan_count: 1 }
        });

        res.status(201).json({
            success: true,
            data: feedback
        });
    } catch (error) {
        next(error);
    }
};

// Get all feedback for a business
exports.getFeedback = async (req, res, next) => {
    try {
        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;
        const startIndex = (page - 1) * limit;

        // Filtering
        let query = { business_id: req.business._id };

        // Date filtering
        if (req.query.startDate && req.query.endDate) {
            query.submission_date = {
                $gte: new Date(req.query.startDate),
                $lte: new Date(req.query.endDate)
            };
        }

        // Rating filtering
        if (req.query.minRating && req.query.maxRating) {
            query.rating = {
                $gte: parseInt(req.query.minRating),
                $lte: parseInt(req.query.maxRating)
            };
        }

        // Execute query with pagination
        const feedback = await Feedback.find(query)
            .populate({
                path: 'qr_code_id',
                select: 'name unique_code',
                populate: {
                    path: 'survey_id',
                    select: 'title'
                }
            })
            .skip(startIndex)
            .limit(limit)
            .sort({ submission_date: -1 });

        // Get total count for pagination
        const total = await Feedback.countDocuments(query);

        res.status(200).json({
            success: true,
            count: feedback.length,
            total,
            pagination: {
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            },
            data: feedback
        });
    } catch (error) {
        next(error);
    }
};

// Get feedback statistics
exports.getFeedbackStats = async (req, res, next) => {
    try {
        // Timeframe filtering
        const timeframe = req.query.timeframe || 'all';
        let dateFilter = {};

        const now = new Date();

        if (timeframe === 'today') {
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            dateFilter = { $gte: today };
        } else if (timeframe === 'week') {
            const lastWeek = new Date(now);
            lastWeek.setDate(now.getDate() - 7);
            dateFilter = { $gte: lastWeek };
        } else if (timeframe === 'month') {
            const lastMonth = new Date(now);
            lastMonth.setMonth(now.getMonth() - 1);
            dateFilter = { $gte: lastMonth };
        } else if (timeframe === 'custom' && req.query.startDate && req.query.endDate) {
            dateFilter = {
                $gte: new Date(req.query.startDate),
                $lte: new Date(req.query.endDate)
            };
        }

        // Build match stage (filtering)
        const matchStage = {
            business_id: mongoose.Types.ObjectId(req.business._id)
        };

        if (Object.keys(dateFilter).length > 0) {
            matchStage.submission_date = dateFilter;
        }

        // Overall statistics
        const overallStats = await Feedback.aggregate([
            { $match: matchStage },
            { $group: {
                    _id: null,
                    count: { $sum: 1 },
                    averageRating: { $avg: '$rating' },
                    ratingsCount: { $sum: 1 }
                }}
        ]);

        // Rating distribution
        const ratingDistribution = await Feedback.aggregate([
            { $match: matchStage },
            { $group: {
                    _id: '$rating',
                    count: { $sum: 1 }
                }},
            { $sort: { _id: 1 } }
        ]);

        // Time-based trend (daily)
        const dailyTrend = await Feedback.aggregate([
            { $match: matchStage },
            { $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$submission_date' }
                    },
                    count: { $sum: 1 },
                    averageRating: { $avg: '$rating' }
                }},
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                overall: overallStats.length > 0 ? overallStats[0] : { count: 0, averageRating: 0, ratingsCount: 0 },
                ratingDistribution: ratingDistribution.reduce((acc, curr) => {
                    acc[curr._id] = curr.count;
                    return acc;
                }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }),
                dailyTrend
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get single feedback
exports.getSingleFeedback = async (req, res, next) => {
    try {
        const feedback = await Feedback.findById(req.params.id)
            .populate({
                path: 'qr_code_id',
                select: 'name unique_code',
                populate: {
                    path: 'survey_id',
                    select: 'title questions'
                }
            });

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: 'Feedback not found'
            });
        }

        // Make sure business owns the feedback
        if (feedback.business_id.toString() !== req.business._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this feedback'
            });
        }

        res.status(200).json({
            success: true,
            data: feedback
        });
    } catch (error) {
        next(error);
    }
};
// controllers/feedbackController.js
const Feedback = require('../models/Feedback');
const QRCode = require('../models/QRCode');
const Survey = require('../models/Survey');
const Business = require('../models/Business');
const mongoose = require('mongoose');
const { emailService } = require('../utils/emailService');

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
                message: 'Opinia nie znaleziona'
            });
        }

        // Sprawdź, czy firma ma dostęp do opinii
        if (feedback.business_id.toString() !== req.business._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Brak uprawnień do tej opinii'
            });
        }

        // Dodaj analizę sentymentu
        const sentimentScore = await analyzeSentiment(feedback.comment);

        res.status(200).json({
            success: true,
            data: {
                ...feedback.toObject(),
                sentiment: sentimentScore
            }
        });
    } catch (error) {
        next(error);
    }
};

// Dodatkowa funkcja do analizy sentymentu (prosta implementacja)
const analyzeSentiment = async (text) => {
    if (!text || text.trim() === '') {
        return {
            score: 0,
            label: 'neutral'
        };
    }

    // Słownik pozytywnych i negatywnych słów (prosta implementacja)
    const positiveWords = ['dobry', 'świetny', 'wspaniały', 'doskonały', 'zadowolony', 'polecam'];
    const negativeWords = ['zły', 'słaby', 'okropny', 'fatalny', 'niezadowolony', 'rozczarowany'];

    const normalizedText = text.toLowerCase();
    let score = 0;

    // Zliczanie słów
    positiveWords.forEach(word => {
        if (normalizedText.includes(word)) score += 1;
    });

    negativeWords.forEach(word => {
        if (normalizedText.includes(word)) score -= 1;
    });

    // Określ etykietę na podstawie wyniku
    let label = 'neutral';
    if (score > 0) label = 'positive';
    if (score < 0) label = 'negative';

    return {
        score,
        label
    };
};

// Nowa funkcja - odpowiedź na opinię
exports.respondToFeedback = async (req, res, next) => {
    try {
        const { response_text } = req.body;

        if (!response_text || response_text.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Treść odpowiedzi jest wymagana'
            });
        }

        const feedback = await Feedback.findById(req.params.id);

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: 'Opinia nie znaleziona'
            });
        }

        // Sprawdź, czy firma ma dostęp do opinii
        if (feedback.business_id.toString() !== req.business._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Brak uprawnień do tej opinii'
            });
        }

        // Aktualizuj opinię o odpowiedź
        feedback.business_response = {
            text: response_text,
            date: new Date()
        };

        await feedback.save();

        // Jeśli klient podał email, wyślij powiadomienie
        if (feedback.client_email) {
            try {
                // Pobierz dane firmy
                const business = await Business.findById(req.business._id);

                // Wyślij email z odpowiedzią
                await emailService.sendFeedbackResponseNotification(
                    feedback.client_email,
                    business.business_name,
                    feedback.rating,
                    feedback.comment,
                    response_text
                );
            } catch (emailError) {
                console.error('Błąd wysyłania emaila:', emailError);
                // Nie blokujemy odpowiedzi, jeśli email nie został wysłany
            }
        }

        res.status(200).json({
            success: true,
            data: feedback
        });
    } catch (error) {
        next(error);
    }
};

// Nowa funkcja - zbiorczy eksport danych opinii
exports.exportFeedback = async (req, res, next) => {
    try {
        const { format, startDate, endDate } = req.query;

        // Buduj zapytanie
        const query = { business_id: req.business._id };

        // Filtracja po dacie
        if (startDate && endDate) {
            query.submission_date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        // Pobierz opinie
        const feedback = await Feedback.find(query)
            .populate({
                path: 'qr_code_id',
                select: 'name',
                populate: {
                    path: 'survey_id',
                    select: 'title'
                }
            })
            .sort({ submission_date: -1 });

        if (format === 'csv') {
            // Przygotuj dane do eksportu CSV
            const csvData = [
                // Nagłówki
                ['ID', 'Data', 'Ocena', 'Komentarz', 'Ankieta', 'Kod QR']
            ];

            // Dane
            feedback.forEach(item => {
                csvData.push([
                    item._id.toString(),
                    new Date(item.submission_date).toISOString(),
                    item.rating || '',
                    item.comment || '',
                    (item.qr_code_id && item.qr_code_id.survey_id) ? item.qr_code_id.survey_id.title : '',
                    item.qr_code_id ? item.qr_code_id.name : ''
                ]);
            });

            // Konwertuj na string CSV
            const csvContent = csvData.map(row => row.join(',')).join('\n');

            // Ustaw nagłówki odpowiedzi
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=feedback_export.csv');

            return res.status(200).send(csvContent);
        }

        // Domyślny format JSON
        res.status(200).json({
            success: true,
            count: feedback.length,
            data: feedback
        });
    } catch (error) {
        next(error);
    }
};

// Nowa funkcja - zgłaszanie opinii jako nieodpowiedniej
exports.reportFeedback = async (req, res, next) => {
    try {
        const { reason } = req.body;

        if (!reason) {
            return res.status(400).json({
                success: false,
                message: 'Podaj powód zgłoszenia'
            });
        }

        const feedback = await Feedback.findById(req.params.id);

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: 'Opinia nie znaleziona'
            });
        }

        // Sprawdź, czy firma ma dostęp do opinii
        if (feedback.business_id.toString() !== req.business._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Brak uprawnień do tej opinii'
            });
        }

        // Zaktualizuj opinię o zgłoszenie
        feedback.reported = {
            is_reported: true,
            reason: reason,
            date: new Date()
        };

        await feedback.save();

        res.status(200).json({
            success: true,
            message: 'Opinia została zgłoszona',
            data: feedback
        });
    } catch (error) {
        next(error);
    }
};
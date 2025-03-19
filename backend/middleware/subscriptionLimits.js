// middleware/subscriptionLimits.js
const Business = require('../models/Business');
const Survey = require('../models/Survey');
const QRCode = require('../models/QRCode');
const Feedback = require('../models/Feedback');

// Check subscription status and limits
exports.checkSubscription = async (req, res, next) => {
    try {
        const business = await Business.findById(req.business._id);

        // Check if subscription is active or trial
        if (business.subscription_status === 'expired') {
            return res.status(403).json({
                success: false,
                message: 'Your subscription has expired. Please renew to continue using this feature.'
            });
        }

        // Check if trial has ended
        if (business.subscription_status === 'trial' && new Date() > business.trial_ends_at) {
            // middleware/subscriptionLimits.js (continued)
            await Business.findByIdAndUpdate(req.business._id, {
                subscription_status: 'expired'
            });

            return res.status(403).json({
                success: false,
                message: 'Your trial period has ended. Please upgrade to a paid plan to continue using this feature.'
            });
        }

        // Check specific limits based on request route
        const path = req.path;

        // For survey creation
        if (path.includes('/surveys') && req.method === 'POST') {
            // Skip check for unlimited plans
            if (business.usage_limits.max_surveys !== -1) {
                const surveyCount = await Survey.countDocuments({ business_id: req.business._id });

                if (surveyCount >= business.usage_limits.max_surveys) {
                    return res.status(403).json({
                        success: false,
                        message: `You've reached the maximum number of surveys allowed in your plan (${business.usage_limits.max_surveys}). Please upgrade to create more surveys.`
                    });
                }
            }
        }

        // For QR code creation
        if (path.includes('/qrcodes') && req.method === 'POST') {
            // Skip check for unlimited plans
            if (business.usage_limits.max_qr_codes !== -1) {
                const qrCodeCount = await QRCode.countDocuments({ business_id: req.business._id });

                if (qrCodeCount >= business.usage_limits.max_qr_codes) {
                    return res.status(403).json({
                        success: false,
                        message: `You've reached the maximum number of QR codes allowed in your plan (${business.usage_limits.max_qr_codes}). Please upgrade to create more QR codes.`
                    });
                }
            }
        }

        // Check monthly feedback response limit
        // This is mainly for backend tracking - we wouldn't block feedback submission
        // from customers, but we might show a notification to the business owner
        if (path.includes('/feedback/stats')) {
            if (business.usage_limits.max_responses_per_month !== -1) {
                const startOfMonth = new Date();
                startOfMonth.setDate(1);
                startOfMonth.setHours(0, 0, 0, 0);

                const responsesThisMonth = await Feedback.countDocuments({
                    business_id: req.business._id,
                    submission_date: { $gte: startOfMonth }
                });

                // Add a warning header if approaching limit
                if (responsesThisMonth >= business.usage_limits.max_responses_per_month * 0.8) {
                    res.set('X-Subscription-Warning', `You've used ${responsesThisMonth} of your ${business.usage_limits.max_responses_per_month} monthly responses.`);
                }

                // If exceeded, we still allow viewing but add a warning
                if (responsesThisMonth > business.usage_limits.max_responses_per_month) {
                    res.set('X-Subscription-Limit-Exceeded', 'true');
                }
            }
        }

        next();
    } catch (error) {
        next(error);
    }
};
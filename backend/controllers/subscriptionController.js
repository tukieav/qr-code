// controllers/subscriptionController.js
const Business = require('../models/Business');
const QRCode = require('../models/QRCode');
const Survey = require('../models/Survey');
const Feedback = require('../models/Feedback');

// Get current subscription
exports.getCurrentSubscription = async (req, res, next) => {
    try {
        const business = await Business.findById(req.business._id).select(
            'subscription_plan subscription_status trial_ends_at subscription_starts_at subscription_ends_at usage_limits'
        );

        // Get usage statistics
        const surveysCount = await Survey.countDocuments({ business_id: req.business._id });
        const qrCodesCount = await QRCode.countDocuments({ business_id: req.business._id });

        // Calculate responses this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const responsesThisMonth = await Feedback.countDocuments({
            business_id: req.business._id,
            submission_date: { $gte: startOfMonth }
        });

        res.status(200).json({
            success: true,
            data: {
                subscription: business,
                usage: {
                    surveys: {
                        used: surveysCount,
                        limit: business.usage_limits.max_surveys
                    },
                    qrCodes: {
                        used: qrCodesCount,
                        limit: business.usage_limits.max_qr_codes
                    },
                    responsesThisMonth: {
                        used: responsesThisMonth,
                        limit: business.usage_limits.max_responses_per_month
                    }
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// Update subscription (simulate payment for now)
exports.updateSubscription = async (req, res, next) => {
    try {
        const { plan } = req.body;

        if (!['free', 'basic', 'pro'].includes(plan)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid subscription plan'
            });
        }

        // Set plan limits based on selected plan
        let usage_limits = {};

        switch (plan) {
            case 'free':
                usage_limits = {
                    max_surveys: 1,
                    max_qr_codes: 1,
                    max_responses_per_month: 100
                };
                break;
            case 'basic':
                usage_limits = {
                    max_surveys: 5,
                    max_qr_codes: 10,
                    max_responses_per_month: 1000
                };
                break;
            case 'pro':
                usage_limits = {
                    max_surveys: -1, // unlimited
                    max_qr_codes: -1, // unlimited
                    max_responses_per_month: -1 // unlimited
                };
                break;
        }

        // Set subscription dates
        const now = new Date();
        const oneMonthLater = new Date(now);
        oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

        // In a real app, you would process payment here
        // For now, we'll simulate successful payment for non-free plans

        // Update business subscription
        const business = await Business.findByIdAndUpdate(
            req.business._id,
            {
                subscription_plan: plan,
                subscription_status: plan === 'free' ? 'active' : 'active',
                subscription_starts_at: now,
                subscription_ends_at: plan === 'free' ? null : oneMonthLater,
                usage_limits: usage_limits,
                payment_method: plan === 'free' ? 'none' : 'card'
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: business
        });
    } catch (error) {
        next(error);
    }
};
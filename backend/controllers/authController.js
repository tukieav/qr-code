const jwt = require('jsonwebtoken');
const Business = require('../models/Business');

// @desc    Register a business
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { business_name, contact_email, password } = req.body;

        // Check if business already exists
        const businessExists = await Business.findOne({ contact_email });
        if (businessExists) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Generate tenant ID (could be more sophisticated in production)
        const tenant_id = `tenant_${Date.now()}`;

        // Create business
        const business = await Business.create({
            tenant_id,
            business_name,
            contact_email,
            password
        });

        // Generate token
        sendTokenResponse(business, 201, res);
    } catch (error) {
        next(error);
    }
};

// @desc    Login business
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { contact_email, password } = req.body;

        // Validate email & password
        if (!contact_email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an email and password'
            });
        }

        // Check for business
        const business = await Business.findOne({ contact_email });
        if (!business) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if password matches
        const isMatch = await business.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        sendTokenResponse(business, 200, res);
    } catch (error) {
        next(error);
    }
};

// Helper function to get token and send response
const sendTokenResponse = (business, statusCode, res) => {
    // Create token
    const token = jwt.sign(
        {
            id: business._id,
            tenant_id: business.tenant_id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRE
        }
    );

    res.status(statusCode).json({
        success: true,
        token,
        businessId: business._id,
        tenant_id: business.tenant_id,
        business_name: business.business_name,
        email: business.contact_email,
        subscription_plan: business.subscription_plan
    });
};
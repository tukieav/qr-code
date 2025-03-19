// models/Business.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const BusinessSchema = new mongoose.Schema({
    tenant_id: {
        type: String,
        required: true,
        unique: true
    },
    business_name: {
        type: String,
        required: true,
        trim: true
    },
    contact_email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    subscription_plan: {
        type: String,
        enum: ['free', 'basic', 'pro'],
        default: 'free'
    },
    subscription_status: {
        type: String,
        enum: ['active', 'trial', 'expired'],
        default: 'trial'
    },
    trial_ends_at: {
        type: Date,
        default: function() {
            const date = new Date();
            date.setDate(date.getDate() + 14); // 14-day trial
            return date;
        }
    },
    subscription_starts_at: Date,
    subscription_ends_at: Date,
    payment_method: {
        type: String,
        enum: ['card', 'bank_transfer', 'none'],
        default: 'none'
    },
    usage_limits: {
        max_surveys: {
            type: Number,
            default: 1
        },
        max_qr_codes: {
            type: Number,
            default: 1
        },
        max_responses_per_month: {
            type: Number,
            default: 100
        }
    },
    registration_date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Hash password before saving
BusinessSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
BusinessSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Business', BusinessSchema);
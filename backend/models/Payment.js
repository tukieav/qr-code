// models/Payment.js - nowy model dla płatności

const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    business_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true
    },
    checkout_session_id: {
        type: String
    },
    stripe_invoice_id: {
        type: String
    },
    stripe_subscription_id: {
        type: String
    },
    stripe_customer_id: {
        type: String
    },
    plan: {
        type: String,
        enum: ['free', 'basic', 'pro'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'canceled'],
        default: 'pending'
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'pln'
    },
    payment_date: {
        type: Date,
        default: Date.now
    },
    failure_message: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
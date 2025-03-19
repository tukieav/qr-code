const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    qr_code_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'QRCode',
        required: true
    },
    business_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true
    },
    tenant_id: {
        type: String,
        required: true
    },
    responses: [{
        question_id: String,
        question_text: String,
        question_type: String,
        answer: mongoose.Schema.Types.Mixed // Can be a number, string, or array
    }],
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        trim: true
    },
    submission_date: {
        type: Date,
        default: Date.now
    },
    client_info: {
        browser: String,
        device: String,
        ip: String // Note: Store this carefully, complying with privacy laws
    }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', FeedbackSchema);
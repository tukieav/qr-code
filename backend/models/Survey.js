const mongoose = require('mongoose');

const SurveySchema = new mongoose.Schema({
    business_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    questions: [{
        question_type: {
            type: String,
            enum: ['rating', 'text', 'multiple_choice'],
            required: true
        },
        question_text: {
            type: String,
            required: true
        },
        options: [String], // For multiple choice questions
        required: {
            type: Boolean,
            default: false
        }
    }],
    is_active: {
        type: Boolean,
        default: true
    },
    creation_date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Survey', SurveySchema);
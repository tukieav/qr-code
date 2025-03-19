// middleware/validator.js
const { validationResult } = require('express-validator');

// Middleware do sprawdzania błędów walidacji
exports.validate = (validations) => {
    return async (req, res, next) => {
        // Wykonanie wszystkich walidacji
        await Promise.all(validations.map(validation => validation.run(req)));

        // Sprawdzenie wyników walidacji
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        // Zwrócenie błędów walidacji
        return res.status(400).json({
            success: false,
            message: 'Błąd walidacji danych',
            errors: errors.array()
        });
    };
};

// Przykładowe reguły walidacji dla biznesu
exports.businessRules = {
    register: [
        body('business_name').trim().notEmpty().withMessage('Nazwa firmy jest wymagana'),
        body('contact_email').isEmail().withMessage('Podaj poprawny adres email'),
        body('password').isLength({ min: 6 }).withMessage('Hasło musi mieć co najmniej 6 znaków')
    ],
    login: [
        body('contact_email').isEmail().withMessage('Podaj poprawny adres email'),
        body('password').notEmpty().withMessage('Hasło jest wymagane')
    ]
};

// Przykładowe reguły walidacji dla ankiet
exports.surveyRules = {
    create: [
        body('title').trim().notEmpty().withMessage('Tytuł ankiety jest wymagany'),
        body('questions').isArray({ min: 1 }).withMessage('Ankieta musi zawierać co najmniej jedno pytanie'),
        body('questions.*.question_text').trim().notEmpty().withMessage('Tekst pytania jest wymagany'),
        body('questions.*.question_type').isIn(['rating', 'text', 'multiple_choice']).withMessage('Niepoprawny typ pytania')
    ]
};

// Przykładowe reguły walidacji dla kodów QR
exports.qrCodeRules = {
    create: [
        body('name').trim().notEmpty().withMessage('Nazwa kodu QR jest wymagana'),
        body('survey_id').isMongoId().withMessage('Niepoprawne ID ankiety')
    ]
};
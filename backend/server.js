// backend/server.js
const connectDB = require('./config/db');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const config = require('./config');
const errorHandler = require('./middleware/errorHandler');

// Inicjalizacja serwera Express
const app = express();

// Połączenie z bazą danych
connectDB();

// Middleware bezpieczeństwa
if (process.env.NODE_ENV === 'production') {
    // Helmet (bezpieczeństwo nagłówków HTTP)
    app.use(helmet(config.helmet));

    // Przekierowanie HTTP na HTTPS w produkcji
    if (config.security && config.security.enableHttpsRedirect) {
        app.use((req, res, next) => {
            if (req.header('x-forwarded-proto') !== 'https') {
                res.redirect(`https://${req.header('host')}${req.url}`);
            } else {
                next();
            }
        });
    }
}

// Kompresja odpowiedzi
if (config.security && config.security.enableCompression) {
    app.use(compression());
}

// Specjalna konfiguracja dla webhooków Stripe (potrzebujemy surowego body)
app.post('/api/subscription/webhook', express.raw({ type: 'application/json' }));


// Parsowanie danych JSON
app.use(express.json());

// Parsowanie danych formularza
app.use(express.urlencoded({ extended: false }));

// Konfiguracja CORS
app.use(cors(config.cors));

// Logowanie żądań HTTP
app.use(morgan(config.logging.format));

// Ograniczenie liczby żądań
if (process.env.NODE_ENV !== 'test' ||
    (config.rateLimit && config.rateLimit.enabled !== false)) {
    const limiter = rateLimit({
        windowMs: config.rateLimit.windowMs,
        max: config.rateLimit.max,
        message: config.rateLimit.message || 'Too many requests, please try again later'
    });
    app.use(limiter);
}

// Trasy API
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/businesses', require('./routes/businessRoutes'));
app.use('/api/surveys', require('./routes/surveyRoutes'));
app.use('/api/qrcodes', require('./routes/qrCodeRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/subscription', require('./routes/subscriptionRoutes'));

// Publiczna trasa do ankiet (dostępna bez uwierzytelniania)
app.use('/survey', require('./routes/publicSurveyRoute'));

// Obsługa błędów 404
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Middleware obsługi błędów
app.use(errorHandler);

// Uruchomienie serwera
const PORT = config.port || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Obsługa błędów niezłapanych
process.on('unhandledRejection', (err, promise) => {
    console.error(`Error: ${err.message}`);

    // Zamknij serwer i zakończ proces w przypadku krytycznego błędu
    if (process.env.NODE_ENV === 'production') {
        server.close(() => process.exit(1));
    }
});

module.exports = server; // Eksport dla testów
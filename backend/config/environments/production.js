// backend/config/environments/production.js

/**
 * Konfiguracja specyficzna dla środowiska produkcyjnego
 */
module.exports = {
    // Tryb debugowania wyłączony
    debug: false,

    // Dodatkowe opcje dla bazy danych w produkcji
    db: {
        debug: false,
        logQueries: false,
        connectTimeoutMS: 30000, // Dłuższy timeout połączenia
        socketTimeoutMS: 30000,  // Dłuższy timeout socketu
        // Dodatkowe opcje bezpieczeństwa dla MongoDB
        ssl: true,
        sslValidate: true,
        retryWrites: true,
        w: 'majority' // Większa trwałość zapisu
    },

    // Limity dla produkcji
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minut
        max: 100, // Bardziej rygorystyczny limit
        message: 'Zbyt wiele żądań, spróbuj ponownie później'
    },

    // Konfiguracja CORS dla produkcji
    cors: {
        origin: process.env.FRONTEND_URL || 'https://qr-opinion.pl', // Tylko dozwolone domeny
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    },

    // Konfiguracja logowania
    logging: {
        level: 'error', // W produkcji logujemy tylko błędy
        format: 'combined'
    },

    // Konfiguracja helmet dla bezpieczeństwa
    helmet: {
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", 'data:'],
                connectSrc: ["'self'"],
                fontSrc: ["'self'"],
                objectSrc: ["'none'"],
                mediaSrc: ["'self'"],
                frameSrc: ["'none'"]
            }
        },
        xssFilter: true,
        noSniff: true,
        referrerPolicy: { policy: 'same-origin' },
        hsts: {
            maxAge: 15552000, // 180 dni
            includeSubDomains: true,
            preload: true
        }
    },

    // Dodatkowe ustawienia bezpieczeństwa
    security: {
        enableHttpsRedirect: true,
        enableCompression: true
    }
};
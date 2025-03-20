// backend/config/environments/development.js

/**
 * Konfiguracja specyficzna dla środowiska developerskiego
 */
module.exports = {
    // Tryb debugowania
    debug: true,

    // Dodatkowe opcje dla bazy danych w środowisku developerskim
    db: {
        debug: true,
        logQueries: true
    },

    // Limity dla środowiska developerskiego
    rateLimit: {
        // Bardziej liberalne limity dla developmentu
        windowMs: 5 * 60 * 1000, // 5 minut
        max: 1000 // wyższy limit na jedno IP
    },

    // Konfiguracja CORS dla środowiska developerskiego
    cors: {
        origin: '*', // Zezwalaj na wszystkie źródła w dev
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    },

    // Konfiguracja logowania
    logging: {
        level: 'debug',
        format: 'dev'
    },

    // Konfiguracja testowego konta
    testAccount: {
        email: 'test@example.com',
        password: 'testpassword'
    }
};
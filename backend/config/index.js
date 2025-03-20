// backend/config/index.js
const dotenv = require('dotenv');
const path = require('path');

// Ładowanie zmiennych środowiskowych z pliku .env
dotenv.config();

// Określenie środowiska aplikacji
const NODE_ENV = process.env.NODE_ENV || 'development';

// Ładowanie odpowiedniego pliku konfiguracyjnego dla danego środowiska
const envConfig = require(path.join(__dirname, 'environments', `${NODE_ENV}.js`));

// Domyślna konfiguracja wspólna dla wszystkich środowisk
const defaultConfig = {
    // Serwer
    port: parseInt(process.env.PORT, 10) || 5000,
    host: process.env.HOST || 'localhost',

    // Baza danych
    db: {
        uri: process.env.MONGO_URI || 'mongodb://localhost:27017/qr-opinion',
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    },

    // JWT
    jwt: {
        secret: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
        expiresIn: process.env.JWT_EXPIRE || '30d'
    },

    // URL frontendu
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',

    // Limity
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minut
        max: 100 // limit na jedno IP
    },

    // Email
    email: {
        from: process.env.EMAIL_FROM || 'noreply@qr-opinion.pl',
        smtp: {
            host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
            port: parseInt(process.env.SMTP_PORT, 10) || 2525,
            auth: {
                user: process.env.SMTP_USER || '',
                pass: process.env.SMTP_PASSWORD || ''
            }
        }
    },

    // Plany subskrypcji
    subscriptionPlans: {
        free: {
            maxSurveys: 1,
            maxQRCodes: 1,
            maxResponsesPerMonth: 100
        },
        basic: {
            maxSurveys: 5,
            maxQRCodes: 10,
            maxResponsesPerMonth: 1000
        },
        pro: {
            maxSurveys: -1, // brak limitu
            maxQRCodes: -1, // brak limitu
            maxResponsesPerMonth: -1 // brak limitu
        }
    }
};

// Połączenie domyślnej konfiguracji ze specyficzną dla środowiska
const config = {
    ...defaultConfig,
    ...envConfig
};

// Funkcja pomocnicza do połączenia zagnieżdżonych obiektów
function mergeDeep(target, source) {
    const isObject = obj => obj && typeof obj === 'object';

    if (!isObject(target) || !isObject(source)) {
        return source;
    }

    Object.keys(source).forEach(key => {
        const targetValue = target[key];
        const sourceValue = source[key];

        if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
            target[key] = targetValue.concat(sourceValue);
        } else if (isObject(targetValue) && isObject(sourceValue)) {
            target[key] = mergeDeep(Object.assign({}, targetValue), sourceValue);
        } else {
            target[key] = sourceValue;
        }
    });

    return target;
}

// Eksport scalonej konfiguracji
module.exports = config;

// Eksport funkcji połączenia konfiguracji dla testów i innych zastosowań
module.exports.mergeDeep = mergeDeep;
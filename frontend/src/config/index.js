// frontend/src/config/index.js

/**
 * Centralna konfiguracja dla aplikacji frontendowej
 * Agreguje wszystkie zmienne środowiskowe i stałe konfiguracyjne
 */

// Tryb aplikacji (development, production, test)
const ENV = process.env.NODE_ENV || 'development';

// Domyślne wartości konfiguracyjne
const defaultConfig = {
    // API
    api: {
        baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
        timeout: 10000, // 10 sekund
        withCredentials: false,
    },

    // Autentykacja
    auth: {
        tokenKey: 'token',
        userKey: 'user',
        expiresIn: 86400000, // 24 godziny w milisekundach
    },

    // Konfiguracja UI
    ui: {
        theme: 'light',
        animationsEnabled: true,
        toastDuration: 5000, // 5 sekund
        paginationSize: 10,
        dateFormat: 'DD-MM-YYYY',
        timeFormat: 'HH:mm',
    },

    // Funkcje QR
    qrCode: {
        defaultSize: 200,
        defaultLevel: 'H', // "L", "M", "Q", "H"
        defaultMargin: 1,
        logoSize: 40,
        downloadFormat: 'png',
    },

    // Konfiguracja ankiet
    survey: {
        maxQuestions: 20,
        maxOptions: 10,
        maxTitleLength: 100,
        maxQuestionLength: 200,
        defaultActiveStatus: true,
    },

    // Konfiguracja grafów
    charts: {
        colors: [
            '#4E79A7', '#F28E2B', '#E15759', '#76B7B2',
            '#59A14F', '#EDC949', '#AF7AA1', '#FF9DA7',
            '#9C755F', '#BAB0AC'
        ],
        fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
        gridColor: '#E0E0E0',
        responsive: true,
    },

    // Ścieżki aplikacji
    routes: {
        home: '/',
        login: '/login',
        register: '/register',
        dashboard: '/dashboard',
        surveys: '/surveys',
        qrCodes: '/qrcodes',
        feedback: '/feedback',
        settings: '/settings',
        subscription: '/subscription',
        notFound: '/404',
    }
};

// Dodatkowe konfiguracje dla różnych środowisk
const environmentConfig = {
    development: {
        api: {
            baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
            mockEnabled: true,
            logRequests: true
        },
        debug: true,
        devTools: true
    },

    production: {
        api: {
            baseURL: process.env.REACT_APP_API_URL || 'https://api.qr-opinion.pl/api',
            mockEnabled: false,
            logRequests: false
        },
        ui: {
            toastDuration: 3000 // Krótsze powiadomienia w produkcji
        },
        debug: false,
        devTools: false
    },

    test: {
        api: {
            baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
            mockEnabled: true,
            timeout: 1000 // Krótszy timeout dla testów
        },
        auth: {
            expiresIn: 3600000 // 1 godzina dla testów
        },
        debug: true,
        devTools: true
    }
};

// Scal konfiguracje
const config = {
    ...defaultConfig,
    ...(environmentConfig[ENV] || {})
};

// Helper do głębokiego scalania obiektów
function mergeDeep(target, source) {
    if (!source) return target;

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
            target[key] = mergeDeep({ ...targetValue }, sourceValue);
        } else {
            target[key] = sourceValue;
        }
    });

    return target;
}

// Eksport konfiguracji
export default config;

// Eksport funkcji pomocniczych
export const getApiUrl = (endpoint) => `${config.api.baseURL}/${endpoint.replace(/^\//, '')}`;
export const getTokenFromStorage = () => localStorage.getItem(config.auth.tokenKey);
export const getUserFromStorage = () => {
    const user = localStorage.getItem(config.auth.userKey);
    return user ? JSON.parse(user) : null;
};
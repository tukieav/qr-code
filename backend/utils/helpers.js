// utils/helpers.js
const crypto = require('crypto');

/**
 * Generuje losowy token
 * @param {Number} bytes - Liczba bajtów
 * @returns {String} - Wygenerowany token w postaci heksadecymalnej
 */
exports.generateToken = (bytes = 32) => {
    return crypto.randomBytes(bytes).toString('hex');
};

/**
 * Formatuje datę do lokalnego formatu
 * @param {Date} date - Data do sformatowania
 * @param {String} locale - Kod języka (np. 'pl-PL')
 * @returns {String} - Sformatowana data
 */
exports.formatDate = (date, locale = 'pl-PL') => {
    return new Date(date).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

/**
 * Oblicza statystyki dla zebranych ocen
 * @param {Array} ratings - Tablica ocen
 * @returns {Object} - Obiekt ze statystykami
 */
exports.calculateRatingStats = (ratings) => {
    if (!ratings || ratings.length === 0) {
        return {
            average: 0,
            count: 0,
            distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        };
    }

    // Inicjalizacja dystrybucji ocen
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    // Obliczenie sumy i dystrybucji
    const sum = ratings.reduce((acc, rating) => {
        // Upewnij się, że rating jest liczbą między 1 a 5
        const validRating = Math.min(Math.max(Math.round(rating), 1), 5);
        distribution[validRating]++;
        return acc + validRating;
    }, 0);

    return {
        average: (sum / ratings.length).toFixed(1),
        count: ratings.length,
        distribution
    };
};

/**
 * Paginacja listy elementów
 * @param {Array} items - Lista elementów
 * @param {Number} page - Numer strony
 * @param {Number} limit - Liczba elementów na stronę
 * @returns {Object} - Obiekt z paginacją
 */
exports.paginate = (items, page = 1, limit = 10) => {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {
        total: items.length,
        page,
        limit,
        totalPages: Math.ceil(items.length / limit),
        data: items.slice(startIndex, endIndex)
    };

    if (endIndex < items.length) {
        results.next = {
            page: page + 1,
            limit
        };
    }

    if (startIndex > 0) {
        results.prev = {
            page: page - 1,
            limit
        };
    }

    return results;
};

/**
 * Normalizuje string do użycia w URL
 * @param {String} text - Tekst do znormalizowania
 * @returns {String} - Znormalizowany tekst
 */
exports.slugify = (text) => {
    return text
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
};
/**
 * Walidacja numeru karty płatniczej z użyciem algorytmu Luhna
 * @param {String} cardNumber - Numer karty do walidacji
 * @returns {Boolean} - Czy numer karty jest poprawny
 */
exports.validateCreditCard = (cardNumber) => {
    // Usuń białe znaki i sprawdź, czy zawiera tylko cyfry
    const sanitizedNumber = cardNumber.replace(/\s+/g, '');
    if (!/^\d+$/.test(sanitizedNumber)) return false;

    // Algorytm Luhna
    let sum = 0;
    let doubleUp = false;

    for (let i = sanitizedNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(sanitizedNumber.charAt(i), 10);

        if (doubleUp) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }

        sum += digit;
        doubleUp = !doubleUp;
    }

    return sum % 10 === 0;
};

/**
 * Maskowanie numeru karty płatniczej
 * @param {String} cardNumber - Pełny numer karty
 * @returns {String} - Zamaskowany numer karty
 */
exports.maskCreditCard = (cardNumber) => {
    if (!cardNumber) return '';

    // Usuń białe znaki
    const sanitizedNumber = cardNumber.replace(/\s+/g, '');

    // Pozostaw pierwsze 6 i ostatnie 4 cyfry
    const firstSix = sanitizedNumber.substring(0, 6);
    const lastFour = sanitizedNumber.substring(sanitizedNumber.length - 4);

    // Zamaskuj środkowe cyfry
    const maskedMiddle = '•'.repeat(sanitizedNumber.length - 10);

    // Sformatuj dla czytelności
    return `${firstSix} ${maskedMiddle} ${lastFour}`;
};
// utils/qrGenerator.js
const QRCode = require('qrcode');
const fs = require('fs').promises;
const path = require('path');

/**
 * Generuje kod QR jako dane URL
 * @param {String} url - URL do zakodowania
 * @param {Object} options - Opcje kodu QR
 * @returns {Promise<String>} - Data URL kodu QR
 */
exports.generateQRCode = async (url, options = {}) => {
    try {
        const defaultOptions = {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            quality: 0.92,
            margin: 1,
            color: {
                dark: '#000000FF',
                light: '#FFFFFFFF'
            }
        };

        const qrCodeOptions = { ...defaultOptions, ...options };
        const qrCode = await QRCode.toDataURL(url, qrCodeOptions);

        return qrCode;
    } catch (error) {
        console.error('Błąd generowania kodu QR:', error);
        throw new Error('Nie udało się wygenerować kodu QR');
    }
};

/**
 * Generuje kod QR i zapisuje go jako plik
 * @param {String} url - URL do zakodowania
 * @param {String} fileName - Nazwa pliku (bez rozszerzenia)
 * @param {String} outputDir - Katalog wyjściowy
 * @param {Object} options - Opcje kodu QR
 * @returns {Promise<String>} - Ścieżka do zapisanego pliku
 */
exports.generateQRCodeToFile = async (url, fileName, outputDir = 'public/qrcodes', options = {}) => {
    try {
        const defaultOptions = {
            errorCorrectionLevel: 'H',
            type: 'png',
            quality: 0.92,
            margin: 1,
            color: {
                dark: '#000000FF',
                light: '#FFFFFFFF'
            }
        };

        const qrCodeOptions = { ...defaultOptions, ...options };

        // Upewnij się, że katalog istnieje
        await fs.mkdir(outputDir, { recursive: true });

        const filePath = path.join(outputDir, `${fileName}.png`);

        // Generowanie kodu QR i zapis do pliku
        await QRCode.toFile(filePath, url, qrCodeOptions);

        return filePath;
    } catch (error) {
        console.error('Błąd generowania i zapisywania kodu QR:', error);
        throw new Error('Nie udało się wygenerować i zapisać kodu QR');
    }
};

/**
 * Generuje kod QR z logo w środku
 * @param {String} url - URL do zakodowania
 * @param {String} logoPath - Ścieżka do pliku logo
 * @param {Object} options - Opcje kodu QR
 * @returns {Promise<String>} - Data URL kodu QR z logo
 */
exports.generateQRCodeWithLogo = async (url, logoPath, options = {}) => {
    try {
        // Ta funkcja wymaga dodatkowej implementacji używając canvas lub innej biblioteki
        // do nakładania logo na kod QR. Poniżej jest uproszczona wersja.

        // Tutaj powinna być logika generowania kodu QR i dodawania logo
        // Implementacja wymaga użycia canvas lub podobnej biblioteki

        throw new Error('Funkcja generateQRCodeWithLogo nie jest jeszcze zaimplementowana');
    } catch (error) {
        console.error('Błąd generowania kodu QR z logo:', error);
        throw error;
    }
};
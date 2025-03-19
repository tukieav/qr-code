// utils/qrGenerator.js
const QRCode = require('qrcode');

// Generate QR code as data URL
const generateQRCode = async (url) => {
    try {
        const qrCode = await QRCode.toDataURL(url, {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            quality: 0.92,
            margin: 1
        });
        return qrCode;
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw new Error('Failed to generate QR code');
    }
};

module.exports = { generateQRCode };
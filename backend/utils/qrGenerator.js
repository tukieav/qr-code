// backend/utils/qrGenerator.js
const QRCode = require('qrcode');

// Generate QR code data URL
exports.generateQRCode = async (url) => {
    try {
        const qrCodeDataURL = await QRCode.toDataURL(url, {
            errorCorrectionLevel: 'H',
            type: 'image/png',
            margin: 1,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        });

        return qrCodeDataURL;
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw new Error('Failed to generate QR code');
    }
};
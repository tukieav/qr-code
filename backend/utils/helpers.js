// backend/utils/helpers.js
// Date formatting helper
exports.formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

// Generate a random string
exports.generateRandomString = (length = 10) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

// QR code generator utility
exports.generateQRCode = async (text) => {
    const QRCode = require('qrcode');
    try {
        const url = await QRCode.toDataURL(text);
        return url;
    } catch (err) {
        console.error(err);
        throw new Error('QR code generation failed');
    }
};
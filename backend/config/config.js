// backend/config/config.js
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

module.exports = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000,
    mongoURI: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpire: process.env.JWT_EXPIRE || '30d',
    frontendURL: process.env.FRONTEND_URL || 'http://localhost:3000'
};
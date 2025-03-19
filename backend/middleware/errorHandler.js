// backend/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message || 'Server Error';

    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(val => val.message).join(', ');
    }

    // Handle Mongoose duplicate key
    if (err.code === 11000) {
        statusCode = 400;
        message = `Duplicate value entered for ${Object.keys(err.keyValue)} field`;
    }

    // Handle Mongoose bad ObjectId
    if (err.name === 'CastError') {
        statusCode = 404;
        message = `Resource not found`;
    }

    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
    });
};

module.exports = errorHandler;
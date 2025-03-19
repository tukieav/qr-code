// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    // Domyślny status błędu
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message || 'Wystąpił błąd serwera';

    // Sprawdzanie błędów Mongoose walidacji
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(val => val.message).join(', ');
    }

    // Sprawdzanie błędów Mongoose duplicate key
    if (err.code === 11000) {
        statusCode = 400;
        message = `Duplikat wartości w polu: ${Object.keys(err.keyValue).join(', ')}`;
    }

    // Sprawdzanie błędów Mongoose invalid ID
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404;
        message = 'Nie znaleziono zasobu';
    }

    // Logowanie błędu do konsoli
    console.error(`[${new Date().toISOString()}] ${err.stack}`);

    // Wysyłanie odpowiedzi z błędem
    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

module.exports = errorHandler;
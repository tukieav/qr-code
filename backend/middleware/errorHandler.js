// middleware/errorHandler.js - poprawki
const errorHandler = (err, req, res, next) => {
    // Dodanie logowania błędów
    console.error(`[${new Date().toISOString()}] ${err.stack}`);

    // Domyślny status błędu
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message || 'Wystąpił błąd serwera';
    let errors = [];

    // Obsługa błędów Mongoose walidacji
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Błąd walidacji danych';
        errors = Object.values(err.errors).map(val => ({
            field: val.path,
            message: val.message
        }));
    }

    // Sprawdzanie błędów Mongoose duplicate key
    if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue)[0];
        message = `Duplikat wartości w polu: ${field}`;
        errors = [{ field, message }];
    }

    // Sprawdzanie błędów Mongoose invalid ID
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 404;
        message = 'Nie znaleziono zasobu';
    }

    // Wysyłanie odpowiedzi z błędem
    res.status(statusCode).json({
        success: false,
        message,
        errors: errors.length > 0 ? errors : undefined,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

module.exports = errorHandler;
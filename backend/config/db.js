// backend/config/db.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Załaduj zmienne środowiskowe z pliku .env
dotenv.config();

/**
 * Funkcja nawiązująca połączenie z bazą danych MongoDB
 * używając konfiguracji z pliku .env
 */
const connectDB = async () => {
    try {
        // Użyj bezpośrednio URI z zmiennych środowiskowych
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/qr-opinion';

        const conn = await mongoose.connect(mongoURI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Dodatkowe konfiguracje dla trybu debug
        if (process.env.NODE_ENV === 'development') {
            mongoose.set('debug', true);
        }

        return conn;
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        // Zamknij proces w przypadku błędu połączenia w produkcji
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
        throw error;
    }
};

module.exports = connectDB;
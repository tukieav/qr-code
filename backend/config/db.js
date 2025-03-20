// backend/config/db.js
const mongoose = require('mongoose');
const config = require('./index');

/**
 * Funkcja nawiązująca połączenie z bazą danych MongoDB
 * używając scentralizowanej konfiguracji
 */
const connectDB = async () => {
    try {
        // Użyj konfiguracji z pliku config/index.js
        const conn = await mongoose.connect(config.db.uri, config.db.options);

        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Dodatkowe konfiguracje dla trybu debug
        if (config.debug && config.db.debug) {
            mongoose.set('debug', true);
        }

        // Obsługa zdarzeń połączenia
        mongoose.connection.on('error', (err) => {
            console.error(`MongoDB connection error: ${err}`);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB disconnected, attempting to reconnect...');
        });

        mongoose.connection.on('reconnected', () => {
            console.info('MongoDB reconnected successfully');
        });

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
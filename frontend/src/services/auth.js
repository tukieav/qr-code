// src/services/auth.js
import api from './api';

/**
 * Rejestruje nową firmę
 * @param {Object} userData - Dane rejestracji
 * @returns {Promise} Promise zawierający dane odpowiedzi
 */
export const register = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData);

        // Zapisz token i dane użytkownika w localStorage
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
        }

        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Loguje firmę
 * @param {String} email - Email firmy
 * @param {String} password - Hasło firmy
 * @returns {Promise} Promise zawierający dane odpowiedzi
 */
export const login = async (email, password) => {
    try {
        const response = await api.post('/auth/login', {
            contact_email: email,
            password
        });

        // Zapisz token i dane użytkownika w localStorage
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
        }

        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Wylogowuje użytkownika
 */
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Opcjonalnie: przekierowanie na stronę logowania
    window.location.href = '/login';
};

/**
 * Pobiera aktualnie zalogowanego użytkownika z localStorage
 * @returns {Object|null} Dane użytkownika lub null
 */
export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

/**
 * Sprawdza czy użytkownik jest zalogowany
 * @returns {Boolean} Czy użytkownik jest zalogowany
 */
export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

/**
 * Wysyła żądanie zresetowania hasła
 * @param {String} email - Email firmy
 * @returns {Promise} Promise zawierający dane odpowiedzi
 */
export const forgotPassword = async (email) => {
    try {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Resetuje hasło
 * @param {String} token - Token resetowania hasła
 * @param {String} password - Nowe hasło
 * @returns {Promise} Promise zawierający dane odpowiedzi
 */
export const resetPassword = async (token, password) => {
    try {
        const response = await api.post('/auth/reset-password', {
            token,
            password
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Zmienia hasło zalogowanego użytkownika
 * @param {String} currentPassword - Obecne hasło
 * @param {String} newPassword - Nowe hasło
 * @returns {Promise} Promise zawierający dane odpowiedzi
 */
export const changePassword = async (currentPassword, newPassword) => {
    try {
        const response = await api.put('/businesses/change-password', {
            currentPassword,
            newPassword
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
// src/services/qrService.js
import api from './api';
import { QRCodeSVG } from 'qrcode.react';

/**
 * Pobiera listę kodów QR
 * @returns {Promise} Promise zawierający dane odpowiedzi
 */
export const getQRCodes = async () => {
    try {
        const response = await api.get('/qrcodes');
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Pobiera pojedynczy kod QR
 * @param {String} id - ID kodu QR
 * @returns {Promise} Promise zawierający dane odpowiedzi
 */
export const getQRCode = async (id) => {
    try {
        const response = await api.get(`/qrcodes/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Tworzy nowy kod QR
 * @param {Object} qrCodeData - Dane kodu QR
 * @returns {Promise} Promise zawierający dane odpowiedzi
 */
export const createQRCode = async (qrCodeData) => {
    try {
        const response = await api.post('/qrcodes', qrCodeData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Aktualizuje kod QR
 * @param {String} id - ID kodu QR
 * @param {Object} qrCodeData - Dane kodu QR
 * @returns {Promise} Promise zawierający dane odpowiedzi
 */
export const updateQRCode = async (id, qrCodeData) => {
    try {
        const response = await api.put(`/qrcodes/${id}`, qrCodeData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Usuwa kod QR
 * @param {String} id - ID kodu QR
 * @returns {Promise} Promise zawierający dane odpowiedzi
 */
export const deleteQRCode = async (id) => {
    try {
        const response = await api.delete(`/qrcodes/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Generuje kod QR jako komponent React
 * @param {String} url - URL do zakodowania
 * @param {Object} options - Opcje kodu QR
 * @returns {JSX.Element} Komponent kodu QR
 */
export const generateQRCodeComponent = (url, options = {}) => {
    const defaultOptions = {
        size: 200,
        level: 'H',
        includeMargin: true,
        bgColor: '#ffffff',
        fgColor: '#000000'
    };

    const qrOptions = { ...defaultOptions, ...options };

    return (
        <QRCodeSVG
            value={url}
            size={qrOptions.size}
            level={qrOptions.level}
            includeMargin={qrOptions.includeMargin}
            bgColor={qrOptions.bgColor}
            fgColor={qrOptions.fgColor}
        />
    );
};

/**
 * Pobiera URL dla QR kodu
 * @param {String} uniqueCode - Unikalny kod QR
 * @returns {String} URL ankiety
 */
export const getQRCodeSurveyUrl = (uniqueCode) => {
    const frontendUrl = process.env.REACT_APP_FRONTEND_URL || window.location.origin;
    return `${frontendUrl}/survey/${uniqueCode}`;
};

/**
 * Pobiera statystyki skanowania kodu QR
 * @param {String} id - ID kodu QR
 * @returns {Promise} Promise zawierający dane odpowiedzi
 */
export const getQRCodeStats = async (id) => {
    try {
        const response = await api.get(`/qrcodes/${id}/stats`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
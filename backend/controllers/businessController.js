// controllers/businessController.js
const Business = require('../models/Business');

// @desc    Pobierz profil firmy
// @route   GET /api/businesses/profile
// @access  Private
exports.getBusinessProfile = async (req, res, next) => {
    try {
        const business = await Business.findById(req.business._id).select('-password');

        if (!business) {
            return res.status(404).json({
                success: false,
                message: 'Profil firmy nie znaleziony'
            });
        }

        res.status(200).json({
            success: true,
            data: business
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Aktualizuj profil firmy
// @route   PUT /api/businesses/profile
// @access  Private
exports.updateBusinessProfile = async (req, res, next) => {
    try {
        // Dozwolone pola do aktualizacji
        const fieldsToUpdate = {
            business_name: req.body.business_name,
            contact_email: req.body.contact_email,
            logo_url: req.body.logo_url,
            address: req.body.address,
            phone: req.body.phone,
            website: req.body.website
        };

        // Usunięcie pustych pól
        Object.keys(fieldsToUpdate).forEach(key =>
            fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
        );

        // Aktualizacja profilu
        const business = await Business.findByIdAndUpdate(
            req.business._id,
            { $set: fieldsToUpdate },
            { new: true, runValidators: true }
        ).select('-password');

        res.status(200).json({
            success: true,
            data: business
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Zmień hasło
// @route   PUT /api/businesses/change-password
// @access  Private
exports.changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Sprawdź czy podano wymagane pola
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Wymagane jest obecne i nowe hasło'
            });
        }

        // Znajdź firmę i sprawdź obecne hasło
        const business = await Business.findById(req.business._id);

        if (!business) {
            return res.status(404).json({
                success: false,
                message: 'Firma nie znaleziona'
            });
        }

        // Sprawdź czy obecne hasło jest poprawne
        const isMatch = await business.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Obecne hasło jest nieprawidłowe'
            });
        }

        // Aktualizuj hasło
        business.password = newPassword;
        await business.save();

        res.status(200).json({
            success: true,
            message: 'Hasło zostało zmienione pomyślnie'
        });
    } catch (error) {
        next(error);
    }
};
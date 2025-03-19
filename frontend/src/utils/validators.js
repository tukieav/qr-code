// frontend/src/utils/validators.js
/**
 * Waliduje adres email
 * @param {String} email - Adres email do walidacji
 * @returns {Boolean} - Czy email jest poprawny
 */
export const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
};

/**
 * Waliduje hasło
 * @param {String} password - Hasło do walidacji
 * @returns {Object} - Rezultat walidacji z informacją o poprawności i komunikatem
 */
export const validatePassword = (password) => {
    if (!password) {
        return { isValid: false, message: 'Hasło jest wymagane' };
    }

    if (password.length < 6) {
        return { isValid: false, message: 'Hasło musi mieć co najmniej 6 znaków' };
    }

    // Opcjonalnie: sprawdzanie złożoności hasła
    // const hasUpperCase = /[A-Z]/.test(password);
    // const hasLowerCase = /[a-z]/.test(password);
    // const hasNumbers = /\d/.test(password);
    // const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    // if (!(hasUpperCase && hasLowerCase && hasNumbers)) {
    //   return { isValid: false, message: 'Hasło musi zawierać dużą literę, małą literę i cyfrę' };
    // }

    return { isValid: true, message: '' };
};

/**
 * Waliduje tytuł ankiety
 * @param {String} title - Tytuł ankiety do walidacji
 * @returns {Object} - Rezultat walidacji
 */
export const validateSurveyTitle = (title) => {
    if (!title || title.trim() === '') {
        return { isValid: false, message: 'Tytuł ankiety jest wymagany' };
    }

    if (title.length > 100) {
        return { isValid: false, message: 'Tytuł ankiety nie może przekraczać 100 znaków' };
    }

    return { isValid: true, message: '' };
};

/**
 * Waliduje pytanie ankiety
 * @param {Object} question - Obiekt pytania do walidacji
 * @returns {Object} - Rezultat walidacji
 */
export const validateQuestion = (question) => {
    if (!question.question_text || question.question_text.trim() === '') {
        return { isValid: false, message: 'Tekst pytania jest wymagany' };
    }

    if (question.question_text.length > 200) {
        return { isValid: false, message: 'Tekst pytania nie może przekraczać 200 znaków' };
    }

    if (!['rating', 'text', 'multiple_choice'].includes(question.question_type)) {
        return { isValid: false, message: 'Nieprawidłowy typ pytania' };
    }

    // Dodatkowa walidacja dla pytań typu multiple_choice
    if (question.question_type === 'multiple_choice') {
        if (!question.options || !Array.isArray(question.options) || question.options.length < 2) {
            return { isValid: false, message: 'Pytanie wielokrotnego wyboru wymaga co najmniej 2 opcji' };
        }

        // Sprawdzenie czy wszystkie opcje mają wartość
        const emptyOptions = question.options.some(option => !option || option.trim() === '');
        if (emptyOptions) {
            return { isValid: false, message: 'Wszystkie opcje muszą mieć tekst' };
        }
    }

    return { isValid: true, message: '' };
};

/**
 * Waliduje formularz rejestracji
 * @param {Object} formData - Dane formularza rejestracji
 * @returns {Object} - Obiekt z błędami walidacji
 */
export const validateRegistrationForm = (formData) => {
    const errors = {};

    if (!formData.business_name || formData.business_name.trim() === '') {
        errors.business_name = 'Nazwa firmy jest wymagana';
    }

    if (!formData.contact_email) {
        errors.contact_email = 'Email jest wymagany';
    } else if (!isValidEmail(formData.contact_email)) {
        errors.contact_email = 'Podaj poprawny adres email';
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
        errors.password = passwordValidation.message;
    }

    if (formData.password !== formData.confirm_password) {
        errors.confirm_password = 'Hasła nie są zgodne';
    }

    return errors;
};
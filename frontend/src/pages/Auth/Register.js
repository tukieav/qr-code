// frontend/src/pages/Auth/Register.js
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { UIContext } from '../../context/UIContext';
import { isValidEmail, validatePassword } from '../../utils/validators';

const Register = () => {
    const [formData, setFormData] = useState({
        business_name: '',
        contact_email: '',
        password: '',
        confirm_password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        feedback: ''
    });

    const { register } = useContext(AuthContext);
    const { showNotification } = useContext(UIContext);
    const navigate = useNavigate();

    // Obsługa zmiany danych formularza
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));

        // Aktualizacja oceny siły hasła
        if (name === 'password') {
            updatePasswordStrength(value);
        }

        // Usunięcie błędu walidacji po zmianie pola
        if (validationErrors[name]) {
            setValidationErrors(prevErrors => ({
                ...prevErrors,
                [name]: ''
            }));
        }
    };

    // Ocena siły hasła
    const updatePasswordStrength = (password) => {
        if (!password) {
            setPasswordStrength({ score: 0, feedback: '' });
            return;
        }

        // Prosta logika oceny siły hasła
        let score = 0;
        let feedback = '';

        if (password.length >= 8) score += 1;
        if (password.length >= 12) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;

        if (score < 2) {
            feedback = 'Słabe hasło';
        } else if (score < 4) {
            feedback = 'Średnie hasło';
        } else {
            feedback = 'Silne hasło';
        }

        setPasswordStrength({ score, feedback });
    };

    // Walidacja formularza
    const validateForm = () => {
        const errors = {};

        if (!formData.business_name.trim()) {
            errors.business_name = 'Nazwa firmy jest wymagana';
        }

        if (!formData.contact_email) {
            errors.contact_email = 'Adres email jest wymagany';
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

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Obsługa rejestracji
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setIsSubmitting(true);
            await register(
                formData.business_name,
                formData.contact_email,
                formData.password
            );

            showNotification('Rejestracja zakończona pomyślnie!', 'success');
            navigate('/dashboard');
        } catch (error) {
            console.error('Błąd rejestracji:', error);
            showNotification(
                error.response?.data?.message || 'Nie udało się zarejestrować. Spróbuj ponownie.',
                'error'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // Renderowanie wskaźnika siły hasła
    const renderPasswordStrengthIndicator = () => {
        if (!formData.password) return null;

        const { score, feedback } = passwordStrength;

        let colorClass = 'bg-red-500';
        if (score >= 4) colorClass = 'bg-green-500';
        else if (score >= 2) colorClass = 'bg-yellow-500';

        return (
            <div className="mt-1">
                <div className="w-full h-1 bg-gray-200 rounded">
                    <div
                        className={`h-1 rounded ${colorClass}`}
                        style={{ width: `${Math.min(100, score * 20)}%` }}
                    ></div>
                </div>
                <p className={`text-xs mt-1 ${
                    score >= 4 ? 'text-green-600' :
                        score >= 2 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                    {feedback}
                </p>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div className="text-center">
                    <div className="flex justify-center">
                        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                            </svg>
                        </div>
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Zarejestruj swoją firmę
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Lub{' '}
                        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            zaloguj się do istniejącego konta
                        </Link>
                    </p>
                </div>

                {/* Formularz rejestracji */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Nazwa firmy */}
                        <div>
                            <label htmlFor="business_name" className="block text-sm font-medium text-gray-700">
                                Nazwa firmy
                            </label>
                            <div className="mt-1">
                                <input
                                    id="business_name"
                                    name="business_name"
                                    type="text"
                                    required
                                    className={`appearance-none block w-full px-3 py-3 border ${
                                        validationErrors.business_name ? 'border-red-300 text-red-900' : 'border-gray-300'
                                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                    placeholder="Twoja firma Sp. z o.o."
                                    value={formData.business_name}
                                    onChange={handleChange}
                                />
                                {validationErrors.business_name && (
                                    <p className="mt-1 text-xs text-red-600">{validationErrors.business_name}</p>
                                )}
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700">
                                Adres email
                            </label>
                            <div className="mt-1">
                                <input
                                    id="contact_email"
                                    name="contact_email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className={`appearance-none block w-full px-3 py-3 border ${
                                        validationErrors.contact_email ? 'border-red-300 text-red-900' : 'border-gray-300'
                                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                    placeholder="przyklad@twojafirma.pl"
                                    value={formData.contact_email}
                                    onChange={handleChange}
                                />
                                {validationErrors.contact_email && (
                                    <p className="mt-1 text-xs text-red-600">{validationErrors.contact_email}</p>
                                )}
                            </div>
                        </div>

                        {/* Hasło */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Hasło
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    required
                                    className={`appearance-none block w-full px-3 py-3 border ${
                                        validationErrors.password ? 'border-red-300 text-red-900' : 'border-gray-300'
                                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                    placeholder="Minimum 6 znaków"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                                {renderPasswordStrengthIndicator()}
                                {validationErrors.password && (
                                    <p className="mt-1 text-xs text-red-600">{validationErrors.password}</p>
                                )}
                            </div>
                        </div>

                        {/* Potwierdzenie hasła */}
                        <div>
                            <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">
                                Potwierdź hasło
                            </label>
                            <div className="mt-1">
                                <input
                                    id="confirm_password"
                                    name="confirm_password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    required
                                    className={`appearance-none block w-full px-3 py-3 border ${
                                        validationErrors.confirm_password ? 'border-red-300 text-red-900' : 'border-gray-300'
                                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                                    placeholder="Powtórz hasło"
                                    value={formData.confirm_password}
                                    onChange={handleChange}
                                />
                                {validationErrors.confirm_password && (
                                    <p className="mt-1 text-xs text-red-600">{validationErrors.confirm_password}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </span>
                            ) : (
                                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                    <svg className="h-5 w-5 text-blue-400 group-hover:text-blue-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </span>
                            )}
                            {isSubmitting ? 'Rejestracja...' : 'Zarejestruj firmę'}
                        </button>
                    </div>
                </form>

                <div className="mt-4">
                    <p className="text-xs text-gray-500">
                        Rejestrując się, akceptujesz nasz <a href="#" className="text-blue-600 hover:text-blue-500">Regulamin</a> oraz <a href="#" className="text-blue-600 hover:text-blue-500">Politykę Prywatności</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
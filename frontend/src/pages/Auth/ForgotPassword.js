import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { isValidEmail } from '../../utils/validators';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Walidacja email
        if (!email || !isValidEmail(email)) {
            setError('Proszę podać poprawny adres email');
            return;
        }

        setError(null);
        setIsSubmitting(true);

        try {
            // Tutaj będzie wywołanie API do zresetowania hasła
            // const response = await api.post('/auth/forgot-password', { email });

            // Symulacja pozytywnej odpowiedzi
            setTimeout(() => {
                setMessage(
                    'Jeśli konto z podanym adresem email istnieje, otrzymasz wiadomość z instrukcjami resetowania hasła.'
                );
                setIsSubmitting(false);
            }, 1000);
        } catch (err) {
            setError(
                err.response?.data?.message || 'Wystąpił błąd. Spróbuj ponownie później.'
            );
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Zresetuj hasło
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Podaj swój adres email, a wyślemy Ci link do zresetowania hasła.
                    </p>
                </div>

                {message && (
                    <div className="bg-green-50 p-4 rounded-md">
                        <div className="flex">
                            <div className="ml-3">
                                <p className="text-sm font-medium text-green-800">{message}</p>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 p-4 rounded-md">
                        <div className="flex">
                            <div className="ml-3">
                                <p className="text-sm font-medium text-red-800">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Adres email
                        </label>
                        <div className="mt-1">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="twoj@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Wysyłanie...' : 'Wyślij link resetujący'}
                        </button>
                    </div>
                </form>

                <div className="text-center mt-4">
                    <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                        Wróć do logowania
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
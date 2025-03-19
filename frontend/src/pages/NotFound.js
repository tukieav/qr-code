// frontend/src/pages/NotFound.js
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <div className="text-center">
                        <h1 className="text-9xl font-bold text-blue-600">404</h1>
                        <h2 className="text-3xl font-bold text-gray-900 mt-4">Strona nie znaleziona</h2>
                        <p className="mt-2 text-gray-600">
                            Przepraszamy, nie mogliśmy znaleźć strony, której szukasz.
                        </p>
                        <div className="mt-6">
                            <Link
                                to="/"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Wróć na stronę główną
                            </Link>
                        </div>
                        <div className="mt-10">
                            <div className="flex items-center justify-center space-x-2">
                                <svg
                                    className="w-6 h-6 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                                <span className="text-gray-500">
                                    Jeśli uważasz, że to błąd, skontaktuj się z nami pod adresem{' '}
                                    <a
                                        href="mailto:support@qropinion.pl"
                                        className="text-blue-600 hover:text-blue-500"
                                    >
                                        support@qropinion.pl
                                    </a>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
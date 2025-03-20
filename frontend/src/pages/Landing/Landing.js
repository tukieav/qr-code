import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div className="min-h-screen bg-white">
            <div className="relative bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                        <div className="pt-6">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                                <div className="flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
                                    <div className="flex justify-start lg:w-0 lg:flex-1">
                    <span className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2m0 0H8m4 0h4m-4-8v3m-6 4h18M5 3v16M19 3v16" />
                        </svg>
                      </div>
                      <span className="ml-3 text-xl font-bold text-gray-900">QR Opinion</span>
                    </span>
                                    </div>
                                    <div className="md:flex items-center justify-end md:flex-1 lg:w-0">
                                        <Link to="/login" className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900">
                                            Zaloguj się
                                        </Link>
                                        <Link to="/register" className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700">
                                            Zarejestruj się
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                            <div className="sm:text-center lg:text-left">
                                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                                    <span className="block xl:inline">Zbieraj opinie klientów</span>{' '}
                                    <span className="block text-blue-600 xl:inline">za pomocą kodów QR</span>
                                </h1>
                                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                    Prosta i efektywna metoda na poznanie zdania Twoich klientów. Wygeneruj unikalne kody QR, które klienci mogą zeskanować, aby szybko zostawić opinię. Monitoruj satysfakcję w czasie rzeczywistym!
                                </p>
                                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                    <div className="rounded-md shadow">
                                        <Link to="/register" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                                            Rozpocznij za darmo
                                        </Link>
                                    </div>
                                    <div className="mt-3 sm:mt-0 sm:ml-3">
                                        <a href="#features" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10">
                                            Dowiedz się więcej
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>

            <footer className="bg-gray-800 mt-24">
                <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
                    <p className="mt-8 text-center text-base text-gray-400">
                        &copy; 2023 QR Opinion. Wszelkie prawa zastrzeżone.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
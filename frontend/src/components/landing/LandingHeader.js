// frontend/src/components/landing/LandingHeader.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LandingHeader = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Funkcja otwierająca/zamykająca menu mobilne
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="relative bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
                    {/* Logo */}
                    <div className="flex justify-start lg:w-0 lg:flex-1">
                        <Link to="/" className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2m0 0H8m4 0h4m-4-8v3m-6 4h18M5 3v16M19 3v16" />
                                </svg>
                            </div>
                            <span className="ml-3 text-xl font-bold text-gray-900">QR Opinion</span>
                        </Link>
                    </div>

                    {/* Przycisk menu mobilnego */}
                    <div className="-mr-2 -my-2 md:hidden">
                        <button
                            type="button"
                            className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                            onClick={toggleMenu}
                        >
                            <span className="sr-only">Otwórz menu</span>
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>

                    {/* Desktop menu */}
                    <nav className="hidden md:flex space-x-10">
                        <a href="#features" className="text-base font-medium text-gray-500 hover:text-gray-900">
                            Funkcje
                        </a>
                        <a href="#pricing" className="text-base font-medium text-gray-500 hover:text-gray-900">
                            Cennik
                        </a>
                        <a href="#testimonials" className="text-base font-medium text-gray-500 hover:text-gray-900">
                            Opinie
                        </a>
                        <a href="#faq" className="text-base font-medium text-gray-500 hover:text-gray-900">
                            FAQ
                        </a>
                    </nav>

                    {/* Przyciski logowania i rejestracji */}
                    <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
                        <Link to="/login" className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900">
                            Zaloguj się
                        </Link>
                        <Link
                            to="/register"
                            className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                        >
                            Zarejestruj się
                        </Link>
                    </div>
                </div>
            </div>

            {/* Menu mobilne */}
            {isMenuOpen && (
                <div className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden z-10">
                    <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
                        {/* ... (reszta kodu dla mobilnego menu) ... */}
                    </div>
                </div>
            )}
        </header>
    );
};

export default LandingHeader;
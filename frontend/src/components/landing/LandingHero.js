// frontend/src/components/landing/LandingHero.js
import React from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

const LandingHero = () => {
    return (
        <div className="relative bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                    <svg
                        className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
                        fill="currentColor"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                    >
                        <polygon points="50,0 100,0 50,100 0,100" />
                    </svg>

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
                                    <Link
                                        to="/register"
                                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                                    >
                                        Rozpocznij za darmo
                                    </Link>
                                </div>
                                <div className="mt-3 sm:mt-0 sm:ml-3">

                                    <a href="#demo"
                                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10"
                                    >
                                    Zobacz demo
                                </a>
                            </div>
                        </div>
                </div>
            </main>
        </div>
</div>
    <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <div className="h-56 sm:h-72 md:h-96 lg:w-full lg:h-full bg-gray-50 flex items-center justify-center">
            <div className="p-8 bg-white shadow-lg rounded-lg flex flex-col items-center transform rotate-3">
                <QRCodeSVG
                    value="https://qropinion.pl/example"
                    size={200}
                    level="H"
                    imageSettings={{
                        src: "logo.png",
                        excavate: true,
                        height: 48,
                        width: 48,
                    }}
                />
                <div className="mt-4 bg-yellow-100 rounded-lg p-4 max-w-xs -rotate-2 transform">
                    <div className="flex">
                        <div className="mr-2 flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </div>
                        <p className="text-sm text-gray-700">
                            <span className="font-bold">Oceń nas:</span> Jak oceniasz naszą obsługę? Zeskanuj kod QR i podziel się opinią!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
);
};

export default LandingHero;
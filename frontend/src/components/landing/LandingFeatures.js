// frontend/src/components/landing/LandingFeatures.js
import React from 'react';

const LandingFeatures = () => {
    const features = [
        {
            name: 'Łatwe generowanie kodów QR',
            description: 'Twórz i personalizuj kody QR, które możesz umieścić w swoim lokalu, na produktach czy rachunkach, aby zbierać opinie od klientów.',
            icon: (
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2m0 0H8m4 0h4m-4-8v3m-6 4h18M5 3v16M19 3v16" />
                </svg>
            )
        },
        {
            name: 'Analityka w czasie rzeczywistym',
            description: 'Monitoruj opinie i oceny klientów w czasie rzeczywistym. Obserwuj trendy i szybko reaguj na uwagi i sugestie.',
            icon: (
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            )
        },
        // ... pozostałe funkcje
    ];

    return (
        <div id="features" className="py-16 bg-gray-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Funkcje</h2>
                    <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Wszystko czego potrzebujesz do zbierania opinii
                    </p>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                        Odkryj, jak łatwo możesz zbierać, analizować i wizualizować opinie swoich klientów.
                    </p>
                </div>

                <div className="mt-16">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                                            {feature.icon}
                                        </div>
                                        <h3 className="ml-4 text-lg font-medium text-gray-900">{feature.name}</h3>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-base text-gray-500">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingFeatures;
// frontend/src/components/landing/LandingPricing.js
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPricing = () => {
    const plans = [
        {
            name: 'Darmowy',
            description: 'Idealny dla małych firm rozpoczynających zbieranie opinii.',
            price: '0 zł',
            features: [
                '1 aktywna ankieta',
                '1 kod QR',
                '100 odpowiedzi miesięcznie',
                'Podstawowa analityka'
            ],
            recommended: false,
            ctaText: 'Rozpocznij za darmo',
            ctaColor: 'blue-50',
            ctaTextColor: 'blue-700',
            borderColor: 'blue-500'
        },
        {
            name: 'Podstawowy',
            description: 'Dla firm, które potrzebują więcej możliwości do zbierania opinii.',
            price: '49 zł',
            features: [
                '5 aktywnych ankiet',
                '10 kodów QR',
                '1,000 odpowiedzi miesięcznie',
                'Zaawansowana analityka',
                'Eksport danych (CSV)'
            ],
            recommended: true,
            ctaText: 'Rozpocznij 14-dniowy okres próbny',
            ctaColor: 'blue-600',
            ctaTextColor: 'white',
            borderColor: 'transparent'
        },
        {
            name: 'Pro',
            description: 'Dla firm, które potrzebują pełnej funkcjonalności bez limitów.',
            price: '99 zł',
            features: [
                'Nieograniczona liczba ankiet',
                'Nieograniczona liczba kodów QR',
                'Nieograniczona liczba odpowiedzi',
                'Premium analityka',
                'Priorytetowe wsparcie',
                'Własny branding'
            ],
            recommended: false,
            ctaText: 'Rozpocznij 14-dniowy okres próbny',
            ctaColor: 'blue-600',
            ctaTextColor: 'white',
            borderColor: 'transparent'
        }
    ];

    return (
        <div id="pricing" className="bg-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Cennik</h2>
                    <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Proste i przejrzyste plany
                    </p>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                        Wybierz plan, który najlepiej odpowiada potrzebom Twojej firmy.
                    </p>
                </div>

                <div className="mt-16 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
                    {plans.map((plan, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200">
                            <div className="p-6">
                                <h2 className="text-lg font-medium text-gray-900">{plan.name}</h2>
                                <p className="mt-4 text-sm text-gray-500">{plan.description}</p>
                                <p className="mt-8">
                                    <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                                    <span className="text-base font-medium text-gray-500">/miesiąc</span>
                                </p>
                                <Link
                                    to="/register"
                                    className={`mt-8 block w-full bg-${plan.ctaColor} border border-${plan.borderColor} rounded-md py-2 text-sm font-semibold text-${plan.ctaTextColor} text-center hover:bg-${plan.ctaColor === 'blue-50' ? 'blue-100' : 'blue-700'}`}
                                >
                                    {plan.ctaText}
                                </Link>
                            </div>
                            <div className="pt-6 pb-8 px-6">
                                <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">Co zawiera</h3>
                                <ul className="mt-6 space-y-4">
                                    {plan.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex space-x-3">
                                            <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-sm text-gray-500">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LandingPricing;
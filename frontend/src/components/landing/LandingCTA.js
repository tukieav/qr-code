// frontend/src/components/landing/LandingCTA.js
import React from 'react';
import { Link } from 'react-router-dom';

const LandingCTA = () => {
    return (
        <div className="bg-blue-700">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                    <span className="block">Gotowy, aby zacząć zbierać opinie?</span>
                    <span className="block text-blue-200">Rozpocznij za darmo już dziś.</span>
                </h2>
                <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                    <div className="inline-flex rounded-md shadow">
                        <Link
                            to="/register"
                            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
                        >
                            Zarejestruj się za darmo
                        </Link>
                    </div>
                    <div className="ml-3 inline-flex rounded-md shadow">

                        <a href="#demo"
                        className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                        Zobacz demo
                    </a>
                </div>
            </div>
        </div>
</div>
);
};

export default LandingCTA;
// src/pages/SurveyForm/ThankYou.js
import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/solid';

const ThankYou = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="flex justify-center mb-4">
                    <CheckCircleIcon className="h-16 w-16 text-green-500" />
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-3">Thank You!</h1>
                <p className="text-gray-600 mb-6">
                    Your feedback has been successfully submitted. We appreciate your time and input.
                </p>

                <div className="border-t border-gray-200 pt-6">
                    <p className="text-sm text-gray-500">
                        You can now close this window or scan another QR code.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ThankYou;
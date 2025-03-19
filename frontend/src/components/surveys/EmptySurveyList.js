// frontend/src/components/surveys/EmptySurveyList.js
import React from 'react';
import { Link } from 'react-router-dom';
import { DocumentTextIcon, PlusIcon } from '@heroicons/react/outline';

const EmptySurveyList = () => {
    return (
        <div className="py-16 px-6 text-center">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
                Brak ankiet
            </h3>
            <p className="mt-1 text-gray-500">
                Rozpocznij zbieranie opinii, tworząc swoją pierwszą ankietę.
            </p>
            <div className="mt-6">
                <Link
                    to="/surveys/create"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Utwórz ankietę
                </Link>
            </div>
        </div>
    );
};

export default EmptySurveyList;
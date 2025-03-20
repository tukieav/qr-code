// frontend/src/components/qrcodes/EmptyQRCodeList.js
import React from 'react';
import { Link } from 'react-router-dom';
import { QrCodeIcon, PlusIcon } from '@heroicons/react/24/outline';

const EmptyQRCodeList = () => {
    return (
        <div className="py-16 px-6 text-center">
            <QrCodeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
                Brak kodów QR
            </h3>
            <p className="mt-1 text-gray-500">
                Rozpocznij zbieranie opinii, tworząc swój pierwszy kod QR.
            </p>
            <div className="mt-6">
                <Link
                    to="/qrcodes/create"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    Utwórz kod QR
                </Link>
            </div>
        </div>
    );
};

export default EmptyQRCodeList;
// frontend/src/components/qrcodes/QRCodeModal.js
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const QRCodeModal = ({ showQRCodeModal, selectedQRCode, setShowQRCodeModal, getQRCodeSurveyUrl, handleDownloadQRCode, showNotification }) => {
    if (!showQRCodeModal || !selectedQRCode) return null;

    // URL ankiety dla kodu QR
    const surveyUrl = selectedQRCode.surveyUrl || getQRCodeSurveyUrl(selectedQRCode.unique_code);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                        {selectedQRCode.name}
                    </h3>
                    <button
                        onClick={() => setShowQRCodeModal(false)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex flex-col items-center justify-center mb-4">
                    <div className="p-4 bg-white border rounded-md inline-block">
                        <QRCodeSVG
                            id={`qrcode-modal-${selectedQRCode._id}`}
                            value={surveyUrl}
                            size={200}
                            level="H"
                            includeMargin={true}
                        />
                    </div>

                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-500 mb-1">Link do ankiety:</p>
                        <p className="text-sm font-medium text-gray-900 break-all">
                            {surveyUrl}
                        </p>
                    </div>
                </div>

                <div className="flex justify-between mt-4">
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(surveyUrl);
                            showNotification('Link został skopiowany do schowka', 'success');
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    >
                        Kopiuj link
                    </button>

                    <button
                        onClick={() => handleDownloadQRCode(selectedQRCode)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Pobierz kod QR
                    </button>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Aktywny: {selectedQRCode.is_active ? 'Tak' : 'Nie'}</span>
                        <span>Skanowań: {selectedQRCode.scan_count || 0}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QRCodeModal;
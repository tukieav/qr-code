// frontend/src/components/qrcodes/QRCodeItem.js
import React from 'react';
import { Link } from 'react-router-dom';
import {
    QrcodeIcon,
    PencilAltIcon,
    TrashIcon,
    DownloadIcon,
    SwitchHorizontalIcon
} from '@heroicons/react/outline';
import { QRCodeSVG } from 'qrcode.react';

const QRCodeItem = ({
                        qrCode,
                        getQRCodeSurveyUrl,
                        handleGetQRCode,
                        handleDownloadQRCode,
                        handleToggleActive,
                        setConfirmDelete,
                        confirmDelete,
                        handleDeleteQRCode,
                        formatDate
                    }) => {
    return (
        <tr>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center">
                        <QRCodeSVG
                            id={`qrcode-svg-${qrCode._id}`}
                            value={getQRCodeSurveyUrl(qrCode.unique_code)}
                            size={40}
                            level="L"
                            includeMargin={false}
                            className="rounded border border-gray-200"
                        />
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{qrCode.name}</div>
                        <div className="text-xs text-gray-500">
                            ID: {qrCode.unique_code?.substring(0, 8)}...
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                    {qrCode.survey_id ? (
                        qrCode.survey_id.title || 'Brak tytułu'
                    ) : (
                        'Brak powiązanej ankiety'
                    )}
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{qrCode.scan_count || 0}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{formatDate(qrCode.creation_date)}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    qrCode.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                }`}>
                    {qrCode.is_active ? 'Aktywny' : 'Nieaktywny'}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                    {/* Przycisk podglądu */}
                    <button
                        onClick={() => handleGetQRCode(qrCode._id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Podgląd"
                    >
                        <QrcodeIcon className="h-5 w-5" />
                    </button>

                    {/* Przycisk pobrania */}
                    <button
                        onClick={() => handleDownloadQRCode(qrCode)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Pobierz QR"
                    >
                        <DownloadIcon className="h-5 w-5" />
                    </button>

                    {/* Przycisk edycji */}
                    <Link
                        to={`/qrcodes/edit/${qrCode._id}`}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edytuj"
                    >
                        <PencilAltIcon className="h-5 w-5" />
                    </Link>

                    {/* Przycisk zmiany statusu */}
                    <button
                        onClick={() => handleToggleActive(qrCode._id, qrCode.is_active)}
                        className="text-blue-600 hover:text-blue-900"
                        title={qrCode.is_active ? 'Dezaktywuj' : 'Aktywuj'}
                    >
                        <SwitchHorizontalIcon className="h-5 w-5" />
                    </button>

                    {/* Przycisk usuwania */}
                    <button
                        onClick={() => setConfirmDelete(qrCode._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Usuń"
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>
                </div>

                {/* Dialog potwierdzenia usunięcia */}
                {confirmDelete === qrCode._id && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Potwierdzenie usunięcia
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Czy na pewno chcesz usunąć kod QR "{qrCode.name}"? Tej operacji nie można cofnąć.
                            </p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setConfirmDelete(null)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                                >
                                    Anuluj
                                </button>
                                <button
                                    onClick={() => handleDeleteQRCode(qrCode._id)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                >
                                    Usuń
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </td>
        </tr>
    );
};

export default QRCodeItem;
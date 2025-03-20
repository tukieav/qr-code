// src/components/qrCodes/QRCodeList.js
import React from 'react';
import { QrcodeIcon, DownloadIcon } from '@heroicons/react/24/outline';
import { QRCodeSVG } from 'qrcode.react';
import GenericList from '../common/GenericList';
import EmptyQRCodeList from './EmptyQRCodeList';

/**
 * Komponent wyświetlający listę kodów QR
 */
const QRCodeList = ({
                        qrCodes,
                        sortColumn,
                        sortDirection,
                        handleSort,
                        getQRCodeSurveyUrl,
                        handleGetQRCode,
                        handleDownloadQRCode,
                        handleToggleActive,
                        handleDeleteQRCode,
                        formatDate
                    }) => {
    // Definicje kolumn dla listy kodów QR
    const columns = [
        {
            name: 'name',
            label: 'Nazwa kodu QR',
            sortable: true,
            render: (qrCode) => (
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center">
                        <QRCodeSVG
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
            )
        },
        {
            name: 'survey_title',
            label: 'Ankieta',
            sortable: true,
            render: (qrCode) => (
                <div className="text-sm text-gray-900">
                    {qrCode.survey_id ? (
                        qrCode.survey_id.title || 'Brak tytułu'
                    ) : (
                        'Brak powiązanej ankiety'
                    )}
                </div>
            )
        },
        {
            name: 'scan_count',
            label: 'Skanowań',
            sortable: true,
            render: (qrCode) => (
                <div className="text-sm text-gray-900">{qrCode.scan_count || 0}</div>
            )
        },
        {
            name: 'creation_date',
            label: 'Data utworzenia',
            sortable: true,
            render: (qrCode) => (
                <div className="text-sm text-gray-900">{formatDate(qrCode.creation_date)}</div>
            )
        },
        {
            name: 'is_active',
            label: 'Status',
            sortable: true,
            render: (qrCode) => (
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    qrCode.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                }`}>
                    {qrCode.is_active ? 'Aktywny' : 'Nieaktywny'}
                </span>
            )
        }
    ];

    // Funkcja generująca dodatkowe akcje dla każdego kodu QR
    const getQRCodeAdditionalActions = (qrCode) => [
        // Przycisk podglądu
        <button
            key="view"
            onClick={() => handleGetQRCode(qrCode._id)}
            className="text-blue-600 hover:text-blue-900"
            title="Podgląd"
        >
            <QrcodeIcon className="h-5 w-5" />
        </button>,
        // Przycisk pobrania
        <button
            key="download"
            onClick={() => handleDownloadQRCode(qrCode)}
            className="text-blue-600 hover:text-blue-900"
            title="Pobierz QR"
        >
            <DownloadIcon className="h-5 w-5" />
        </button>
    ];

    return (
        <GenericList
            items={qrCodes}
            columns={columns}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
            onToggleActive={handleToggleActive}
            onDelete={handleDeleteQRCode}
            editUrlPrefix="/qrcodes/edit/"
            emptyComponent={<EmptyQRCodeList />}
            additionalActions={getQRCodeAdditionalActions}
        />
    );
};

export default QRCodeList;
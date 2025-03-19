// frontend/src/components/qrcodes/QRCodeList.js
import React from 'react';
import QRCodeListHeader from './QRCodeListHeader';
import QRCodeItem from './QRCodeItem';
import EmptyQRCodeList from './EmptyQRCodeList';

const QRCodeList = ({
                        qrCodes,
                        sortColumn,
                        sortDirection,
                        handleSort,
                        getQRCodeSurveyUrl,
                        handleGetQRCode,
                        handleDownloadQRCode,
                        handleToggleActive,
                        confirmDelete,
                        setConfirmDelete,
                        handleDeleteQRCode,
                        formatDate
                    }) => {
    // Jeśli nie ma kodów QR, pokazujemy komunikat
    if (qrCodes.length === 0) {
        return <EmptyQRCodeList />;
    }

    return (
        <table className="min-w-full divide-y divide-gray-200">
            <QRCodeListHeader
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                handleSort={handleSort}
            />
            <tbody className="bg-white divide-y divide-gray-200">
            {qrCodes.map((qrCode) => (
                <QRCodeItem
                    key={qrCode._id}
                    qrCode={qrCode}
                    getQRCodeSurveyUrl={getQRCodeSurveyUrl}
                    handleGetQRCode={handleGetQRCode}
                    handleDownloadQRCode={handleDownloadQRCode}
                    handleToggleActive={handleToggleActive}
                    confirmDelete={confirmDelete}
                    setConfirmDelete={setConfirmDelete}
                    handleDeleteQRCode={handleDeleteQRCode}
                    formatDate={formatDate}
                />
            ))}
            </tbody>
        </table>
    );
};

export default QRCodeList;
// frontend/src/pages/QRCodes/QRCodeManagement.js
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/outline';
import { AuthContext } from '../../context/AuthContext';
import { UIContext } from '../../context/UIContext';
import api from '../../services/api';
import { formatDate, getQRCodeSurveyUrl } from '../../utils/QRCodeUtils';

// Importy komponentów
import { Navbar, Sidebar, DataFilters } from '../../components/common';
import QRCodeList from '../../components/qrcodes/QRCodeList';
import QRCodeModal from '../../components/qrcodes/QRCodeModal';

const QRCodeManagement = () => {
    const [qrCodes, setQRCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortColumn, setSortColumn] = useState('creation_date');
    const [sortDirection, setSortDirection] = useState('desc');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterActive, setFilterActive] = useState('all');
    const [selectedQRCode, setSelectedQRCode] = useState(null);
    const [showQRCodeModal, setShowQRCodeModal] = useState(false);

    const { currentUser } = useContext(AuthContext);
    const { showNotification } = useContext(UIContext);

    // Pobieranie listy kodów QR
    useEffect(() => {
        const fetchQRCodes = async () => {
            try {
                setLoading(true);
                const response = await api.get('/qrcodes');
                setQRCodes(response.data.data || []);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Błąd podczas pobierania kodów QR');
                setLoading(false);
            }
        };

        fetchQRCodes();
    }, []);

    // Obsługa zmiany statusu aktywności kodu QR
    const handleToggleActive = async (id, currentStatus) => {
        try {
            const response = await api.put(`/qrcodes/${id}`, {
                is_active: !currentStatus
            });

            // Aktualizacja stanu po pomyślnej zmianie
            setQRCodes(prevQRCodes =>
                prevQRCodes.map(qrCode =>
                    qrCode._id === id ? { ...qrCode, is_active: !currentStatus } : qrCode
                )
            );

            showNotification(
                `Kod QR został ${!currentStatus ? 'aktywowany' : 'dezaktywowany'} pomyślnie.`,
                'success'
            );
        } catch (error) {
            console.error('Błąd podczas zmiany statusu kodu QR:', error);
            showNotification(
                error.response?.data?.message || 'Nie udało się zmienić statusu kodu QR',
                'error'
            );
        }
    };

    // Obsługa usuwania kodu QR
    const handleDeleteQRCode = async (id) => {
        try {
            await api.delete(`/qrcodes/${id}`);

            // Usunięcie kodu QR z lokalnego stanu
            setQRCodes(prevQRCodes => prevQRCodes.filter(qrCode => qrCode._id !== id));

            showNotification('Kod QR został usunięty', 'success');
        } catch (error) {
            console.error('Błąd podczas usuwania kodu QR:', error);
            showNotification(
                error.response?.data?.message || 'Nie udało się usunąć kodu QR',
                'error'
            );
        }
    };

    // Pobieranie kodu QR i wyświetlanie
    const handleGetQRCode = async (id) => {
        try {
            const response = await api.get(`/qrcodes/${id}`);
            setSelectedQRCode(response.data.data);
            setShowQRCodeModal(true);
        } catch (error) {
            console.error('Błąd podczas pobierania kodu QR:', error);
            showNotification(
                error.response?.data?.message || 'Nie udało się pobrać kodu QR',
                'error'
            );
        }
    };

    // Obsługa pobierania kodu QR
    const handleDownloadQRCode = async (qrCode) => {
        try {
            // Sprawdzenie czy dostępny jest obiekt qrCode.qrCodeImage
            if (qrCode.qrCodeImage) {
                // Użycie gotowego URL obrazu
                const link = document.createElement('a');
                link.href = qrCode.qrCodeImage;
                link.download = `${qrCode.name.replace(/\s+/g, '_')}_QRCode.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                // Pobranie kodu QR
                const fullQRCode = await api.get(`/qrcodes/${qrCode._id}`);
                if (fullQRCode.data.data.qrCodeImage) {
                    const link = document.createElement('a');
                    link.href = fullQRCode.data.data.qrCodeImage;
                    link.download = `${qrCode.name.replace(/\s+/g, '_')}_QRCode.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } else {
                    throw new Error("Brak obrazu kodu QR");
                }
            }
        } catch (error) {
            console.error('Błąd podczas pobierania kodu QR:', error);
            showNotification(
                'Nie udało się pobrać kodu QR. Spróbuj ponownie.',
                'error'
            );
        }
    };

    // Sortowanie kodów QR
    const handleSort = (column) => {
        // Jeśli kliknięto na tę samą kolumnę, zmień kierunek sortowania
        if (column === sortColumn) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            // W przeciwnym razie ustaw nową kolumnę i domyślny kierunek sortowania
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    // Filtrowanie danych
    const getFilteredData = () => {
        return qrCodes
            // Filtrowanie według statusu aktywności
            .filter(qrCode => {
                if (filterActive === 'all') return true;
                return filterActive === 'active' ? qrCode.is_active : !qrCode.is_active;
            })
            // Filtrowanie według wyszukiwanego tekstu
            .filter(qrCode => {
                if (!searchQuery) return true;
                const query = searchQuery.toLowerCase();
                return (
                    qrCode.name.toLowerCase().includes(query) ||
                    (qrCode.survey_id && qrCode.survey_id.title && qrCode.survey_id.title.toLowerCase().includes(query))
                );
            })
            // Sortowanie
            .sort((a, b) => {
                let comparison = 0;
                const direction = sortDirection === 'asc' ? 1 : -1;

                // Sortowanie według różnych kolumn
                switch (sortColumn) {
                    case 'name':
                        comparison = a.name.localeCompare(b.name);
                        break;
                    case 'survey_title':
                        const titleA = (a.survey_id && a.survey_id.title) || '';
                        const titleB = (b.survey_id && b.survey_id.title) || '';
                        comparison = titleA.localeCompare(titleB);
                        break;
                    case 'scan_count':
                        comparison = (a.scan_count || 0) - (b.scan_count || 0);
                        break;
                    case 'is_active':
                        comparison = (a.is_active === b.is_active) ? 0 : a.is_active ? -1 : 1;
                        break;
                    case 'creation_date':
                    default:
                        comparison = new Date(a.creation_date) - new Date(b.creation_date);
                        break;
                }

                return comparison * direction;
            });
    };

    // Widok ładowania
    if (loading) {
        return (
            <div className="flex h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Navbar title="Zarządzanie kodami QR" />
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Ładowanie kodów QR...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />

            {/* Modal do wyświetlania szczegółów kodu QR */}
            <QRCodeModal
                showQRCodeModal={showQRCodeModal}
                selectedQRCode={selectedQRCode}
                setShowQRCodeModal={setShowQRCodeModal}
                getQRCodeSurveyUrl={getQRCodeSurveyUrl}
                handleDownloadQRCode={handleDownloadQRCode}
                showNotification={showNotification}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar title="Zarządzanie kodami QR" />

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-semibold text-gray-900">Kody QR</h1>
                            <Link
                                to="/qrcodes/create"
                                className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                            >
                                <PlusIcon className="h-5 w-5 mr-2" />
                                Nowy kod QR
                            </Link>
                        </div>

                        {/* Komunikat o błędzie */}
                        {error && (
                            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                                <p>{error}</p>
                            </div>
                        )}

                        {/* Filtry i wyszukiwarka */}
                        <DataFilters
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            filterActive={filterActive}
                            setFilterActive={setFilterActive}
                            searchPlaceholder="Szukaj kodów QR..."
                        />

                        {/* Lista kodów QR */}
                        <div className="bg-white shadow overflow-hidden sm:rounded-md">
                            <QRCodeList
                                qrCodes={getFilteredData()}
                                sortColumn={sortColumn}
                                sortDirection={sortDirection}
                                handleSort={handleSort}
                                getQRCodeSurveyUrl={getQRCodeSurveyUrl}
                                handleGetQRCode={handleGetQRCode}
                                handleDownloadQRCode={handleDownloadQRCode}
                                handleToggleActive={handleToggleActive}
                                handleDeleteQRCode={handleDeleteQRCode}
                                formatDate={formatDate}
                            />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default QRCodeManagement;
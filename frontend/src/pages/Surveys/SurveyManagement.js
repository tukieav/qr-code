// frontend/src/pages/Surveys/SurveyManagement.js
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/outline';
import { AuthContext } from '../../context/AuthContext';
import { UIContext } from '../../context/UIContext';
import api from '../../services/api';
import { formatDate } from '../../utils/SurveyUtils';

// Importy komponentów
import { Navbar, Sidebar, DataFilters } from '../../components/common';
import SurveyList from '../../components/surveys/SurveyList';

const SurveyManagement = () => {
    const [surveys, setSurveys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortColumn, setSortColumn] = useState('creation_date');
    const [sortDirection, setSortDirection] = useState('desc');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterActive, setFilterActive] = useState('all');

    const { currentUser } = useContext(AuthContext);
    const { showNotification } = useContext(UIContext);

    // Pobieranie listy ankiet
    useEffect(() => {
        const fetchSurveys = async () => {
            try {
                setLoading(true);
                const response = await api.get('/surveys');
                setSurveys(response.data.data || []);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Błąd podczas pobierania ankiet');
                setLoading(false);
            }
        };

        fetchSurveys();
    }, []);

    // Obsługa zmiany statusu aktywności ankiety
    const handleToggleActive = async (id, currentStatus) => {
        try {
            const response = await api.put(`/surveys/${id}`, {
                is_active: !currentStatus
            });

            // Aktualizacja stanu po pomyślnej zmianie
            setSurveys(prevSurveys =>
                prevSurveys.map(survey =>
                    survey._id === id ? { ...survey, is_active: !currentStatus } : survey
                )
            );

            showNotification(
                `Ankieta została ${!currentStatus ? 'aktywowana' : 'dezaktywowana'} pomyślnie.`,
                'success'
            );
        } catch (error) {
            console.error('Błąd podczas zmiany statusu ankiety:', error);
            showNotification(
                error.response?.data?.message || 'Nie udało się zmienić statusu ankiety',
                'error'
            );
        }
    };

    // Obsługa usuwania ankiety
    const handleDeleteSurvey = async (id) => {
        try {
            await api.delete(`/surveys/${id}`);

            // Usunięcie ankiety z lokalnego stanu
            setSurveys(prevSurveys => prevSurveys.filter(survey => survey._id !== id));

            showNotification('Ankieta została usunięta', 'success');
        } catch (error) {
            console.error('Błąd podczas usuwania ankiety:', error);
            showNotification(
                error.response?.data?.message || 'Nie udało się usunąć ankiety',
                'error'
            );
        }
    };

    // Obsługa duplikowania ankiety - przyjmuje cały obiekt ankiety zamiast samego ID
    const handleDuplicateSurvey = async (survey) => {
        try {
            if (!survey || !survey.title) {
                throw new Error('Brak danych ankiety do zduplikowania');
            }

            // Przygotowanie nowej ankiety na podstawie istniejącej
            const newSurvey = {
                title: `${survey.title} (Kopia)`,
                description: survey.description || '',
                questions: survey.questions || [],
                is_active: false // Domyślnie nieaktywna
            };

            const response = await api.post('/surveys', newSurvey);

            // Dodanie nowej ankiety do stanu
            setSurveys(prevSurveys => [...prevSurveys, response.data.data]);

            showNotification('Ankieta została zduplikowana', 'success');
        } catch (error) {
            console.error('Błąd podczas duplikowania ankiety:', error);
            showNotification(
                error.response?.data?.message || 'Nie udało się zduplikować ankiety',
                'error'
            );
        }
    };

    // Sortowanie ankiet
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

    // Filtrowanie danych z obsługą błędów
    const getFilteredData = () => {
        if (!Array.isArray(surveys)) return [];

        return surveys
            // Filtrowanie według statusu aktywności
            .filter(survey => {
                if (!survey) return false;
                if (filterActive === 'all') return true;
                return filterActive === 'active' ? !!survey.is_active : !survey.is_active;
            })
            // Filtrowanie według wyszukiwanego tekstu
            .filter(survey => {
                if (!survey) return false;
                if (!searchQuery) return true;

                const query = searchQuery.toLowerCase();
                const title = (survey.title || '').toLowerCase();
                const description = (survey.description || '').toLowerCase();

                return title.includes(query) || description.includes(query);
            })
            // Sortowanie
            .sort((a, b) => {
                if (!a || !b) return 0;

                let comparison = 0;
                const direction = sortDirection === 'asc' ? 1 : -1;

                // Sortowanie według różnych kolumn
                switch (sortColumn) {
                    case 'title':
                        comparison = (a.title || '').localeCompare(b.title || '');
                        break;
                    case 'question_count':
                        const aCount = Array.isArray(a.questions) ? a.questions.length : 0;
                        const bCount = Array.isArray(b.questions) ? b.questions.length : 0;
                        comparison = aCount - bCount;
                        break;
                    case 'is_active':
                        comparison = (a.is_active === b.is_active) ? 0 : a.is_active ? -1 : 1;
                        break;
                    case 'creation_date':
                    default:
                        // Bezpieczne porównanie dat
                        try {
                            const dateA = a.creation_date ? new Date(a.creation_date) : new Date(0);
                            const dateB = b.creation_date ? new Date(b.creation_date) : new Date(0);
                            comparison = dateA - dateB;
                        } catch (e) {
                            comparison = 0;
                        }
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
                    <Navbar title="Zarządzanie ankietami" />
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Ładowanie ankiet...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar title="Zarządzanie ankietami" />

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-semibold text-gray-900">Ankiety</h1>
                            <Link
                                to="/surveys/create"
                                className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                            >
                                <PlusIcon className="h-5 w-5 mr-2" />
                                Nowa ankieta
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
                            searchPlaceholder="Szukaj ankiet..."
                        />

                        {/* Lista ankiet */}
                        <div className="bg-white shadow overflow-hidden sm:rounded-md">
                            <SurveyList
                                surveys={getFilteredData()}
                                sortColumn={sortColumn}
                                sortDirection={sortDirection}
                                handleSort={handleSort}
                                handleToggleActive={handleToggleActive}
                                handleDuplicateSurvey={handleDuplicateSurvey}
                                handleDeleteSurvey={handleDeleteSurvey}
                                formatDate={formatDate}
                            />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SurveyManagement;
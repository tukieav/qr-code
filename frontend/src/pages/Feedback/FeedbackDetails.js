import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { UIContext } from '../../context/UIContext';
import api from '../../services/api';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';

const FeedbackDetails = () => {
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [responseText, setResponseText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { currentUser } = useContext(AuthContext);
    const { showNotification } = useContext(UIContext);
    const navigate = useNavigate();
    const { id } = useParams();

    // Pobieranie szczegółów opinii
    useEffect(() => {
        const fetchFeedbackDetails = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/feedback/${id}`);
                setFeedback(response.data.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Błąd pobierania danych opinii');
                setLoading(false);
            }
        };

        fetchFeedbackDetails();
    }, [id]);

    // Formatowanie daty
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pl-PL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Renderowanie gwiazdek oceny
    const renderStars = (rating) => {
        return (
            <div className="flex">
                {[...Array(5)].map((_, i) => (
                    <span
                        key={i}
                        className={`text-2xl ${
                            i < rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                    >
            ★
          </span>
                ))}
                <span className="ml-2 text-gray-700">({rating}/5)</span>
            </div>
        );
    };

    // Obsługa wysyłania odpowiedzi
    const handleSubmitResponse = async (e) => {
        e.preventDefault();

        if (!responseText.trim()) {
            showNotification('Treść odpowiedzi jest wymagana', 'warning');
            return;
        }

        try {
            setIsSubmitting(true);
            await api.post(`/feedback/${id}/respond`, { response_text: responseText });

            // Aktualizuj lokalny stan
            setFeedback({
                ...feedback,
                business_response: {
                    text: responseText,
                    date: new Date().toISOString()
                }
            });

            setResponseText('');
            showNotification('Odpowiedź została wysłana pomyślnie', 'success');
            setIsSubmitting(false);
        } catch (error) {
            showNotification(
                error.response?.data?.message || 'Nie udało się wysłać odpowiedzi',
                'error'
            );
            setIsSubmitting(false);
        }
    };

    // Ekran ładowania
    if (loading) {
        return (
            <div className="flex h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Navbar title="Szczegóły opinii" />
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Ładowanie...</span>
                            </div>
                            <p className="mt-2">Ładowanie szczegółów opinii...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Ekran błędu
    if (error || !feedback) {
        return (
            <div className="flex h-screen bg-gray-100">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Navbar title="Szczegóły opinii" />
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <h3 className="text-xl text-red-600 mb-2">Błąd</h3>
                            <p className="mb-4">{error || 'Nie znaleziono opinii'}</p>
                            <button
                                onClick={() => navigate('/feedback')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md"
                            >
                                Wróć do listy opinii
                            </button>
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
                <Navbar title="Szczegóły opinii" />

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white shadow rounded-lg overflow-hidden">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h1 className="text-2xl font-semibold text-gray-800">Szczegóły opinii</h1>
                                    <button
                                        onClick={() => navigate('/feedback')}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    >
                                        Wróć do listy
                                    </button>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="text-sm text-gray-500">Data otrzymania opinii</p>
                                            <p className="font-medium">{formatDate(feedback.submission_date)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Ankieta</p>
                                            <p className="font-medium">
                                                {feedback.qr_code_id?.survey_id?.title || 'Nieznana ankieta'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Kod QR</p>
                                            <p className="font-medium">{feedback.qr_code_id?.name || 'Nieznany kod QR'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h2 className="text-lg font-medium text-gray-800 mb-3">Ocena klienta</h2>
                                    <div className="bg-white border rounded-lg p-4">
                                        {renderStars(feedback.rating)}

                                        {feedback.comment && (
                                            <div className="mt-4">
                                                <h3 className="font-medium text-gray-700 mb-2">Komentarz:</h3>
                                                <p className="text-gray-600">{feedback.comment}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {feedback.responses && feedback.responses.length > 0 && (
                                    <div className="mb-6">
                                        <h2 className="text-lg font-medium text-gray-800 mb-3">Odpowiedzi na pytania</h2>
                                        <div className="space-y-4">
                                            {feedback.responses.map((response, index) => (
                                                <div key={index} className="bg-white border rounded-lg p-4">
                                                    <h3 className="font-medium text-gray-700">{response.question_text}</h3>
                                                    <div className="mt-2">
                                                        {response.question_type === 'rating' && (
                                                            <div className="flex">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <span
                                                                        key={i}
                                                                        className={`text-lg ${
                                                                            i < response.answer ? 'text-yellow-400' : 'text-gray-300'
                                                                        }`}
                                                                    >
                                    ★
                                  </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                        {response.question_type === 'text' && (
                                                            <p className="text-gray-600">{response.answer || 'Brak odpowiedzi'}</p>
                                                        )}
                                                        {response.question_type === 'multiple_choice' && (
                                                            <p className="text-gray-600">{response.answer || 'Brak wyboru'}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {feedback.business_response ? (
                                    <div className="mb-6">
                                        <h2 className="text-lg font-medium text-gray-800 mb-3">Twoja odpowiedź</h2>
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <p className="text-gray-800">{feedback.business_response.text}</p>
                                            <p className="text-sm text-gray-500 mt-2">
                                                Wysłano: {formatDate(feedback.business_response.date)}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mb-6">
                                        <h2 className="text-lg font-medium text-gray-800 mb-3">Odpowiedz klientowi</h2>
                                        <form onSubmit={handleSubmitResponse}>
                                            <div className="mb-3">
                        <textarea
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="4"
                            placeholder="Wpisz swoją odpowiedź..."
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                            required
                        ></textarea>
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                            >
                                                {isSubmitting ? 'Wysyłanie...' : 'Wyślij odpowiedź'}
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default FeedbackDetails;
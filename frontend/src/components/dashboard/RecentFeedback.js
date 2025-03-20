// src/components/dashboard/RecentFeedback.js
import React from 'react';
import { StarIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';

const RecentFeedback = ({ feedback }) => {
    // Formatowanie daty
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pl-PL', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Renderowanie gwiazdek oceny
    const RatingStars = ({ rating }) => {
        return (
            <div className="flex">
                {[...Array(5)].map((_, i) => (
                    <StarIcon
                        key={i}
                        className={`h-5 w-5 ${
                            i < rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                    />
                ))}
            </div>
        );
    };

    // Komponent dla pojedynczej opinii
    const FeedbackItem = ({ item }) => {
        return (
            <div className="bg-white rounded-lg shadow p-4 mb-4">
                <div className="flex justify-between items-start">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <UserCircleIcon className="h-10 w-10 text-gray-400" />
                        </div>
                        <div className="ml-3">
                            <div className="flex items-center">
                                <RatingStars rating={item.rating} />
                                <span className="ml-2 text-sm text-gray-600">
                  {formatDate(item.submission_date)}
                </span>
                            </div>
                            <div className="mt-1">
                                {item.comment ? (
                                    <p className="text-gray-800">{item.comment}</p>
                                ) : (
                                    <p className="text-gray-500 italic">Brak komentarza</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <Link
                        to={`/feedback/${item._id}`}
                        className="text-sm text-blue-600 hover:text-blue-800"
                    >
                        Szczegóły
                    </Link>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                        Ankieta: {item.qr_code_id?.survey_id?.title || 'Nieznana ankieta'}
                    </p>
                    <p className="text-xs text-gray-500">
                        Kod QR: {item.qr_code_id?.name || 'Nieznany kod QR'}
                    </p>
                </div>
            </div>
        );
    };

    // Brak opinii
    if (!feedback || feedback.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-500">Brak opinii do wyświetlenia</p>
                <p className="mt-2 text-sm text-gray-500">
                    Opinie pojawią się tutaj, gdy klienci zaczną skanować Twoje kody QR i wypełniać ankiety.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {feedback.map((item) => (
                <FeedbackItem key={item._id} item={item} />
            ))}
        </div>
    );
};

export default RecentFeedback;
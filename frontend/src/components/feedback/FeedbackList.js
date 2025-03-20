import React from 'react';

const FeedbackList = ({ feedback }) => {
    if (!feedback || feedback.length === 0) {
        return (
            <div className="bg-white shadow rounded-lg p-6 text-center">
                <p className="text-gray-500">Brak opinii do wyświetlenia</p>
            </div>
        );
    }

    return (
        <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
            {feedback.map((item) => (
                <div key={item._id || Math.random()} className="p-6">
                    <div className="flex justify-between">
                        <div>
                            <div className="flex items-center">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <span
                                            key={i}
                                            className={`text-lg ${
                                                i < item.rating ? 'text-yellow-400' : 'text-gray-300'
                                            }`}
                                        >
                      ★
                    </span>
                                    ))}
                                </div>
                                <span className="ml-2 text-sm text-gray-500">
                  {new Date(item.submission_date).toLocaleDateString()}
                </span>
                            </div>
                            <p className="mt-2 text-gray-700">{item.comment || 'Brak komentarza'}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FeedbackList;
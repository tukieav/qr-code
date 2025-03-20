// src/components/dashboard/DashboardStats.js
import React from 'react';
import {
    DocumentTextIcon,
    QrcodeIcon,
    ChatAlt2Icon,
    StarIcon
} from '@heroicons/react/24/outline';

const DashboardStats = ({ stats }) => {
    const { totalSurveys, totalQRCodes, totalFeedback, averageRating } = stats;

    // Karta statystyk
    const StatCard = ({ title, value, icon, color }) => (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-full p-3 ${color}`}>
                    {icon}
                </div>
                <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
                    <p className="text-xl font-semibold text-gray-900">{value}</p>
                </div>
            </div>
        </div>
    );

    // Renderowanie oceny z gwiazdkami
    const RatingStars = ({ rating }) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        return (
            <div className="flex items-center">
                <span className="text-xl font-semibold mr-2">{rating}</span>
                <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => {
                        if (i < fullStars) {
                            return <StarIcon key={i} className="h-5 w-5 fill-current" />;
                        } else if (i === fullStars && hasHalfStar) {
                            return (
                                <div key={i} className="relative">
                                    <StarIcon className="h-5 w-5 text-gray-300" />
                                    <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
                                        <StarIcon className="h-5 w-5 fill-current" />
                                    </div>
                                </div>
                            );
                        } else {
                            return <StarIcon key={i} className="h-5 w-5 text-gray-300" />;
                        }
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
                title="Aktywne ankiety"
                value={totalSurveys}
                icon={<DocumentTextIcon className="h-6 w-6 text-white" />}
                color="bg-blue-500"
            />

            <StatCard
                title="Kody QR"
                value={totalQRCodes}
                icon={<QrcodeIcon className="h-6 w-6 text-white" />}
                color="bg-purple-500"
            />

            <StatCard
                title="Zebrane opinie"
                value={totalFeedback}
                icon={<ChatAlt2Icon className="h-6 w-6 text-white" />}
                color="bg-green-500"
            />

            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                    <div className="flex-shrink-0 rounded-full p-3 bg-yellow-500">
                        <StarIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5">
                        <p className="text-sm font-medium text-gray-500 truncate">Średnia ocena</p>
                        <RatingStars rating={Number(averageRating)} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;
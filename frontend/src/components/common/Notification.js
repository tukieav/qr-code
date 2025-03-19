// frontend/src/components/common/Notification.js
import React, { useContext } from 'react';
import { UIContext } from '../../context/UIContext';
import {
    CheckCircleIcon,
    ExclamationCircleIcon,
    InformationCircleIcon,
    XIcon
} from '@heroicons/react/outline';

const Notification = () => {
    const { notification, showNotification } = useContext(UIContext);

    if (!notification) return null;

    const { message, type } = notification;

    const bgColor =
        type === 'success' ? 'bg-green-100 border-green-500' :
            type === 'error' ? 'bg-red-100 border-red-500' :
                type === 'warning' ? 'bg-yellow-100 border-yellow-500' :
                    'bg-blue-100 border-blue-500';

    const textColor =
        type === 'success' ? 'text-green-700' :
            type === 'error' ? 'text-red-700' :
                type === 'warning' ? 'text-yellow-700' :
                    'text-blue-700';

    const Icon =
        type === 'success' ? CheckCircleIcon :
            type === 'error' ? ExclamationCircleIcon :
                InformationCircleIcon;

    return (
        <div className="fixed top-4 right-4 z-50 max-w-md">
            <div className={`${bgColor} ${textColor} border-l-4 p-4 rounded shadow-md`}>
                <div className="flex justify-between items-start">
                    <div className="flex items-start">
                        <Icon className="h-5 w-5 mr-2 mt-0.5" />
                        <p>{message}</p>
                    </div>
                    <button
                        onClick={() => showNotification(null)}
                        className="ml-4 text-gray-500 hover:text-gray-700"
                    >
                        <XIcon className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Notification;
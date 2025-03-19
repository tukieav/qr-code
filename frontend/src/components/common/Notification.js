// src/components/common/Notification.js
import React, { useContext, useEffect } from 'react';
import { UIContext } from '../../context/UIContext';
import { CheckCircleIcon, ExclamationIcon, InformationCircleIcon, XCircleIcon, XIcon } from '@heroicons/react/solid';

const Notification = () => {
    const { notification, hideNotification } = useContext(UIContext);

    // Automatyczne usuwanie powiadomienia przy odmontowaniu komponentu
    useEffect(() => {
        return () => {
            hideNotification();
        };
    }, [hideNotification]);

    if (!notification) {
        return null;
    }

    // Określenie ikony i klasy stylu na podstawie typu powiadomienia
    let icon;
    let bgColorClass;
    let textColorClass;

    switch (notification.type) {
        case 'success':
            icon = <CheckCircleIcon className="h-6 w-6" />;
            bgColorClass = 'bg-green-50';
            textColorClass = 'text-green-800';
            break;
        case 'error':
            icon = <XCircleIcon className="h-6 w-6" />;
            bgColorClass = 'bg-red-50';
            textColorClass = 'text-red-800';
            break;
        case 'warning':
            icon = <ExclamationIcon className="h-6 w-6" />;
            bgColorClass = 'bg-yellow-50';
            textColorClass = 'text-yellow-800';
            break;
        case 'info':
        default:
            icon = <InformationCircleIcon className="h-6 w-6" />;
            bgColorClass = 'bg-blue-50';
            textColorClass = 'text-blue-800';
            break;
    }

    return (
        <div className="fixed top-4 right-4 z-50 max-w-md">
            <div className={`${bgColorClass} ${textColorClass} p-4 rounded-lg shadow-lg flex items-start`}>
                <div className="flex-shrink-0">
                    {icon}
                </div>
                <div className="ml-3 flex-1">
                    <p className="text-sm font-medium">{notification.message}</p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                    <button
                        type="button"
                        className={`inline-flex ${textColorClass} hover:opacity-75 focus:outline-none`}
                        onClick={hideNotification}
                    >
                        <XIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Notification;
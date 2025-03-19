// frontend/src/context/UIContext.js
import React, { createContext, useState } from 'react';

export const UIContext = createContext();

export const UIProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const showNotification = (message, type = 'info', duration = 5000) => {
        setNotification({ message, type });

        // Auto-hide notification after duration
        setTimeout(() => {
            setNotification(null);
        }, duration);
    };

    return (
        <UIContext.Provider
            value={{
                notification,
                showNotification,
                sidebarOpen,
                setSidebarOpen
            }}
        >
            {children}
        </UIContext.Provider>
    );
};
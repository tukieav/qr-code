// frontend/src/context/UIContext.js
import React, { createContext, useState, useEffect } from 'react';

export const UIContext = createContext();

export const UIProvider = ({ children }) => {
    // Stan sidebar
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Stan powiadomień
    const [notification, setNotification] = useState(null);

    // Stan motywu (ciemny/jasny)
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme || 'light';
    });

    // Efekt zastosowania motywu
    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Funkcja do przełączania motywu
    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    // Funkcja do pokazywania powiadomień
    const showNotification = (message, type = 'info', duration = 5000) => {
        setNotification({ message, type, id: Date.now() });

        // Automatyczne ukrywanie powiadomienia po określonym czasie
        if (duration > 0) {
            setTimeout(() => {
                setNotification(prev => {
                    // Usuń tylko jeśli ID się zgadza (unikaj usuwania nowego powiadomienia)
                    if (prev && prev.id === Date.now()) {
                        return null;
                    }
                    return prev;
                });
            }, duration);
        }
    };

    // Funkcja do ukrywania powiadomienia
    const hideNotification = () => {
        setNotification(null);
    };

    return (
        <UIContext.Provider
            value={{
                sidebarOpen,
                setSidebarOpen,
                notification,
                showNotification,
                hideNotification,
                theme,
                toggleTheme
            }}
        >
            {children}
        </UIContext.Provider>
    );
};
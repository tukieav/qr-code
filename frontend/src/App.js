// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UIProvider } from './context/UIContext';
import AppRoutes from './routes';
import Notification from './components/common/Notification';

function App() {
    const [initialized, setInitialized] = useState(false);

    // Initialize application
    useEffect(() => {
        const initializeApp = async () => {
            // Here you would load any configuration, preload data, etc.

            // Set theme based on user preferences
            const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const savedTheme = localStorage.getItem('theme');

            if (savedTheme) {
                document.documentElement.classList.toggle('dark', savedTheme === 'dark');
            } else if (prefersDarkMode) {
                document.documentElement.classList.add('dark');
            }

            // Set application as initialized
            setInitialized(true);
        };

        initializeApp();
    }, []);

    // Show loading screen while initializing
    if (!initialized) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading application...</p>
                </div>
            </div>
        );
    }

    return (
        <AuthProvider>
            <UIProvider>
                <Router>
                    <div className="min-h-screen flex flex-col">
                        {/* Global notification component */}
                        <Notification />

                        {/* Main application routes */}
                        <AppRoutes />
                    </div>
                </Router>
            </UIProvider>
        </AuthProvider>
    );
}

export default App;
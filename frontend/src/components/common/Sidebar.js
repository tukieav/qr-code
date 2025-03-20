// src/components/common/Sidebar.js
import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    HomeIcon,
    DocumentTextIcon,
    QrcodeIcon,
    ChatAlt2Icon,
    CreditCardIcon,
    LogoutIcon,
    MenuIcon,
    XIcon
} from '@heroicons/react/24/outline';
import { AuthContext } from '../../context/AuthContext';
import { UIContext } from '../../context/UIContext';

const Sidebar = () => {
    const { currentUser, logout } = useContext(AuthContext);
    const { sidebarOpen, setSidebarOpen } = useContext(UIContext);
    const location = useLocation();

    // Navigation items
    const navItems = [
        {
            name: 'Dashboard',
            icon: <HomeIcon className="h-6 w-6" />,
            path: '/dashboard',
            current: location.pathname === '/dashboard'
        },
        {
            name: 'Surveys',
            icon: <DocumentTextIcon className="h-6 w-6" />,
            path: '/surveys',
            current: location.pathname.includes('/surveys')
        },
        {
            name: 'QR Codes',
            icon: <QrcodeIcon className="h-6 w-6" />,
            path: '/qrcodes',
            current: location.pathname.includes('/qrcodes')
        },
        {
            name: 'Feedback',
            icon: <ChatAlt2Icon className="h-6 w-6" />,
            path: '/feedback',
            current: location.pathname.includes('/feedback')
        },
        {
            name: 'Subscription',
            icon: <CreditCardIcon className="h-6 w-6" />,
            path: '/subscription',
            current: location.pathname.includes('/subscription')
        }
    ];

    return (
        <>
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 text-white transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <div className="flex flex-col h-full">
                    {/* Sidebar header */}
                    <div className="flex items-center justify-between px-4 py-5 border-b border-gray-700">
                        <div className="flex items-center">
                            <QrcodeIcon className="h-8 w-8 text-blue-400" />
                            <span className="ml-2 text-xl font-bold">QR Opinion</span>
                        </div>

                        {/* Close button (mobile only) */}
                        <button
                            className="lg:hidden text-gray-400 hover:text-white"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <XIcon className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-2 py-4 space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center px-4 py-3 rounded-lg ${
                                    item.current
                                        ? 'bg-gray-900 text-white'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <span className="mr-3">{item.icon}</span>
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* User info */}
                    {currentUser && (
                        <div className="p-4 border-t border-gray-700">
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">
                    {currentUser.business_name.charAt(0).toUpperCase()}
                  </span>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-white truncate">{currentUser.business_name}</p>
                                    <p className="text-xs text-gray-400 truncate">{currentUser.email}</p>
                                </div>
                            </div>

                            <button
                                onClick={logout}
                                className="w-full flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg"
                            >
                                // Continuing src/components/common/Sidebar.js
                                <LogoutIcon className="h-5 w-5 mr-2" />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile toggle button */}
            <div className="fixed bottom-4 right-4 lg:hidden z-20">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-3 rounded-full bg-blue-600 text-white shadow-lg"
                >
                    <MenuIcon className="h-6 w-6" />
                </button>
            </div>
        </>
    );
};

export default Sidebar;
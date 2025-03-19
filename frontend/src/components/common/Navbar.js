// src/components/common/Navbar.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { BellIcon, CogIcon } from '@heroicons/react/outline';
import { AuthContext } from '../../context/AuthContext';
import { UIContext } from '../../context/UIContext';

const Navbar = ({ title }) => {
    const { currentUser } = useContext(AuthContext);
    const { notification } = useContext(UIContext);

    return (
        <header className="bg-white shadow">
            <div className="flex justify-between items-center px-6 py-4">
                <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>

                <div className="flex items-center space-x-4">
                    {/* Notifications */}
                    <button className="text-gray-500 hover:text-gray-700 relative">
                        <BellIcon className="h-6 w-6" />
                        {/* Notification indicator */}
                        {notification && (
                            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                        )}
                    </button>

                    {/* Settings */}
                    <Link to="/settings" className="text-gray-500 hover:text-gray-700">
                        <CogIcon className="h-6 w-6" />
                    </Link>

                    {/* User menu - could be expanded to a dropdown */}
                    {currentUser && (
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-sm font-bold text-white">
                  {currentUser.business_name.charAt(0).toUpperCase()}
                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
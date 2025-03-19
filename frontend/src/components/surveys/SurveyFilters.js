// frontend/src/components/surveys/SurveyFilters.js
import React from 'react';

const SurveyFilters = ({ searchQuery, setSearchQuery, filterActive, setFilterActive }) => {
    return (
        <div className="bg-white shadow rounded-lg mb-6">
            <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="w-full md:w-1/3 mb-4 md:mb-0">
                        <label htmlFor="search" className="sr-only">Szukaj</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                id="search"
                                name="search"
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Szukaj ankiet..."
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex space-x-4">
                        <div>
                            <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                id="filter"
                                value={filterActive}
                                onChange={(e) => setFilterActive(e.target.value)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            >
                                <option value="all">Wszystkie</option>
                                <option value="active">Aktywne</option>
                                <option value="inactive">Nieaktywne</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SurveyFilters;
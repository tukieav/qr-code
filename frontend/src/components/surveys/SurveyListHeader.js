// frontend/src/components/surveys/SurveyListHeader.js
import React from 'react';

const SurveyListHeader = ({ sortColumn, sortDirection, handleSort }) => {
    // Renderowanie ikony sortowania
    const renderSortIcon = (column) => {
        if (column !== sortColumn) return null;

        return (
            <span className="ml-1">
                {sortDirection === 'asc' ? '▲' : '▼'}
            </span>
        );
    };

    return (
        <thead className="bg-gray-50">
        <tr>
            <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('title')}
            >
                <div className="flex items-center">
                    Tytuł ankiety
                    {renderSortIcon('title')}
                </div>
            </th>
            <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('question_count')}
            >
                <div className="flex items-center">
                    Pytania
                    {renderSortIcon('question_count')}
                </div>
            </th>
            <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('creation_date')}
            >
                <div className="flex items-center">
                    Data utworzenia
                    {renderSortIcon('creation_date')}
                </div>
            </th>
            <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('is_active')}
            >
                <div className="flex items-center">
                    Status
                    {renderSortIcon('is_active')}
                </div>
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Akcje
            </th>
        </tr>
        </thead>
    );
};

export default SurveyListHeader;
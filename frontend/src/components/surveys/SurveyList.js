// src/components/surveys/SurveyList.js
import React from 'react';
import { DocumentTextIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import GenericList from '../common/GenericList';
import EmptySurveyList from './EmptySurveyList';

/**
 * Komponent wyświetlający listę ankiet wykorzystujący komponent generyczny
 */
const SurveyList = ({
                        surveys,
                        sortColumn,
                        sortDirection,
                        handleSort,
                        handleToggleActive,
                        handleDuplicateSurvey,
                        handleDeleteSurvey,
                        formatDate
                    }) => {
    // Definicje kolumn dla listy ankiet
    const columns = [
        {
            name: 'title',
            label: 'Tytuł ankiety',
            sortable: true,
            render: (survey) => (
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-100 rounded-md">
                        <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{survey.title}</div>
                        <div className="text-sm text-gray-500">
                            {survey.description ? (
                                survey.description.length > 50
                                    ? `${survey.description.substring(0, 50)}...`
                                    : survey.description
                            ) : (
                                'Brak opisu'
                            )}
                        </div>
                    </div>
                </div>
            )
        },
        {
            name: 'question_count',
            label: 'Pytania',
            sortable: true,
            render: (survey) => (
                <div className="text-sm text-gray-900">{survey.questions?.length || 0}</div>
            )
        },
        {
            name: 'creation_date',
            label: 'Data utworzenia',
            sortable: true,
            render: (survey) => (
                <div className="text-sm text-gray-900">{formatDate(survey.creation_date)}</div>
            )
        },
        {
            name: 'is_active',
            label: 'Status',
            sortable: true,
            render: (survey) => (
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    survey.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                }`}>
          {survey.is_active ? 'Aktywna' : 'Nieaktywna'}
        </span>
            )
        }
    ];

    // Funkcja generująca dodatkowe akcje dla każdej ankiety
    const getSurveyAdditionalActions = (survey) => {
        return [
            // Przycisk duplikowania
            <button
                key="duplicate"
                onClick={() => handleDuplicateSurvey(survey)}
                className="text-blue-600 hover:text-blue-900"
                title="Duplikuj"
            >
                <DocumentDuplicateIcon className="h-5 w-5" />
            </button>
        ];
    };

    return (
        <GenericList
            items={surveys}
            columns={columns}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
            onToggleActive={handleToggleActive}
            onDelete={handleDeleteSurvey}
            editUrlPrefix="/surveys/edit/"
            emptyComponent={<EmptySurveyList />}
            additionalActions={getSurveyAdditionalActions}
        />
    );
};

export default SurveyList;
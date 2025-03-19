// frontend/src/components/surveys/SurveyList.js
import React from 'react';
import { DocumentTextIcon, DuplicateIcon } from '@heroicons/react/outline';
import { DataList, DataItemActions } from '../common';
import EmptySurveyList from './EmptySurveyList';

/**
 * Komponent wyświetlający listę ankiet
 * Korzysta z uniwersalnego komponentu DataList
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
    // Jeśli nie ma ankiet, pokazujemy komunikat
    if (surveys.length === 0) {
        return <EmptySurveyList />;
    }

    // Konfiguracja kolumn dla DataList
    const columns = [
        {
            key: 'title',
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
            key: 'question_count',
            label: 'Pytania',
            sortable: true,
            render: (survey) => (
                <div className="text-sm text-gray-900">{survey.questions?.length || 0}</div>
            )
        },
        {
            key: 'creation_date',
            label: 'Data utworzenia',
            sortable: true,
            render: (survey) => (
                <div className="text-sm text-gray-900">{formatDate(survey.creation_date)}</div>
            )
        },
        {
            key: 'is_active',
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
        },
        {
            key: 'actions',
            label: 'Akcje',
            render: (survey) => {
                // Dodatkowy przycisk akcji dla ankiety
                const additionalActions = [
                    // Przycisk duplikowania
                    <button
                        key="duplicate"
                        onClick={() => handleDuplicateSurvey(survey)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Duplikuj"
                    >
                        <DuplicateIcon className="h-5 w-5" />
                    </button>
                ];

                return (
                    <DataItemActions
                        id={survey._id}
                        isActive={survey.is_active}
                        editUrl={`/surveys/edit/${survey._id}`}
                        onToggleActive={handleToggleActive}
                        onDelete={handleDeleteSurvey}
                        additionalActions={additionalActions}
                    />
                );
            }
        }
    ];

    // Renderowanie komponentu DataList
    return (
        <DataList
            data={surveys}
            columns={columns}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
            onDelete={handleDeleteSurvey}
            emptyComponent={<EmptySurveyList />}
        />
    );
};

export default SurveyList;
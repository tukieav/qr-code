// frontend/src/components/surveys/SurveyList.js
import React from 'react';
import SurveyListHeader from './SurveyListHeader';
import SurveyItem from './SurveyItem';
import EmptySurveyList from './EmptySurveyList';

const SurveyList = ({
                        surveys,
                        sortColumn,
                        sortDirection,
                        handleSort,
                        handleToggleActive,
                        handleDuplicateSurvey,
                        confirmDelete,
                        setConfirmDelete,
                        handleDeleteSurvey,
                        formatDate
                    }) => {
    // Jeśli nie ma ankiet, pokazujemy komunikat
    if (surveys.length === 0) {
        return <EmptySurveyList />;
    }

    return (
        <table className="min-w-full divide-y divide-gray-200">
            <SurveyListHeader
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                handleSort={handleSort}
            />
            <tbody className="bg-white divide-y divide-gray-200">
            {surveys.map((survey) => (
                <SurveyItem
                    key={survey._id}
                    survey={survey}
                    handleToggleActive={handleToggleActive}
                    handleDuplicateSurvey={handleDuplicateSurvey}
                    confirmDelete={confirmDelete}
                    setConfirmDelete={setConfirmDelete}
                    handleDeleteSurvey={handleDeleteSurvey}
                    formatDate={formatDate}
                />
            ))}
            </tbody>
        </table>
    );
};

export default SurveyList;
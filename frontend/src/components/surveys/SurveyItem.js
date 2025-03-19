// frontend/src/components/surveys/SurveyItem.js
import React from 'react';
import { Link } from 'react-router-dom';
import {
    DocumentTextIcon,
    PencilAltIcon,
    TrashIcon,
    DuplicateIcon,
    SwitchHorizontalIcon
} from '@heroicons/react/outline';

const SurveyItem = ({
                        survey,
                        handleToggleActive,
                        handleDuplicateSurvey,
                        setConfirmDelete,
                        confirmDelete,
                        handleDeleteSurvey,
                        formatDate
                    }) => {
    return (
        <tr>
            <td className="px-6 py-4 whitespace-nowrap">
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
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{survey.questions?.length || 0}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{formatDate(survey.creation_date)}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    survey.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                }`}>
                    {survey.is_active ? 'Aktywna' : 'Nieaktywna'}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                    {/* Przycisk edycji */}
                    <Link
                        to={`/surveys/edit/${survey._id}`}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edytuj"
                    >
                        <PencilAltIcon className="h-5 w-5" />
                    </Link>

                    {/* Przycisk zmiany statusu */}
                    <button
                        onClick={() => handleToggleActive(survey._id, survey.is_active)}
                        className="text-blue-600 hover:text-blue-900"
                        title={survey.is_active ? 'Dezaktywuj' : 'Aktywuj'}
                    >
                        <SwitchHorizontalIcon className="h-5 w-5" />
                    </button>

                    {/* Przycisk duplikowania */}
                    <button
                        onClick={() => handleDuplicateSurvey(survey)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Duplikuj"
                    >
                        <DuplicateIcon className="h-5 w-5" />
                    </button>

                    {/* Przycisk usuwania */}
                    <button
                        onClick={() => setConfirmDelete(survey._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Usuń"
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>
                </div>

                {/* Dialog potwierdzenia usunięcia */}
                {confirmDelete === survey._id && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Potwierdzenie usunięcia
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Czy na pewno chcesz usunąć ankietę "{survey.title}"? Tej operacji nie można cofnąć.
                            </p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setConfirmDelete(null)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                                >
                                    Anuluj
                                </button>
                                <button
                                    onClick={() => handleDeleteSurvey(survey._id)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                >
                                    Usuń
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </td>
        </tr>
    );
};

export default SurveyItem;
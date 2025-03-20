// frontend/src/components/common/DataItemActions.js
import React from 'react';
import { Link } from 'react-router-dom';
import {
    PencilSquareIcon,
    TrashIcon,
    ArrowsRightLeftIcon
} from '@heroicons/react/24/outline';

/**
 * Komponent uniwersalny do wyświetlania przycisków akcji dla elementów listy
 *
 * @param {Object} props - Właściwości komponentu
 * @param {string} props.id - Identyfikator elementu
 * @param {boolean} props.isActive - Czy element jest aktywny
 * @param {string} props.editUrl - URL do edycji elementu
 * @param {Function} props.onToggleActive - Funkcja obsługująca przełączanie statusu aktywności
 * @param {Function} props.onDelete - Funkcja obsługująca usuwanie elementu
 * @param {Array} props.additionalActions - Tablica dodatkowych przycisków akcji (opcjonalne)
 * @returns {JSX.Element} Przyciski akcji
 */
const DataItemActions = ({
                             id,
                             isActive,
                             editUrl,
                             onToggleActive,
                             onDelete,
                             additionalActions = []
                         }) => {
    return (
        <div className="flex justify-end space-x-2">
            {/* Przycisk edycji */}
            {editUrl && (
                <Link
                    to={editUrl}
                    className="text-blue-600 hover:text-blue-900"
                    title="Edytuj"
                >
                    <PencilSquareIcon className="h-5 w-5" />
                </Link>
            )}

            {/* Przycisk zmiany statusu */}
            {onToggleActive && (
                <button
                    onClick={() => onToggleActive(id, isActive)}
                    className="text-blue-600 hover:text-blue-900"
                    title={isActive ? 'Dezaktywuj' : 'Aktywuj'}
                >
                    <ArrowsRightLeftIcon className="h-5 w-5" />
                </button>
            )}

            {/* Dodatkowe przyciski akcji */}
            {additionalActions.map((action, index) => (
                <React.Fragment key={index}>
                    {action}
                </React.Fragment>
            ))}

            {/* Przycisk usuwania */}
            {onDelete && (
                <button
                    onClick={() => onDelete(id)}
                    className="text-red-600 hover:text-red-900"
                    title="Usuń"
                >
                    <TrashIcon className="h-5 w-5" />
                </button>
            )}
        </div>
    );
};

export default DataItemActions;
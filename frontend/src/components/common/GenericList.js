// src/components/common/GenericList.js
import React, { useState } from 'react';
import { PencilAltIcon, TrashIcon, SwitchHorizontalIcon } from '@heroicons/react/outline';
import { Link } from 'react-router-dom';
import ConfirmDialog from './ConfirmDialog';

/**
 * Uniwersalny komponent listy do wyświetlania różnych typów danych
 * z możliwością sortowania, filtrowania i wykonywania akcji
 *
 * @param {Object} props - Właściwości komponentu
 * @param {Array} props.items - Tablica elementów do wyświetlenia
 * @param {Array} props.columns - Definicje kolumn (nazwa, label, render, sortable)
 * @param {String} props.sortColumn - Aktualna kolumna sortowania
 * @param {String} props.sortDirection - Kierunek sortowania ('asc' lub 'desc')
 * @param {Function} props.onSort - Funkcja wywoływana przy zmianie sortowania
 * @param {Function} props.onToggleActive - Funkcja do przełączania aktywności elementu
 * @param {Function} props.onDelete - Funkcja do usuwania elementu
 * @param {String} props.editUrlPrefix - Prefiks URL do edycji elementu (np. "/surveys/edit/")
 * @param {JSX.Element} props.emptyComponent - Komponent wyświetlany gdy lista jest pusta
 * @param {Array} props.additionalActions - Dodatkowe akcje dla elementów listy (opcjonalne)
 * @returns {JSX.Element} Komponent listy
 */
const GenericList = ({
                         items,
                         columns,
                         sortColumn,
                         sortDirection,
                         onSort,
                         onToggleActive,
                         onDelete,
                         editUrlPrefix,
                         emptyComponent,
                         additionalActions = []
                     }) => {
    const [itemToDelete, setItemToDelete] = useState(null);

    // Jeśli brak elementów, wyświetl komponent dla pustej listy
    if (!items || items.length === 0) {
        return emptyComponent || (
            <div className="py-6 text-center">
                <p className="text-gray-500">Brak danych do wyświetlenia.</p>
            </div>
        );
    }

    // Renderowanie ikony sortowania
    const renderSortIcon = (column) => {
        if (column !== sortColumn) return null;

        return (
            <span className="ml-1">
        {sortDirection === 'asc' ? '▲' : '▼'}
      </span>
        );
    };

    // Obsługa potwierdzenia usunięcia
    const handleDeleteConfirm = () => {
        if (itemToDelete && onDelete) {
            onDelete(itemToDelete);
        }
        setItemToDelete(null);
    };

    // Renderowanie przycisków akcji dla elementu
    const renderActions = (item) => {
        const actions = [];

        // Dodaj przycisk edycji jeśli podano prefiks URL
        if (editUrlPrefix) {
            actions.push(
                <Link
                    key="edit"
                    to={`${editUrlPrefix}${item._id}`}
                    className="text-blue-600 hover:text-blue-900"
                    title="Edytuj"
                >
                    <PencilAltIcon className="h-5 w-5" />
                </Link>
            );
        }

        // Dodaj przycisk przełączania aktywności
        if (onToggleActive) {
            actions.push(
                <button
                    key="toggle"
                    onClick={() => onToggleActive(item._id, item.is_active)}
                    className="text-blue-600 hover:text-blue-900"
                    title={item.is_active ? 'Dezaktywuj' : 'Aktywuj'}
                >
                    <SwitchHorizontalIcon className="h-5 w-5" />
                </button>
            );
        }

        // Dodaj dodatkowe akcje specyficzne dla elementu
        if (typeof additionalActions === 'function') {
            const customActions = additionalActions(item);
            actions.push(...customActions);
        } else if (Array.isArray(additionalActions)) {
            actions.push(...additionalActions);
        }

        // Dodaj przycisk usuwania
        if (onDelete) {
            actions.push(
                <button
                    key="delete"
                    onClick={() => setItemToDelete(item._id)}
                    className="text-red-600 hover:text-red-900"
                    title="Usuń"
                >
                    <TrashIcon className="h-5 w-5" />
                </button>
            );
        }

        return (
            <div className="flex justify-end space-x-2">
                {actions}
            </div>
        );
    };

    return (
        <>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.name}
                                scope="col"
                                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.sortable ? 'cursor-pointer' : ''}`}
                                onClick={() => column.sortable && onSort && onSort(column.name)}
                            >
                                <div className="flex items-center">
                                    {column.label}
                                    {column.sortable && renderSortIcon(column.name)}
                                </div>
                            </th>
                        ))}
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Akcje
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {items.map((item) => (
                        <tr key={item._id}>
                            {columns.map((column) => (
                                <td key={`${item._id}-${column.name}`} className="px-6 py-4 whitespace-nowrap">
                                    {column.render ? column.render(item) : item[column.name]}
                                </td>
                            ))}
                            <td className="px-6 py-4 whitespace-nowrap">
                                {renderActions(item)}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Dialog potwierdzenia usunięcia */}
            <ConfirmDialog
                isOpen={!!itemToDelete}
                title="Potwierdzenie usunięcia"
                message="Czy na pewno chcesz usunąć ten element? Tej operacji nie można cofnąć."
                onConfirm={handleDeleteConfirm}
                onCancel={() => setItemToDelete(null)}
            />
        </>
    );
};

export default GenericList;
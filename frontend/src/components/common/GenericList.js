// src/components/common/GenericList.js
import React, { useState } from 'react';
import { PencilSquareIcon, TrashIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
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
 * @param {Function|Array} props.additionalActions - Funkcja lub tablica akcji dla elementów listy
 * @param {String} props.idField - Nazwa pola ID w elementach (domyślnie "_id")
 * @param {Object} props.classes - Niestandardowe klasy CSS
 * @returns {JSX.Element} Komponent listy
 */
const GenericList = ({
                         items = [],
                         columns = [],
                         sortColumn,
                         sortDirection,
                         onSort,
                         onToggleActive,
                         onDelete,
                         editUrlPrefix,
                         emptyComponent,
                         additionalActions = [],
                         idField = '_id',
                         classes = {}
                     }) => {
    const [itemToDelete, setItemToDelete] = useState(null);

    // Domyślne klasy CSS
    const defaultClasses = {
        table: 'min-w-full divide-y divide-gray-200',
        header: 'bg-gray-50',
        headerCell: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
        headerSortable: 'cursor-pointer',
        row: 'bg-white hover:bg-gray-50',
        cell: 'px-6 py-4 whitespace-nowrap',
        actionButton: 'text-blue-600 hover:text-blue-900 mx-1',
        deleteButton: 'text-red-600 hover:text-red-900 mx-1'
    };

    // Połączenie domyślnych klas z niestandardowymi
    const mergedClasses = { ...defaultClasses, ...classes };

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
        const itemId = item[idField];

        // Dodaj przycisk edycji jeśli podano prefiks URL
        if (editUrlPrefix) {
            actions.push(
                <Link
                    key="edit"
                    to={`${editUrlPrefix}${itemId}`}
                    className={mergedClasses.actionButton}
                    title="Edytuj"
                >
                    <PencilSquareIcon className="h-5 w-5" />
                </Link>
            );
        }

        // Dodaj przycisk przełączania aktywności
        if (onToggleActive && typeof item.is_active !== 'undefined') {
            actions.push(
                <button
                    key="toggle"
                    onClick={() => onToggleActive(itemId, item.is_active)}
                    className={mergedClasses.actionButton}
                    title={item.is_active ? 'Dezaktywuj' : 'Aktywuj'}
                >
                    <ArrowsRightLeftIcon className="h-5 w-5" />
                </button>
            );
        }

        // Dodaj dodatkowe akcje specyficzne dla elementu
        if (typeof additionalActions === 'function') {
            const customActions = additionalActions(item);
            if (Array.isArray(customActions)) {
                actions.push(...customActions);
            }
        } else if (Array.isArray(additionalActions)) {
            actions.push(...additionalActions);
        }

        // Dodaj przycisk usuwania
        if (onDelete) {
            actions.push(
                <button
                    key="delete"
                    onClick={() => setItemToDelete(itemId)}
                    className={mergedClasses.deleteButton}
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
                <table className={mergedClasses.table}>
                    <thead className={mergedClasses.header}>
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.name}
                                scope="col"
                                className={`${mergedClasses.headerCell} ${column.sortable ? mergedClasses.headerSortable : ''}`}
                                onClick={() => column.sortable && onSort && onSort(column.name)}
                            >
                                <div className="flex items-center">
                                    {column.label}
                                    {column.sortable && renderSortIcon(column.name)}
                                </div>
                            </th>
                        ))}
                        <th scope="col" className={`${mergedClasses.headerCell} text-right`}>
                            Akcje
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {items.map((item) => (
                        <tr key={item[idField]} className={mergedClasses.row}>
                            {columns.map((column) => (
                                <td key={`${item[idField]}-${column.name}`} className={mergedClasses.cell}>
                                    {column.render ? column.render(item) : item[column.name]}
                                </td>
                            ))}
                            <td className={mergedClasses.cell}>
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
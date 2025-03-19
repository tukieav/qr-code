// frontend/src/components/common/DataList.js
import React, { useState } from 'react';
import ConfirmDialog from './ConfirmDialog';

/**
 * Uniwersalny komponent do wyświetlania listy danych w formie tabeli
 *
 * @param {Object} props - Właściwości komponentu
 * @param {Array} props.data - Tablica danych do wyświetlenia
 * @param {Array} props.columns - Konfiguracja kolumn tabeli
 * @param {string} props.sortColumn - Nazwa kolumny, według której dane są sortowane
 * @param {string} props.sortDirection - Kierunek sortowania ('asc' lub 'desc')
 * @param {Function} props.onSort - Funkcja wywoływana przy zmianie sortowania
 * @param {Function} props.renderItem - Funkcja renderująca pojedynczy element (alternatywa dla columns)
 * @param {Function} props.onDelete - Funkcja obsługująca usuwanie elementu
 * @param {JSX.Element} props.emptyComponent - Komponent wyświetlany gdy lista jest pusta
 * @returns {JSX.Element} Komponent listy danych
 */
const DataList = ({
                      data,
                      columns,
                      sortColumn,
                      sortDirection,
                      onSort,
                      renderItem,
                      onDelete,
                      emptyComponent
                  }) => {
    const [itemToDelete, setItemToDelete] = useState(null);

    // Jeśli nie ma danych, pokazujemy komunikat
    if (!data || data.length === 0) {
        return emptyComponent || <div className="text-center py-6">Brak danych do wyświetlenia.</div>;
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

    return (
        <>
            <table className="min-w-full divide-y divide-gray-200">
                {/* Nagłówek tabeli */}
                <thead className="bg-gray-50">
                <tr>
                    {columns.map((column) => (
                        <th
                            key={column.key}
                            scope="col"
                            className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.sortable ? 'cursor-pointer' : ''}`}
                            onClick={() => column.sortable && onSort && onSort(column.key)}
                        >
                            <div className="flex items-center">
                                {column.label}
                                {column.sortable && renderSortIcon(column.key)}
                            </div>
                        </th>
                    ))}
                </tr>
                </thead>

                {/* Zawartość tabeli */}
                <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item) => (
                    <tr key={item.id || item._id}>
                        {renderItem ? (
                            renderItem(item, { onDelete: () => setItemToDelete(item.id || item._id) })
                        ) : (
                            <>
                                {columns.map((column) => (
                                    <td key={`${item.id || item._id}-${column.key}`} className="px-6 py-4 whitespace-nowrap">
                                        {column.render ? column.render(item) : item[column.key]}
                                    </td>
                                ))}
                            </>
                        )}
                    </tr>
                ))}
                </tbody>
            </table>

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

export default DataList;
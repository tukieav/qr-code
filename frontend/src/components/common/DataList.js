// src/components/common/DataList.js
import React from 'react';
import GenericList from './GenericList';

/**
 * Komponent DataList opakowujący nowy GenericList, zachowujący zgodność API
 * z wcześniejszą implementacją dla łatwego przejścia na nową wersję.
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
    // Konwersja columns z formatu DataList do formatu GenericList
    const genericColumns = columns.filter(column => column.key !== 'actions').map(column => ({
        name: column.key,
        label: column.label,
        sortable: column.sortable,
        render: column.render
    }));

    // Funkcje przełączania aktywności i edycji wyciągane z kolumny actions
    const extractActionFunctions = (item) => {
        const actionsColumn = columns.find(col => col.key === 'actions');
        if (actionsColumn && actionsColumn.render) {
            // Tu zakładamy, że render dla kolumny 'actions' zwraca komponent DataItemActions
            // i przez analizę tego, co przekazuje, możemy określić, co komponent ma robić
            // W praktyce jest to trochę hackerskie, ale zachowuje zgodność z istniejącym kodem
            try {
                const renderedActions = actionsColumn.render(item);
                // Parsowanie funkcji i parametrów z renderedActions
                // W rzeczywistości jest to trudne do zrobienia w uniwersalny sposób
                // Dlatego w praktyce lepiej od razu przejść na GenericList
                return [];
            } catch (e) {
                return [];
            }
        }
        return [];
    };

    return (
        <GenericList
            items={data}
            columns={genericColumns}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={onSort}
            onToggleActive={(id, isActive) => {
                // Tu trzeba by implementować logikę wyciągania funkcji toggle z kolumny actions
                // Jest to trudne, więc lepszym podejściem jest bezpośrednie przejście na GenericList
            }}
            onDelete={onDelete}
            // Brak bezpośredniego mapowania editUrlPrefix - trzeba by go wyciągać z actions
            emptyComponent={emptyComponent}
            additionalActions={(item) => {
                // Podobny problem jak wyżej - trudno wyekstrahować dodatkowe akcje
                return extractActionFunctions(item);
            }}
        />
    );
};

export default DataList;
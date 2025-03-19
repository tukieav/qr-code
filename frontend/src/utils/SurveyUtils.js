// frontend/src/utils/SurveyUtils.js

// Formatowanie daty
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

// Filtrowanie i sortowanie ankiet
export const getSortedAndFilteredSurveys = (surveys, filterActive, searchQuery, sortColumn, sortDirection) => {
    return surveys
        // Filtrowanie według statusu aktywności
        .filter(survey => {
            if (filterActive === 'all') return true;
            return filterActive === 'active' ? survey.is_active : !survey.is_active;
        })
        // Filtrowanie według wyszukiwanego tekstu
        .filter(survey => {
            if (!searchQuery) return true;
            const query = searchQuery.toLowerCase();
            return (
                survey.title.toLowerCase().includes(query) ||
                (survey.description && survey.description.toLowerCase().includes(query))
            );
        })
        // Sortowanie
        .sort((a, b) => {
            let comparison = 0;

            // Określenie kierunku sortowania
            const direction = sortDirection === 'asc' ? 1 : -1;

            // Sortowanie według różnych kolumn
            switch (sortColumn) {
                case 'title':
                    comparison = a.title.localeCompare(b.title);
                    break;
                case 'question_count':
                    comparison = (a.questions?.length || 0) - (b.questions?.length || 0);
                    break;
                case 'is_active':
                    comparison = (a.is_active === b.is_active) ? 0 : a.is_active ? -1 : 1;
                    break;
                case 'creation_date':
                default:
                    comparison = new Date(a.creation_date) - new Date(b.creation_date);
                    break;
            }

            return comparison * direction;
        });
};
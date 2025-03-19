// frontend/src/utils/QRCodeUtils.js

// Formatowanie daty
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

// Pobieranie adresu URL dla kodu QR
export const getQRCodeSurveyUrl = (uniqueCode) => {
    const frontendUrl = process.env.REACT_APP_FRONTEND_URL || window.location.origin;
    return `${frontendUrl}/survey/${uniqueCode}`;
};

// Pobieranie domeny z URL
export const getDomainFromUrl = (url) => {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.hostname;
    } catch (e) {
        return 'qropinion.pl';
    }
};

// Filtrowanie i sortowanie kodów QR
export const getSortedAndFilteredQRCodes = (qrCodes, filterActive, searchQuery, sortColumn, sortDirection) => {
    return qrCodes
        // Filtrowanie według statusu aktywności
        .filter(qrCode => {
            if (filterActive === 'all') return true;
            return filterActive === 'active' ? qrCode.is_active : !qrCode.is_active;
        })
        // Filtrowanie według wyszukiwanego tekstu
        .filter(qrCode => {
            if (!searchQuery) return true;
            const query = searchQuery.toLowerCase();
            return (
                qrCode.name.toLowerCase().includes(query) ||
                (qrCode.survey_id && qrCode.survey_id.title && qrCode.survey_id.title.toLowerCase().includes(query))
            );
        })
        // Sortowanie
        .sort((a, b) => {
            let comparison = 0;

            // Określenie kierunku sortowania
            const direction = sortDirection === 'asc' ? 1 : -1;

            // Sortowanie według różnych kolumn
            switch (sortColumn) {
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'survey_title':
                    // Obsługa braku tytułu ankiety
                    const titleA = (a.survey_id && a.survey_id.title) || '';
                    const titleB = (b.survey_id && b.survey_id.title) || '';
                    comparison = titleA.localeCompare(titleB);
                    break;
                case 'scan_count':
                    comparison = (a.scan_count || 0) - (b.scan_count || 0);
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
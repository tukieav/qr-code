// utils/dateUtils.js
export const formatDate = (dateString, locale = 'pl-PL') => {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

export const formatDateTime = (dateString, locale = 'pl-PL') => {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};
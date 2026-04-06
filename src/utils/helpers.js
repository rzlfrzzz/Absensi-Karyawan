export const getCurrentTime = () => {
    return new Date().toLocaleTimeString('it-IT', { hour12: false }).slice(0, 5);
};
export const isTimeAfter = (time, limit) => {
    return time > limit;
};
export const isTimeBefore = (time, limit) => {
    return time < limit;
};
export const formatDateLocal = (dateString, locale) => {
    try {
        return new Date(dateString).toLocaleDateString(locale, {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
        });
    }
    catch (error) {
        console.error('Failed to format date:', error);
        return dateString;
    }
};
export const exportToCSV = (data, filename) => {
    try {
        const csvContent = '\uFEFF' +
            data
                .map((row) => {
                if (Array.isArray(row)) {
                    return row.join(',');
                }
                return String(row);
            })
                .join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
    catch (error) {
        console.error('Failed to export CSV:', error);
    }
};
export const showNotification = (type, title, message) => {
    if (typeof window.Swal !== 'undefined') {
        const swal = window.Swal;
        swal.fire({
            title,
            text: message,
            icon: type,
            background: '#fff',
            confirmButtonColor: '#4f46e5',
            borderRadius: '2rem',
        });
    }
};
export const confirmDelete = async (message) => {
    if (typeof window.Swal !== 'undefined') {
        const swal = window.Swal;
        const result = await swal.fire({
            title: 'Confirm Delete',
            text: message,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Delete',
            borderRadius: '1.5rem',
        });
        return result.isConfirmed;
    }
    return false;
};

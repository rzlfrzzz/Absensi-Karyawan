export const attendanceHelper = {
    determineStatus(tipe, time, shift, settings) {
        const checkinLimit = shift === 'Siang'
            ? (settings?.jam_masuk_siang || '08:00')
            : (settings?.jam_masuk_malam || '17:15');
        const checkoutLimit = shift === 'Siang'
            ? (settings?.jam_pulang_siang || '17:00')
            : (settings?.jam_pulang_malam || '02:15');
        if (tipe === 'MASUK' && time > checkinLimit) {
            return 'Terlambat';
        }
        if (tipe === 'PULANG') {
            if (shift === 'Siang' && time < checkoutLimit) {
                return 'Pulang Cepat';
            }
            if (shift === 'Malam') {
                if ((time >= '17:15' && time <= '23:59') || time < checkoutLimit) {
                    return 'Pulang Cepat';
                }
            }
        }
        return 'On Time';
    },
    getStatusMessage(status, tipe) {
        const baseMessage = 'Absensi berhasil dicatat!';
        if (tipe === 'MASUK' && status === 'Terlambat') {
            return 'Anda terlambat! Tetap semangat, hari ini milik Anda! 🔥';
        }
        if (tipe === 'PULANG' && status === 'Pulang Cepat') {
            return 'Belum jam pulang, tapi kerja keras Anda luar biasa!';
        }
        return baseMessage;
    },
    getStatusLabel(log) {
        const time = log.jam;
        const type = log.tipe.toUpperCase();
        // Default ke shift siang karena tidak ada shift di log
        if (type === 'MASUK') {
            const limit = '08:00';
            return time > limit ? 'Terlambat' : '';
        }
        else {
            const outLimit = '17:00';
            return time < outLimit ? 'Pulang Cepat' : '';
        }
    },
};

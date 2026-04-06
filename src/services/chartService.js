export const chartService = {
    /**
     * Prepare attendance line chart data
     */
    prepareAttendanceChartData(dailyStats) {
        return dailyStats.map((stat) => ({
            date: this.formatDate(stat.date),
            present: stat.present,
            late: stat.late,
            absent: stat.absent,
            onTime: stat.onTime,
        }));
    },
    /**
     * Prepare late reasons pie chart data
     */
    prepareLateReasonsChartData(reasons, labelTranslator) {
        return reasons.map((reason) => ({
            name: labelTranslator(reason.reason),
            value: reason.count,
            percentage: reason.percentage,
        }));
    },
    /**
     * Helper: Format date for display
     */
    formatDate(dateStr) {
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('id-ID', {
            month: 'short',
            day: 'numeric',
        });
    },
    /**
     * Get chart colors
     */
    getChartColors() {
        return {
            present: '#10b981', // green
            late: '#f59e0b', // amber
            absent: '#ef4444', // red
            onTime: '#3b82f6', // blue
            primary: '#6366f1', // indigo
            secondary: '#8b5cf6', // purple
        };
    },
};

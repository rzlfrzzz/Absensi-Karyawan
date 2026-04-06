import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import { analyticsService } from '../../services/analyticsService';
import { chartService } from '../../services/chartService';
import { exportService } from '../../services/exportService';
import { adminService } from '../../services/adminService';
import { showNotification } from '../../utils/helpers';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { KPICards } from './KPICards';
import { StatisticsCards } from './StatisticsCards';
import { AttendanceChart } from './AttendanceChart';
import { LateReasonsChart } from './LateReasonsChart';
import { PerformanceRanking } from './PerformanceRanking';
import { DateRangeFilter } from './DateRangeFilter';
export const AnalyticsDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { lang, t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [karyawan, setKaryawan] = useState([]);
    const [logs, setLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    // Today stats
    const [todayStats, setTodayStats] = useState({ present: 0, late: 0, absent: 0, onTime: 0 });
    // Monthly stats
    const [monthlyStats, setMonthlyStats] = useState({
        attendanceRate: 0,
        avgLateMinutes: 0,
        totalAbsentDays: 0,
        totalLateCount: 0,
    });
    // Chart data
    const [attendanceChartData, setAttendanceChartData] = useState([]);
    const [lateReasonsData, setLateReasonsData] = useState([]);
    const [topPerformers, setTopPerformers] = useState([]);
    // Date range
    const dateOptions = analyticsService.getDateRangeOptions();
    const [startDate, setStartDate] = useState(dateOptions.thisMonth.start);
    const [endDate, setEndDate] = useState(dateOptions.thisMonth.end);
    // Load data
    useEffect(() => {
        loadData();
    }, []);
    // Update when date range changes
    useEffect(() => {
        if (logs.length > 0) {
            updateAnalytics();
        }
    }, [startDate, endDate, logs]);
    const loadData = async () => {
        setLoading(true);
        try {
            const [dataKaryawan, dataLogs] = await Promise.all([
                adminService.getAllKaryawan(),
                adminService.getAllLogs(),
            ]);
            setKaryawan(dataKaryawan);
            setLogs(dataLogs);
            setFilteredLogs(dataLogs);
            // Calculate initial stats
            const today = analyticsService.getTodayStats(dataLogs, dataKaryawan);
            setTodayStats(today);
        }
        catch (error) {
            console.error('Failed to load data:', error);
            showNotification('error', t('error'), t('error_message'));
        }
        finally {
            setLoading(false);
        }
    };
    const updateAnalytics = () => {
        // Monthly stats
        const monthly = analyticsService.getMonthlyStats(filteredLogs, karyawan, startDate, endDate);
        setMonthlyStats(monthly);
        // Chart data
        const dailyStats = analyticsService.getDailyStatsForChart(filteredLogs, karyawan, startDate, endDate);
        const chartData = chartService.prepareAttendanceChartData(dailyStats);
        setAttendanceChartData(chartData);
        // Late reasons
        const reasons = analyticsService.getLateReasons(filteredLogs);
        const reasonsChartData = chartService.prepareLateReasonsChartData(reasons, (key) => t(key));
        setLateReasonsData(reasonsChartData);
        // Top performers
        const performers = analyticsService.getTopPerformers(filteredLogs, karyawan, 5);
        setTopPerformers(performers);
    };
    const handleDateRangeApply = (start, end) => {
        setStartDate(start);
        setEndDate(end);
        setFilteredLogs(logs);
    };
    const handleExportAttendance = () => {
        try {
            exportService.exportAttendanceReport(filteredLogs, karyawan, startDate, endDate, `Attendance_Report_${startDate}_${endDate}`);
            showNotification('success', t('saved'), 'Attendance report exported');
        }
        catch (error) {
            showNotification('error', t('error'), 'Failed to export');
        }
    };
    const handleExportPerformance = () => {
        try {
            exportService.exportPerformanceReport(topPerformers, `Performance_Report_${startDate}_${endDate}`);
            showNotification('success', t('saved'), 'Performance report exported');
        }
        catch (error) {
            showNotification('error', t('error'), 'Failed to export');
        }
    };
    if (loading) {
        return (_jsx("div", { className: "min-h-screen bg-[#F8FAFC] flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin text-4xl mb-4", children: "\u23F3" }), _jsx("p", { className: "font-bold text-slate-600", children: t('analyticsLoading') })] }) }));
    }
    return (_jsx("div", { className: "min-h-screen bg-[#F8FAFC] p-6 md:p-12 font-sans", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsxs("div", { className: "flex items-center justify-between mb-12", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-4xl font-black text-slate-900 italic uppercase mb-2", children: ["\uD83D\uDCCA ", t('analyticsTitle')] }), _jsx("p", { className: "text-slate-400 text-sm font-bold tracking-widest", children: t('analyticsSubtitle') })] }), _jsxs("div", { className: "flex gap-2 items-end", children: [_jsx(LanguageSwitcher, {}), _jsx("button", { onClick: () => navigate('/backoffice'), className: "px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-[10px] font-black uppercase hover:bg-slate-200 transition-all", children: "\u2190 Kembali" })] })] }), _jsxs("div", { className: "mb-12", children: [_jsxs("h2", { className: "text-xl font-black text-slate-900 mb-4", children: ["\u2705 ", t('todayOverview')] }), _jsx(KPICards, { present: todayStats.present, late: todayStats.late, absent: todayStats.absent, onTime: todayStats.onTime, lang: lang })] }), _jsx(DateRangeFilter, { onApply: handleDateRangeApply, lang: lang }), _jsxs("div", { className: "mb-12", children: [_jsxs("h2", { className: "text-xl font-black text-slate-900 mb-4", children: ["\uD83D\uDCC5 ", t('monthlyStats')] }), _jsx(StatisticsCards, { attendanceRate: monthlyStats.attendanceRate, avgLateMinutes: monthlyStats.avgLateMinutes, totalAbsentDays: monthlyStats.totalAbsentDays, totalLateCount: monthlyStats.totalLateCount, lang: lang })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12", children: [_jsx(AttendanceChart, { data: attendanceChartData, lang: lang }), _jsx(LateReasonsChart, { data: lateReasonsData, lang: lang })] }), _jsx("div", { className: "mb-12", children: _jsx(PerformanceRanking, { data: topPerformers, lang: lang }) }), _jsxs("div", { className: "bg-white rounded-2xl p-6 border border-slate-100 flex flex-wrap gap-3", children: [_jsxs("button", { onClick: handleExportAttendance, className: "px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm uppercase transition-all shadow-lg", children: ["\uD83D\uDCE5 ", t('exportAsExcel'), " (Attendance)"] }), _jsxs("button", { onClick: handleExportPerformance, className: "px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm uppercase transition-all shadow-lg", children: ["\uD83D\uDCE5 ", t('exportAsExcel'), " (", t('performance'), ")"] })] })] }) }));
};

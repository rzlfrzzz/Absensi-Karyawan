import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../hooks/useLanguage';
import { AttendanceLog, Karyawan } from '../../types';
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
  const [karyawan, setKaryawan] = useState<Karyawan[]>([]);
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AttendanceLog[]>([]);

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
  const [attendanceChartData, setAttendanceChartData] = useState<any[]>([]);
  const [lateReasonsData, setLateReasonsData] = useState<any[]>([]);
  const [topPerformers, setTopPerformers] = useState<any[]>([]);

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
    } catch (error) {
      console.error('Failed to load data:', error);
      showNotification('error', t('error'), t('error_message'));
    } finally {
      setLoading(false);
    }
  };

  const updateAnalytics = () => {
    // Monthly stats
    const monthly = analyticsService.getMonthlyStats(
      filteredLogs,
      karyawan,
      startDate,
      endDate
    );
    setMonthlyStats(monthly);

    // Chart data
    const dailyStats = analyticsService.getDailyStatsForChart(
      filteredLogs,
      karyawan,
      startDate,
      endDate
    );
      const chartData = chartService.prepareAttendanceChartData(dailyStats);
      setAttendanceChartData(chartData);

      // Late reasons
      const reasons = analyticsService.getLateReasons(filteredLogs);
      const reasonsChartData = chartService.prepareLateReasonsChartData(reasons, (key: string) => t(key as any));
      setLateReasonsData(reasonsChartData);

      // Top performers
      const performers = analyticsService.getTopPerformers(filteredLogs, karyawan, 5);
      setTopPerformers(performers);
    };

  const handleDateRangeApply = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    setFilteredLogs(logs);
  };

  const handleExportAttendance = () => {
    try {
      exportService.exportAttendanceReport(
        filteredLogs,
        karyawan,
        startDate,
        endDate,
        `Attendance_Report_${startDate}_${endDate}`
      );
      showNotification('success', t('saved'), 'Attendance report exported');
    } catch (error) {
      showNotification('error', t('error'), 'Failed to export');
    }
  };

  const handleExportPerformance = () => {
    try {
      exportService.exportPerformanceReport(
        topPerformers,
        `Performance_Report_${startDate}_${endDate}`
      );
      showNotification('success', t('saved'), 'Performance report exported');
    } catch (error) {
      showNotification('error', t('error'), 'Failed to export');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="font-bold text-slate-600">{t('analyticsLoading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 italic uppercase mb-2">
              📊 {t('analyticsTitle')}
            </h1>
            <p className="text-slate-400 text-sm font-bold tracking-widest">
              {t('analyticsSubtitle')}
            </p>
          </div>
          <div className="flex gap-2 items-end">
            <LanguageSwitcher />
            <button
              onClick={() => navigate('/backoffice')}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-[10px] font-black uppercase hover:bg-slate-200 transition-all"
            >
              ← Kembali
            </button>
          </div>
        </div>

        {/* Today's Overview */}
        <div className="mb-12">
          <h2 className="text-xl font-black text-slate-900 mb-4">
            ✅ {t('todayOverview')}
          </h2>
          <KPICards
            present={todayStats.present}
            late={todayStats.late}
            absent={todayStats.absent}
            onTime={todayStats.onTime}
            lang={lang}
          />
        </div>

        {/* Date Range Filter */}
        <DateRangeFilter onApply={handleDateRangeApply} lang={lang} />

        {/* Monthly Statistics */}
        <div className="mb-12">
          <h2 className="text-xl font-black text-slate-900 mb-4">
            📅 {t('monthlyStats')}
          </h2>
          <StatisticsCards
            attendanceRate={monthlyStats.attendanceRate}
            avgLateMinutes={monthlyStats.avgLateMinutes}
            totalAbsentDays={monthlyStats.totalAbsentDays}
            totalLateCount={monthlyStats.totalLateCount}
            lang={lang}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <AttendanceChart data={attendanceChartData} lang={lang} />
          <LateReasonsChart data={lateReasonsData} lang={lang} />
        </div>

        {/* Performance Ranking */}
        <div className="mb-12">
          <PerformanceRanking data={topPerformers} lang={lang} />
        </div>

        {/* Export Buttons */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 flex flex-wrap gap-3">
          <button
            onClick={handleExportAttendance}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm uppercase transition-all shadow-lg"
          >
            📥 {t('exportAsExcel')} (Attendance)
          </button>
          <button
            onClick={handleExportPerformance}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm uppercase transition-all shadow-lg"
          >
            📥 {t('exportAsExcel')} ({t('performance')})
          </button>
        </div>
      </div>
    </div>
  );
};

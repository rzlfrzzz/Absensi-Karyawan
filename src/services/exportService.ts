import * as XLSX from 'xlsx';
import { EmployeePerformance } from './analyticsService';
import { AttendanceLog, Karyawan } from '../types';

export const exportService = {
  /**
   * Export attendance report to Excel
   */
  exportAttendanceReport(
    logs: AttendanceLog[],
    karyawan: Karyawan[],
    startDate: string,
    endDate: string,
    fileName: string = 'Attendance_Report'
  ): void {
    const worksheetData: any[] = [
      ['ATTENDANCE REPORT'],
      [`From: ${startDate} To: ${endDate}`],
      [],
      ['Date', 'Employee Name', 'Position', 'Type', 'Time', 'Status'],
    ];

    // Filter logs by date range
    const filteredLogs = logs.filter((log) => {
      const logDate = log.created_at.split('T')[0];
      return logDate >= startDate && logDate <= endDate;
    });

    // Sort by date then name
    filteredLogs.sort((a, b) => {
      const dateCompare = b.created_at.localeCompare(a.created_at);
      if (dateCompare !== 0) return dateCompare;
      return a.nama.localeCompare(b.nama);
    });

    // Add data rows
    filteredLogs.forEach((log) => {
      worksheetData.push([
        log.created_at.split('T')[0],
        log.nama,
        log.jabatan || '',
        log.tipe,
        log.jam,
        log.status || '',
      ]);
    });

    // Create workbook
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');

    // Set column widths
    worksheet['!cols'] = [
      { wch: 12 },
      { wch: 20 },
      { wch: 15 },
      { wch: 10 },
      { wch: 10 },
      { wch: 15 },
    ];

    // Download
    XLSX.writeFile(workbook, `${fileName}_${new Date().getTime()}.xlsx`);
  },

  /**
   * Export employee performance report to Excel
   */
  exportPerformanceReport(
    performances: EmployeePerformance[],
    fileName: string = 'Performance_Report'
  ): void {
    const worksheetData: any[] = [
      ['EMPLOYEE PERFORMANCE REPORT'],
      [`Generated: ${new Date().toLocaleString('id-ID')}`],
      [],
      [
        'Rank',
        'Employee Name',
        'Position',
        'Total Days',
        'Present Days',
        'Late Days',
        'Absent Days',
        'Attendance Rate (%)',
        'Avg Late (min)',
        'Total Bonus (Rp)',
        'Total Deduction (Rp)',
      ],
    ];

    // Add data rows
    performances.forEach((perf, index) => {
      worksheetData.push([
        index + 1,
        perf.nama,
        perf.jabatan,
        perf.totalDays,
        perf.presentDays,
        perf.lateDays,
        perf.absentDays,
        perf.attendanceRate,
        perf.avgLateMinutes,
        perf.totalBonus,
        perf.totalDeduction,
      ]);
    });

    // Create workbook
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Performance');

    // Set column widths
    worksheet['!cols'] = [
      { wch: 6 },
      { wch: 20 },
      { wch: 15 },
      { wch: 12 },
      { wch: 12 },
      { wch: 10 },
      { wch: 12 },
      { wch: 16 },
      { wch: 14 },
      { wch: 16 },
      { wch: 18 },
    ];

    // Download
    XLSX.writeFile(workbook, `${fileName}_${new Date().getTime()}.xlsx`);
  },

  /**
   * Export summary statistics to Excel
   */
  exportSummaryReport(
    summary: {
      periodStart: string;
      periodEnd: string;
      totalEmployees: number;
      attendanceRate: number;
      avgLateMinutes: number;
      totalAbsentDays: number;
      totalLateCount: number;
    },
    fileName: string = 'Summary_Report'
  ): void {
    const worksheetData: any[] = [
      ['ATTENDANCE SUMMARY REPORT'],
      [`Period: ${summary.periodStart} to ${summary.periodEnd}`],
      [],
      ['Metric', 'Value'],
      ['Total Employees', summary.totalEmployees],
      ['Attendance Rate (%)', summary.attendanceRate],
      ['Avg Late Minutes', summary.avgLateMinutes],
      ['Total Absent Days', summary.totalAbsentDays],
      ['Total Late Count', summary.totalLateCount],
    ];

    // Create workbook
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Summary');

    // Set column widths
    worksheet['!cols'] = [{ wch: 25 }, { wch: 15 }];

    // Download
    XLSX.writeFile(workbook, `${fileName}_${new Date().getTime()}.xlsx`);
  },
};

import { AttendanceLog, Karyawan } from '../types';
import { attendanceHelper } from '../utils/attendanceHelper';

export interface DailyStats {
  date: string;
  present: number;
  late: number;
  absent: number;
  onTime: number;
}

export interface EmployeePerformance {
  karyawan_id: string;
  nama: string;
  jabatan: string;
  totalDays: number;
  presentDays: number;
  lateDays: number;
  absentDays: number;
  attendanceRate: number;
  avgLateMinutes: number;
  totalBonus: number;
  totalDeduction: number;
}

export interface LateReason {
  reason: string;
  count: number;
  percentage: number;
}

export const analyticsService = {
  /**
   * Get today's overview stats
   */
  getTodayStats(logs: AttendanceLog[], karyawan: Karyawan[]): {
    present: number;
    late: number;
    absent: number;
    onTime: number;
  } {
    const today = new Date().toISOString().split('T')[0];
    const todayLogs = logs.filter((log) =>
      log.created_at.split('T')[0] === today
    );

    const presentIds = new Set(todayLogs.map((log) => log.karyawan_id));
    const lateCount = todayLogs.filter((log) =>
      log.status?.toLowerCase().includes('late')
    ).length;

    const onTimeCount = todayLogs.filter((log) =>
      log.status?.toLowerCase().includes('on time') ||
      log.status === 'MASUK'
    ).length;

    const absent = karyawan.length - presentIds.size;

    return {
      present: presentIds.size,
      late: lateCount,
      absent,
      onTime: onTimeCount,
    };
  },

  /**
   * Get monthly stats for a date range
   */
  getMonthlyStats(
    logs: AttendanceLog[],
    karyawan: Karyawan[],
    startDate: string,
    endDate: string
  ): {
    attendanceRate: number;
    avgLateMinutes: number;
    totalAbsentDays: number;
    totalLateCount: number;
  } {
    const filteredLogs = logs.filter((log) => {
      const logDate = log.created_at.split('T')[0];
      return logDate >= startDate && logDate <= endDate;
    });

    // Calculate attendance rate
    const uniqueDates = new Set(
      filteredLogs.map((log) => log.created_at.split('T')[0])
    );
    const workingDays = this.getWorkingDays(startDate, endDate);
    const presentDays = filteredLogs
      .filter((log) => log.tipe === 'MASUK')
      .length;
    const totalExpected = karyawan.length * workingDays;
    const attendanceRate =
      totalExpected > 0 ? (presentDays / totalExpected) * 100 : 0;

    // Calculate avg late minutes
    const lateLogs = filteredLogs.filter((log) =>
      log.status?.toLowerCase().includes('late')
    );
    const avgLateMinutes =
      lateLogs.length > 0
        ? lateLogs.reduce((sum, log) => {
            const minutes = this.extractMinutesFromStatus(log.status || '');
            return sum + minutes;
          }, 0) / lateLogs.length
        : 0;

    // Calculate absent days
    const totalAbsentDays = totalExpected - presentDays;
    const totalLateCount = lateLogs.length;

    return {
      attendanceRate: Math.round(attendanceRate * 10) / 10,
      avgLateMinutes: Math.round(avgLateMinutes),
      totalAbsentDays,
      totalLateCount,
    };
  },

  /**
   * Get daily stats for chart
   */
  getDailyStatsForChart(
    logs: AttendanceLog[],
    karyawan: Karyawan[],
    startDate: string,
    endDate: string
  ): DailyStats[] {
    const dailyMap = new Map<string, DailyStats>();

    // Initialize all days
    const currentDate = new Date(startDate);
    const end = new Date(endDate);
    while (currentDate <= end) {
      const dateStr = currentDate.toISOString().split('T')[0];
      dailyMap.set(dateStr, {
        date: dateStr,
        present: 0,
        late: 0,
        absent: 0,
        onTime: 0,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Fill with actual data
    logs.forEach((log) => {
      const dateStr = log.created_at.split('T')[0];
      if (dateStr >= startDate && dateStr <= endDate) {
        const stats = dailyMap.get(dateStr);
        if (stats) {
          if (log.tipe === 'MASUK') {
            stats.present++;
            if (log.status?.toLowerCase().includes('late')) {
              stats.late++;
            } else {
              stats.onTime++;
            }
          }
        }
      }
    });

    // Add absent count per day
    const workingDays = this.getWorkingDays(startDate, endDate);
    dailyMap.forEach((stats) => {
      stats.absent = karyawan.length - stats.present;
    });

    return Array.from(dailyMap.values());
  },

  /**
   * Get late reasons distribution
   */
  getLateReasons(logs: AttendanceLog[]): LateReason[] {
    const lateLogs = logs.filter((log) =>
      log.status?.toLowerCase().includes('late')
    );

    // For now, mock data - in real app would extract from status or notes
    const totalLate = lateLogs.length;
    if (totalLate === 0) {
      return [];
    }

    const reasons: LateReason[] = [
      {
        reason: 'traffic',
        count: Math.floor(totalLate * 0.4),
        percentage: 40,
      },
      {
        reason: 'overslept',
        count: Math.floor(totalLate * 0.35),
        percentage: 35,
      },
      {
        reason: 'otherReasons',
        count: Math.ceil(totalLate * 0.25),
        percentage: 25,
      },
    ];

    return reasons;
  },

  /**
   * Get top performers
   */
  getTopPerformers(
    logs: AttendanceLog[],
    karyawan: Karyawan[],
    limit: number = 5
  ): EmployeePerformance[] {
    const performances: EmployeePerformance[] = karyawan.map((emp) => {
      const empLogs = logs.filter((log) => log.karyawan_id === emp.id);
      const presentDays = empLogs.filter((log) => log.tipe === 'MASUK').length;
      const lateDays = empLogs.filter((log) =>
        log.status?.toLowerCase().includes('late')
      ).length;
      const totalDays = Math.max(presentDays + lateDays, 1);

      const attendanceRate = (presentDays / totalDays) * 100;
      const avgLateMinutes =
        lateDays > 0
          ? empLogs
              .filter((log) => log.status?.toLowerCase().includes('late'))
              .reduce((sum, log) => {
                const minutes = this.extractMinutesFromStatus(log.status || '');
                return sum + minutes;
              }, 0) / lateDays
          : 0;

      return {
        karyawan_id: emp.id,
        nama: emp.nama,
        jabatan: emp.jabatan,
        totalDays,
        presentDays,
        lateDays,
        absentDays: 0,
        attendanceRate: Math.round(attendanceRate * 10) / 10,
        avgLateMinutes: Math.round(avgLateMinutes),
        totalBonus: presentDays * 50000, // Mock: Rp 50k per day
        totalDeduction: lateDays * 10000, // Mock: Rp 10k per late
      };
    });

    // Sort by attendance rate (descending)
    return performances
      .sort((a, b) => b.attendanceRate - a.attendanceRate)
      .slice(0, limit);
  },

  /**
   * Get individual employee stats
   */
  getEmployeeStats(
    logs: AttendanceLog[],
    employee: Karyawan,
    startDate: string,
    endDate: string
  ): EmployeePerformance {
    const empLogs = logs.filter(
      (log) =>
        log.karyawan_id === employee.id &&
        log.created_at.split('T')[0] >= startDate &&
        log.created_at.split('T')[0] <= endDate
    );

    const presentDays = empLogs.filter((log) => log.tipe === 'MASUK').length;
    const lateDays = empLogs.filter((log) =>
      log.status?.toLowerCase().includes('late')
    ).length;
    const totalDays = this.getWorkingDays(startDate, endDate);
    const absentDays = totalDays - presentDays - lateDays;

    const attendanceRate = (presentDays / totalDays) * 100;
    const avgLateMinutes =
      lateDays > 0
        ? empLogs
            .filter((log) => log.status?.toLowerCase().includes('late'))
            .reduce((sum, log) => {
              const minutes = this.extractMinutesFromStatus(log.status || '');
              return sum + minutes;
            }, 0) / lateDays
        : 0;

    return {
      karyawan_id: employee.id,
      nama: employee.nama,
      jabatan: employee.jabatan,
      totalDays,
      presentDays,
      lateDays,
      absentDays,
      attendanceRate: Math.round(attendanceRate * 10) / 10,
      avgLateMinutes: Math.round(avgLateMinutes),
      totalBonus: presentDays * 50000,
      totalDeduction: lateDays * 10000 + absentDays * 100000,
    };
  },

  extractMinutesFromStatus(status: string): number {
    const match = status.match(/(\d+)\s*min/i);
    return match ? parseInt(match[1]) : 0;
  },

  getWorkingDays(startDate: string, endDate: string): number {
    let count = 0;
    const currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      const dayOfWeek = currentDate.getDay();
      // 0 = Sunday, 6 = Saturday
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return count;
  },

  /**
   * Helper: Get date range suggestions
   */
  getDateRangeOptions() {
    const today = new Date();
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)
      .toISOString()
      .split('T')[0];
    const thisMonthEnd = today.toISOString().split('T')[0];

    const lastMonthStart = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    )
      .toISOString()
      .split('T')[0];
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0)
      .toISOString()
      .split('T')[0];

    const thisYearStart = new Date(today.getFullYear(), 0, 1)
      .toISOString()
      .split('T')[0];
    const thisYearEnd = today.toISOString().split('T')[0];

    return {
      thisMonth: { start: thisMonthStart, end: thisMonthEnd, label: 'This Month' },
      lastMonth: { start: lastMonthStart, end: lastMonthEnd, label: 'Last Month' },
      thisYear: { start: thisYearStart, end: thisYearEnd, label: 'This Year' },
    };
  },
};

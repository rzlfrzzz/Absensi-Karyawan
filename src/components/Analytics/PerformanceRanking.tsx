import React from 'react';
import { EmployeePerformance } from '../../services/analyticsService';
import { LanguageCode } from '../../types';
import { translations } from '../../constants/translations';

interface PerformanceRankingProps {
  data: EmployeePerformance[];
  lang: LanguageCode;
}

export const PerformanceRanking: React.FC<PerformanceRankingProps> = ({
  data,
  lang,
}) => {
  const trans = translations[lang];

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-100 text-center">
        <p className="text-slate-500 font-bold">{trans.noData}</p>
      </div>
    );
  }

  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '📍';
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-50 border-yellow-200';
      case 2:
        return 'bg-slate-50 border-slate-200';
      case 3:
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-white border-slate-100';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100">
      <h3 className="text-lg font-black text-slate-900 mb-4">
        🏆 {trans.topPerformers}
      </h3>

      <div className="space-y-3">
        {data.map((perf, index) => (
          <div
            key={perf.karyawan_id}
            className={`${getRankColor(
              index + 1
            )} border rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-all`}
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="text-3xl font-black w-12 text-center">
                {getMedalIcon(index + 1)}
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-900">{perf.nama}</p>
                <p className="text-xs text-slate-500">{perf.jabatan}</p>
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-indigo-600">
                  {perf.attendanceRate.toFixed(1)}%
                </span>
                <span className="text-xs font-bold text-slate-400 uppercase">
                  {trans.attendancePercent}
                </span>
              </div>
              <div className="text-xs font-bold text-slate-500">
                {trans.presentEmployees}: {perf.presentDays}/{perf.totalDays}{' '}
                {trans.lateArrivals}: {perf.lateDays}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

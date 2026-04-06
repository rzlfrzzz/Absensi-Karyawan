import React from 'react';
import { LanguageCode } from '../../types';
import { translations } from '../../constants/translations';

interface StatisticsCardsProps {
  attendanceRate: number;
  avgLateMinutes: number;
  totalAbsentDays: number;
  totalLateCount: number;
  lang: LanguageCode;
}

export const StatisticsCards: React.FC<StatisticsCardsProps> = ({
  attendanceRate,
  avgLateMinutes,
  totalAbsentDays,
  totalLateCount,
  lang,
}) => {
  const trans = translations[lang];

  const stats = [
    {
      label: trans.attendanceRate,
      value: `${attendanceRate.toFixed(1)}%`,
      icon: '📊',
      color: 'bg-indigo-50 border-indigo-200',
      textColor: 'text-indigo-700',
    },
    {
      label: trans.avgLateMinutes,
      value: `${avgLateMinutes} min`,
      icon: '⏱️',
      color: 'bg-orange-50 border-orange-200',
      textColor: 'text-orange-700',
    },
    {
      label: trans.totalAbsent,
      value: totalAbsentDays,
      icon: '❌',
      color: 'bg-red-50 border-red-200',
      textColor: 'text-red-700',
    },
    {
      label: trans.lateArrivals,
      value: totalLateCount,
      icon: '⏰',
      color: 'bg-amber-50 border-amber-200',
      textColor: 'text-amber-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`${stat.color} border rounded-2xl p-6 hover:shadow-lg transition-all`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                {stat.label}
              </p>
              <p className={`text-2xl font-black ${stat.textColor}`}>
                {stat.value}
              </p>
            </div>
            <div className="text-3xl">{stat.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

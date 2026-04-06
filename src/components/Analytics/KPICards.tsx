import React from 'react';
import { LanguageCode } from '../../types';
import { translations } from '../../constants/translations';

interface KPICardsProps {
  present: number;
  late: number;
  absent: number;
  onTime: number;
  lang: LanguageCode;
}

export const KPICards: React.FC<KPICardsProps> = ({
  present,
  late,
  absent,
  onTime,
  lang,
}) => {
  const trans = translations[lang];

  const cards = [
    {
      label: trans.presentEmployees,
      value: present,
      icon: '✅',
      color: 'bg-green-50 border-green-200',
      textColor: 'text-green-700',
      badgeColor: 'bg-green-100',
    },
    {
      label: trans.lateArrivals,
      value: late,
      icon: '⏰',
      color: 'bg-amber-50 border-amber-200',
      textColor: 'text-amber-700',
      badgeColor: 'bg-amber-100',
    },
    {
      label: trans.absentEmployees,
      value: absent,
      icon: '❌',
      color: 'bg-red-50 border-red-200',
      textColor: 'text-red-700',
      badgeColor: 'bg-red-100',
    },
    {
      label: trans.onTimeCount,
      value: onTime,
      icon: '🎯',
      color: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-700',
      badgeColor: 'bg-blue-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.color} border rounded-2xl p-6 hover:shadow-lg transition-all`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                {card.label}
              </p>
              <p className={`text-3xl font-black ${card.textColor}`}>
                {card.value}
              </p>
            </div>
            <div
              className={`${card.badgeColor} w-16 h-16 rounded-2xl flex items-center justify-center text-3xl`}
            >
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { LateReasonChartData } from '../../services/chartService';
import { LanguageCode } from '../../types';
import { translations } from '../../constants/translations';
import { chartService } from '../../services/chartService';

interface LateReasonsChartProps {
  data: LateReasonChartData[];
  lang: LanguageCode;
}

export const LateReasonsChart: React.FC<LateReasonsChartProps> = ({
  data,
  lang,
}) => {
  const trans = translations[lang];
  const colors = chartService.getChartColors();

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-100 text-center">
        <p className="text-slate-500 font-bold">{trans.noData}</p>
      </div>
    );
  }

  const COLORS = [
    colors.present,
    colors.late,
    colors.absent,
    colors.primary,
    colors.secondary,
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100">
      <h3 className="text-lg font-black text-slate-900 mb-4">
        📊 {trans.lateReasons}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name }) => `${name}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

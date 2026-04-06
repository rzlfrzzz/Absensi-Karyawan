import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartDataPoint } from '../../services/chartService';
import { LanguageCode } from '../../types';
import { translations } from '../../constants/translations';
import { chartService } from '../../services/chartService';

interface AttendanceChartProps {
  data: ChartDataPoint[];
  lang: LanguageCode;
}

export const AttendanceChart: React.FC<AttendanceChartProps> = ({
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

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100">
      <h3 className="text-lg font-black text-slate-900 mb-4">
        📈 {trans.attendanceTrend}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="date"
            stroke="#94a3b8"
            style={{ fontSize: '12px' }}
          />
          <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="present"
            stroke={colors.present}
            strokeWidth={2}
            dot={{ fill: colors.present, r: 4 }}
            activeDot={{ r: 6 }}
            name={trans.presentEmployees}
          />
          <Line
            type="monotone"
            dataKey="late"
            stroke={colors.late}
            strokeWidth={2}
            dot={{ fill: colors.late, r: 4 }}
            activeDot={{ r: 6 }}
            name={trans.lateArrivals}
          />
          <Line
            type="monotone"
            dataKey="onTime"
            stroke={colors.onTime}
            strokeWidth={2}
            dot={{ fill: colors.onTime, r: 4 }}
            activeDot={{ r: 6 }}
            name={trans.onTimeCount}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

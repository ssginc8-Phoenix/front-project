import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import dayjs from 'dayjs';
import { useAppointmentStats } from '~/features/hospitals/hooks/hospitalAdmin/useAppointmentStats';
import localeData from 'dayjs/plugin/localeData';
import 'dayjs/locale/ko';
dayjs.extend(localeData);
dayjs.locale('ko');

const HospitalChart = () => {
  const [startDate, setStartDate] = useState(dayjs().startOf('month').format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(dayjs().endOf('month').format('YYYY-MM-DD'));

  const { data: appointmentStats = [], loading } = useAppointmentStats(startDate, endDate);
  const barSize = 20;
  const barGap = 40;
  const chartWidth = appointmentStats.length * (barSize + barGap) + 100;
  return (
    <div className="w-full flex flex-col gap-4">
      {/* 날짜 선택 영역 */}
      <div className="flex gap-4">
        <label className="flex items-center gap-2 font-semibold">
          시작일:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </label>
        <label className="flex items-center gap-2 font-semibold">
          종료일:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </label>
      </div>

      {/* 차트 영역 */}
      <div className="w-full">
        <h2 className="text-xl font-bold mb-4">일일 진료 건수</h2>
        {loading ? (
          <p>📊 데이터를 불러오는 중입니다...</p>
        ) : (
          <div>
            <div style={{ width: chartWidth, minWidth: '100%' }}>
              <BarChart
                width={chartWidth}
                height={300}
                data={appointmentStats}
                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
              >
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  interval={0}
                  axisLine={{ stroke: '#ccc' }}
                  tickLine={false}
                  tickFormatter={(value) => {
                    const d = dayjs(value);
                    return `${d.format('M/D')} (${d.format('dd')})`; // 예: 6/12 (수)
                  }}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  axisLine={{ stroke: '#ccc' }}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#f4f4f4', borderRadius: 8, border: 'none' }}
                  labelStyle={{ fontWeight: 'bold' }}
                  formatter={(value: any) => [`${value}건`, '진료 수']}
                  labelFormatter={(label) => `📅 ${label}`}
                />
                <Bar dataKey="count" fill="#4e73df" radius={[8, 8, 0, 0]} barSize={barSize} />
              </BarChart>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalChart;

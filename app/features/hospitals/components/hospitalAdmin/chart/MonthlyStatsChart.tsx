import React, { useState } from 'react';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import 'dayjs/locale/ko';
import { useAppointmentStats } from '~/features/hospitals/hooks/hospitalAdmin/useAppointmentStats';

dayjs.extend(localeData);
dayjs.locale('ko');

const Container = styled.div`
  width: 100%;
  background: #fff;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #00499e;
  margin-bottom: 1rem;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;

  & input {
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
  }
`;

const MonthlyStatsChart: React.FC = () => {
  // 기본으로 6개월 전부터 이번 달까지 선택
  const [startMonth, setStartMonth] = useState(dayjs().subtract(5, 'month').format('YYYY-MM'));
  const [endMonth, setEndMonth] = useState(dayjs().format('YYYY-MM'));

  const startDate = dayjs(startMonth + '-01').format('YYYY-MM-DD');
  const endDate = dayjs(endMonth + '-01')
    .endOf('month')
    .format('YYYY-MM-DD');

  // 일별 진료 데이터를 해당 기간만큼 가져옴
  const { data: stats = [], loading } = useAppointmentStats(startDate, endDate);

  // 일별 데이터를 월별 합계로 집계
  const monthlyMap: Record<string, number> = {};
  stats.forEach(({ date, count }) => {
    const m = dayjs(date).format('YYYY-MM');
    monthlyMap[m] = (monthlyMap[m] || 0) + count;
  });
  const chartData = Object.entries(monthlyMap)
    .map(([month, value]) => ({ month, value }))
    .sort((a, b) => (a.month > b.month ? 1 : -1));

  return (
    <Container>
      <Title>월별 진료 통계</Title>
      <Controls>
        <label>
          시작 월:
          <input type="month" value={startMonth} onChange={(e) => setStartMonth(e.target.value)} />
        </label>
        <label>
          종료 월:
          <input type="month" value={endMonth} onChange={(e) => setEndMonth(e.target.value)} />
        </label>
      </Controls>

      {loading ? (
        <p>📊 데이터를 불러오는 중입니다...</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <XAxis
              dataKey="month"
              tickFormatter={(val) => dayjs(val + '-01').format('YYYY년 M월')}
              tick={{ fontSize: 12, fill: '#555' }}
              axisLine={{ stroke: '#ccc' }}
              tickLine={false}
            />
            <YAxis
              dataKey="value"
              tick={{ fontSize: 12, fill: '#555' }}
              axisLine={{ stroke: '#ccc' }}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              formatter={(val) => [`${val}건`, '진료 수']}
              labelFormatter={(label) => `📅 ${label}`}
              contentStyle={{
                backgroundColor: '#fff',
                borderRadius: 8,
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              }}
              labelStyle={{ fontWeight: 'bold', color: '#333' }}
            />
            <Bar dataKey="value" fill="#4e73df" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Container>
  );
};

export default MonthlyStatsChart;

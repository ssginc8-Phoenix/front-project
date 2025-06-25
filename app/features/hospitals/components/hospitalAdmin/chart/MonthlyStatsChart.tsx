import React, { useState } from 'react';
import styled from 'styled-components';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import 'dayjs/locale/ko';
import { useAppointmentStats } from '~/features/hospitals/hooks/hospitalAdmin/useAppointmentStats';

dayjs.extend(localeData);
dayjs.locale('ko');

const Container = styled.div`
  width: 100%;
  background: #fff;
  padding: 1rem;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  padding-left: 3rem;
  font-weight: 600;
  color: #00499e;
  margin-bottom: 6rem;
`;

const ToggleContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const ToggleButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border: 2px solid #4e73df;
  border-radius: 9999px;
  background: ${({ active }) => (active ? '#4e73df' : '#fff')};
  color: ${({ active }) => (active ? '#fff' : '#4e73df')};
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;
  &:hover {
    background: #4e73df;
    color: #fff;
  }
`;

const ChartWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export const MonthlyHalfChart: React.FC = () => {
  const [half, setHalf] = useState<'first' | 'second'>('first');
  const year = dayjs().year();

  const startMonth = half === 'first' ? `${year}-01` : `${year}-07`;
  const endMonth = half === 'first' ? `${year}-06` : `${year}-12`;

  const startDate = dayjs(`${startMonth}-01`).format('YYYY-MM-DD');
  const endDate = dayjs(`${endMonth}-01`).endOf('month').format('YYYY-MM-DD');

  const { data: stats = [], loading } = useAppointmentStats(startDate, endDate);

  // 일별 → 월별 집계
  const monthlyMap: Record<string, number> = {};
  stats.forEach(({ date, count }) => {
    const m = dayjs(date).format('YYYY-MM');
    monthlyMap[m] = (monthlyMap[m] || 0) + count;
  });

  // 해당 반기의 모든 달 리스트
  const months: string[] = [];
  for (
    let cursor = dayjs(`${startMonth}-01`);
    !cursor.isAfter(dayjs(`${endMonth}-01`).endOf('month'));
    cursor = cursor.add(1, 'month')
  ) {
    months.push(cursor.format('YYYY-MM'));
  }

  const chartData = months.map((m) => ({
    month: m,
    value: monthlyMap[m] || 0,
  }));

  // 간격 & 크기 조절
  const barSize = 35;
  const barGap = 40;

  return (
    <Container>
      <Title>월별 진료 통계 ({half === 'first' ? '상반기' : '하반기'})</Title>

      <ToggleContainer>
        <ToggleButton active={half === 'first'} onClick={() => setHalf('first')}>
          상반기 (1~6월)
        </ToggleButton>
        <ToggleButton active={half === 'second'} onClick={() => setHalf('second')}>
          하반기 (7~12월)
        </ToggleButton>
      </ToggleContainer>

      {loading ? (
        <p>📊 데이터를 불러오는 중입니다...</p>
      ) : (
        <ChartWrapper>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 20, left: 20, bottom: 10 }}
              barGap={barGap}
              barCategoryGap="30%"
            >
              <XAxis
                dataKey="month"
                interval={0}
                tickFormatter={(val) => dayjs(`${val}-01`).format('M월')}
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
                formatter={(v) => [`${v}건`, '진료 수']}
                labelFormatter={(label) => `📅 ${label}`}
                contentStyle={{
                  backgroundColor: '#fff',
                  borderRadius: 8,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                }}
                labelStyle={{ fontWeight: 'bold', color: '#333' }}
              />
              <Bar dataKey="value" fill="#4e73df" radius={[6, 6, 0, 0]} barSize={barSize} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      )}
    </Container>
  );
};

export default MonthlyHalfChart;

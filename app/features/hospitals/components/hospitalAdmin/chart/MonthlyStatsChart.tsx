// MonthlyHalfChart.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import 'dayjs/locale/ko';
import isoWeek from 'dayjs/plugin/isoWeek';
import { useAppointmentStats } from '~/features/hospitals/hooks/hospitalAdmin/useAppointmentStats';
import { useMediaQuery } from '~/features/hospitals/hooks/useMediaQuery';
import { breakpoints, media } from '~/features/hospitals/components/common/breakpoints';

dayjs.extend(localeData);
dayjs.extend(isoWeek);
dayjs.locale('ko');

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: #fff;
  padding: 1rem;

  ${media('mobile')`
    padding: 0.75rem;
  `}
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #00499e;
  margin-bottom: 1rem;

  ${media('mobile')`
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
  `}
`;

const ToggleContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;

  ${media('mobile')`
    gap: 0.5rem;
    margin-bottom: 1rem;
  `}
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

  ${media('mobile')`
    padding: 0.4rem 1rem;
    font-size: 0.9rem;
  `}
`;

const ChartWrapper = styled.div`
  width: 100%;
  height: 400px;

  ${media('tablet')`
    height: 320px;
  `}
  ${media('mobile')`
    height: 350px;
  `}
`;

export const MonthlyHalfChart: React.FC = () => {
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.mobile}px)`);
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

  // 모바일/데스크탑 각각 바 크기·간격 설정
  const barSize = isMobile ? 20 : 35;
  const barGap = isMobile ? 20 : 40;

  return (
    <Container>
      <Title>월별 진료 통계</Title>

      <ToggleContainer>
        <ToggleButton active={half === 'first'} onClick={() => setHalf('first')}>
          상반기 1~6월
        </ToggleButton>
        <ToggleButton active={half === 'second'} onClick={() => setHalf('second')}>
          하반기 7~12월
        </ToggleButton>
      </ToggleContainer>

      {loading ? (
        <p>📊 데이터를 불러오는 중입니다...</p>
      ) : (
        <ChartWrapper>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 16, right: 16, left: 16, bottom: 16 }}
              barGap={barGap}
            >
              <XAxis
                dataKey="month"
                interval={0}
                tickFormatter={(m) => dayjs(`${m}-01`).format('M월')}
                tick={{ fontSize: isMobile ? 10 : 12, fill: '#555' }}
                axisLine={{ stroke: '#ddd' }}
                tickLine={false}
              />
              <YAxis
                dataKey="value"
                tick={{ fontSize: isMobile ? 10 : 12, fill: '#555' }}
                axisLine={{ stroke: '#ddd' }}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                formatter={(v) => [`${v}건`, '진료 수']}
                labelFormatter={(l) => `📅 ${l}`}
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

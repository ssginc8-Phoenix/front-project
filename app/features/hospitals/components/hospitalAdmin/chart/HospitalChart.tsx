import React, { useState } from 'react';
import styled from 'styled-components';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import 'dayjs/locale/ko';
import isoWeek from 'dayjs/plugin/isoWeek';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppointmentStats } from '~/features/hospitals/hooks/hospitalAdmin/useAppointmentStats';
import { useMediaQuery } from '~/features/hospitals/hooks/useMediaQuery';

dayjs.extend(localeData);
dayjs.extend(isoWeek);
dayjs.locale('ko');

const Container = styled.div`
  width: 100%;
  padding: 0.5rem;
  background: #fff;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #00499e;
  margin-bottom: 1rem;
  @media (max-width: 480px) {
    text-align: center;
  }
`;

const Nav = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const NavButton = styled.button<{ disabled?: boolean }>`
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ disabled }) =>
    disabled
      ? 'linear-gradient(135deg,#E0E0E0,#CCCCCC)'
      : 'linear-gradient(135deg,#4e73df,#224abe)'};
  border: none;
  border-radius: 50%;
  color: #fff;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: transform 0.2s;
  &:hover {
    transform: ${({ disabled }) => (disabled ? 'none' : 'scale(1.1)')};
  }
`;

const ChartWrapper = styled.div`
  width: 100%;
  height: 350px;

  @media (max-width: 768px) {
    height: 240px;
  }
`;

interface StatItem {
  date: string; // "YYYY-MM-DD"
  display: string; // "M/D"
  count: number;
}

const HospitalChart: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [weekStart, setWeekStart] = useState(() => dayjs().startOf('isoWeek'));
  const weekEnd = weekStart.endOf('isoWeek');

  const startDate = weekStart.format('YYYY-MM-DD');
  const endDate = weekEnd.format('YYYY-MM-DD');

  const { data: rawStats = [], loading } = useAppointmentStats(startDate, endDate);

  const rawMap = new Map<string, number>();
  rawStats.forEach(({ date, count }) => rawMap.set(date, count));

  const fullStats: StatItem[] = [];
  for (let d = weekStart.clone(); !d.isAfter(weekEnd); d = d.add(1, 'day')) {
    const iso = d.format('YYYY-MM-DD');
    fullStats.push({ date: iso, display: d.format('M/D'), count: rawMap.get(iso) ?? 0 });
  }

  const prevWeek = () => setWeekStart((p) => p.subtract(1, 'week'));
  const nextWeek = () => setWeekStart((p) => p.add(1, 'week'));

  // 차트 설정
  const xTickAngle = isMobile ? -45 : 0;
  const xHeight = isMobile ? 60 : 30;
  const marginBtm = isMobile ? 50 : 20;
  const barSz = isMobile ? 12 : 20;

  return (
    <Container>
      {/* 모바일에선 날짜 범위 숨기기 */}
      <Title>{isMobile ? '주간 진료 건수' : `주간 진료 건수 (${startDate} ~ ${endDate})`}</Title>

      <Nav>
        <NavButton onClick={prevWeek}>
          <ChevronLeft size={16} />
        </NavButton>

        <span>
          {weekStart.format('M/D')} ~ {weekEnd.format('M/D')}
        </span>
        <NavButton onClick={nextWeek}>
          <ChevronRight size={16} />
        </NavButton>
      </Nav>

      {loading ? (
        <p>📊 데이터를 불러오는 중입니다...</p>
      ) : (
        <ChartWrapper>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={fullStats} margin={{ top: 16, right: 16, left: 16, bottom: marginBtm }}>
              <XAxis
                dataKey="date"
                height={xHeight}
                tick={{
                  fontSize: 12,
                  fill: '#555',
                  angle: xTickAngle,
                  textAnchor: isMobile ? 'end' : 'middle',
                }}
                interval={0}
                axisLine={{ stroke: '#ddd' }}
                tickFormatter={(iso) => {
                  const d = dayjs(iso);
                  return `${d.format('M/D')}(${d.format('dd')})`;
                }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#555' }}
                axisLine={{ stroke: '#ddd' }}
                allowDecimals={false}
              />
              <Tooltip
                formatter={(v: number) => [`${v}건`, '진료 수']}
                labelFormatter={(l) => `📅 ${dayjs(l).format('YYYY-MM-DD')}`}
                contentStyle={{
                  backgroundColor: '#fff',
                  borderRadius: 8,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                }}
                labelStyle={{ fontWeight: 'bold', color: '#333' }}
              />
              <Bar dataKey="count" fill="#4e73df" radius={[4, 4, 0, 0]} barSize={barSz} />
            </BarChart>
          </ResponsiveContainer>
        </ChartWrapper>
      )}
    </Container>
  );
};

export default HospitalChart;

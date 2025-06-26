import React, { useState } from 'react';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import 'dayjs/locale/ko';
import isoWeek from 'dayjs/plugin/isoWeek';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppointmentStats } from '~/features/hospitals/hooks/hospitalAdmin/useAppointmentStats';

dayjs.extend(localeData);
dayjs.extend(isoWeek);
dayjs.locale('ko');

// — styled-components 정의 시작 —
const Container = styled.div`
  width: 100%;
  padding: 1rem;
  background: #fff;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #00499e;
  margin-bottom: 1rem;
`;

const Nav = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const NavButton = styled.button<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ disabled }) => (disabled ? '#AAA' : '#FFF')};
  background: ${({ disabled }) =>
    disabled
      ? 'linear-gradient(135deg, #E0E0E0, #CCCCCC)'
      : 'linear-gradient(135deg, #4e73df, #224abe)'};
  border: none;
  border-radius: 9999px;
  box-shadow: ${({ disabled }) => (disabled ? 'none' : '0 6px 12px rgba(34, 74, 190, 0.2)')};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  &:hover {
    transform: ${({ disabled }) => (disabled ? 'none' : 'scale(1.05)')};
    box-shadow: ${({ disabled }) => (disabled ? 'none' : '0 8px 16px rgba(34, 74, 190, 0.3)')};
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(34, 74, 190, 0.3);
  }
`;
// — styled-components 정의 끝 —

interface StatItem {
  date: string; // "YYYY-MM-DD"
  display: string; // "MM/DD"
  count: number;
}

const HospitalChart: React.FC = () => {
  // 1) 주간 범위 계산 (월요일~일요일)
  const [weekStart, setWeekStart] = useState(() => dayjs().startOf('isoWeek'));
  const weekEnd = weekStart.endOf('isoWeek');

  const startDate = weekStart.format('YYYY-MM-DD');
  const endDate = weekEnd.format('YYYY-MM-DD');

  // 2) useAppointmentStats 훅에서 dateIso, display, count 가져오기
  const { data: rawStats = [], loading } = useAppointmentStats(startDate, endDate);

  // 3) rawStats를 Map으로 변환 (key: dateIso → count)
  const rawMap = new Map<string, number>();
  rawStats.forEach(({ date, count }) => {
    rawMap.set(date, count);
  });

  // 4) 빈 날을 0으로 채워 fullStats 생성
  const fullStats: StatItem[] = [];
  for (let d = weekStart.clone(); !d.isAfter(weekEnd); d = d.add(1, 'day')) {
    const iso = d.format('YYYY-MM-DD');
    fullStats.push({
      date: iso,
      display: d.format('M/D'),
      count: rawMap.get(iso) ?? 0,
    });
  }

  // 5) 차트 너비 계산
  const barSize = 20;
  const barGap = 60;
  const chartWidth = fullStats.length * (barSize + barGap) + 100;

  // 6) 이전/다음 주 핸들러
  const prevWeek = () => setWeekStart((prev) => prev.subtract(1, 'week'));
  const nextWeek = () => setWeekStart((prev) => prev.add(1, 'week'));

  return (
    <Container>
      <Title>
        주간 진료 건수 ({startDate} ~ {endDate})
      </Title>

      <Nav>
        <NavButton onClick={prevWeek}>
          <ChevronLeft size={16} /> 이전 주
        </NavButton>

        <span>
          {weekStart.format('M/D')} ~ {weekEnd.format('M/D')}
        </span>

        <NavButton onClick={nextWeek}>
          다음 주 <ChevronRight size={16} />
        </NavButton>
      </Nav>

      {loading ? (
        <p>📊 데이터를 불러오는 중입니다...</p>
      ) : (
        <div style={{ width: chartWidth, minWidth: '100%' }}>
          <BarChart
            width={chartWidth}
            height={300}
            data={fullStats}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: '#555' }}
              interval={0}
              axisLine={{ stroke: '#ddd' }}
              tickFormatter={(iso) => {
                const d = dayjs(iso as string);
                return `${d.format('M/D')}(${d.format('dd')})`;
              }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#555' }}
              axisLine={{ stroke: '#ddd' }}
              allowDecimals={false}
            />
            <Tooltip
              formatter={(val: number) => [`${val}건`, '진료 수']}
              labelFormatter={(label: string) => `📅 ${dayjs(label).format('YYYY-MM-DD')}`}
              contentStyle={{
                backgroundColor: '#fff',
                borderRadius: 8,
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              }}
              labelStyle={{ fontWeight: 'bold', color: '#333' }}
            />
            <Bar dataKey="count" fill="#4e73df" radius={[6, 6, 0, 0]} barSize={barSize} />
          </BarChart>
        </div>
      )}
    </Container>
  );
};

export default HospitalChart;

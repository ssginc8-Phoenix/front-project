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
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
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

const HospitalChart = () => {
  const [weekStart, setWeekStart] = useState(() => dayjs().startOf('isoWeek'));
  const weekEnd = weekStart.endOf('isoWeek');
  const startDate = weekStart.format('YYYY-MM-DD');
  const endDate = weekEnd.format('YYYY-MM-DD');
  const { data: appointmentStats = [], loading } = useAppointmentStats(startDate, endDate);

  const barSize = 20;
  const barGap = 40;
  const chartWidth = appointmentStats.length * (barSize + barGap) + 100;

  const prevWeek = () => setWeekStart((prev) => prev.subtract(1, 'week'));
  const nextWeek = () => setWeekStart((prev) => prev.add(1, 'week'));
  const isNextDisabled = weekStart.isSame(dayjs().startOf('isoWeek'));

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

        <NavButton onClick={nextWeek} disabled={isNextDisabled}>
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
            data={appointmentStats}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: '#555' }}
              interval={0}
              axisLine={{ stroke: '#ddd' }}
              tickFormatter={(v) => {
                const d = dayjs(v);
                return `${d.format('M/D')}(${d.format('dd')})`;
              }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#555' }}
              axisLine={{ stroke: '#ddd' }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                borderRadius: 8,
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              }}
              labelStyle={{ fontWeight: 'bold', color: '#333' }}
              formatter={(val: any) => [`${val}건`, '진료 수']}
              labelFormatter={(label) => `📅 ${label}`}
            />
            <Bar dataKey="count" fill="#4e73df" radius={[6, 6, 0, 0]} barSize={barSize} />
          </BarChart>
        </div>
      )}
    </Container>
  );
};

export default HospitalChart;

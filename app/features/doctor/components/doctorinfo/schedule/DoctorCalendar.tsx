import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

import { startOfMonth, endOfMonth, format } from 'date-fns';
import { useDoctorCalendar } from '~/features/doctor/hooks/useDoctorCalendar';

const Wrapper = styled.div`
  padding: 2rem;
  background-color: #f9f9f9;
  min-height: 100vh;
`;

const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: bold;
  color: #1f2937;
`;

const Legend = styled.ul`
  display: flex;
  gap: 1rem;
  list-style: none;
  margin-top: 1rem;

  li {
    display: flex;
    align-items: center;
    font-size: 0.9rem;

    span {
      width: 12px;
      height: 12px;
      display: inline-block;
      border-radius: 4px;
      margin-right: 0.5rem;
    }
  }
`;

const eventColorMap: Record<string, string> = {
  일반진료: '#3478f6',
  비대면진료: '#f8a3d5',
  항암치료: '#f0db4f',
  유방암: '#d1f5c2',
  방사선: '#ffe9a0',
};

const DoctorCalendar = () => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const { data, isLoading } = useDoctorCalendar({
    startDate: format(startOfMonth(currentDate), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(currentDate), 'yyyy-MM-dd'),
  });

  const events =
    data?.appointments.map((app) => ({
      title: `${app.type} 진료입니다.`,
      date: app.date,
      backgroundColor: eventColorMap[app.type] || '#ccc',
      borderColor: 'transparent',
    })) || [];

  return (
    <Wrapper>
      <CalendarHeader>
        <Title>📅 캘린더</Title>
      </CalendarHeader>

      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="auto"
        locale="ko"
        datesSet={(arg) => setCurrentDate(arg.start)}
      />

      <Legend>
        {Object.entries(eventColorMap).map(([type, color]) => (
          <li key={type}>
            <span style={{ backgroundColor: color }} />
            {type}
          </li>
        ))}
      </Legend>
    </Wrapper>
  );
};

export default DoctorCalendar;

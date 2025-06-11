import React, { useState } from 'react';
import styled from 'styled-components';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

import { startOfMonth, endOfMonth, format } from 'date-fns';
import HospitalSidebarMenu from '~/features/hospitals/components/hospitalAdmin/HospitalSidebarMenu';
import { doctorSidebarItems } from '~/features/doctor/components/constants/doctorSidebarItems';
import { useNavigate } from 'react-router';
import { useDoctorCalendar } from '~/features/doctor/hooks/useDoctorCalendar';

const PageWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  display: flex;
  gap: 48px;
  background-color: #f8f9fa;
  min-height: 100vh;
`;

const MainSection = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.h2`
  font-size: 2.2rem;
  font-weight: 700;
  color: #00499e;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

const SidebarBox = styled.div`
  width: 200px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 32px 0 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: flex-start;
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

const DoctorCalendarPage = () => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const navigate = useNavigate();

  const { data } = useDoctorCalendar({
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

  const handleSidebarChange = (key: string) => {
    const targetPath = `/doctors/${key}`;
    if (window.location.pathname === targetPath) {
      navigate(0);
    } else {
      navigate(targetPath);
    }
  };

  return (
    <PageWrapper>
      <SidebarBox>
        <HospitalSidebarMenu
          items={doctorSidebarItems}
          activeKey="schedule"
          onChange={handleSidebarChange}
        />
      </SidebarBox>

      <MainSection>
        <Title>📅 의사 캘린더</Title>
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
      </MainSection>
    </PageWrapper>
  );
};

export default DoctorCalendarPage;

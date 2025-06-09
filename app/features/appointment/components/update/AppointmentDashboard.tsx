import LoadingIndicator from '~/components/common/LoadingIndicator';
import ErrorMessage from '~/components/common/ErrorMessage';
import { useAppointmentDashboard } from '~/features/appointment/hooks/useAppointmentList';
import styled from 'styled-components';
import type { AppointmentList } from '~/types/appointment';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import DashboardCard from '~/features/appointment/components/update/DashboardCard';
import AppointmentUpdateModal from '~/features/appointment/components/update/UpdateModal';

const DashboardWrapper = styled.div`
  background-color: #ffffff;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 20px;
  max-width: 100%;
`;

const HospitalTitle = styled.h1`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  color: #003366; // 예시 색상
  margin: 0;
`;

const DatePickerWrapper = styled.div`
  margin-bottom: 20px;
`;

const SectionWrapper = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
`;

const Section = styled.div`
  flex: 1;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
`;

const AppointmentDashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);

  // format YYYY-MM-DD → 백엔드 date 파라미터용
  const formattedDate = selectedDate.toISOString().slice(0, 10);

  const { list: appointments, loading, error } = useAppointmentDashboard(0, 100, formattedDate);

  /** 필터링 */
  const immediateAppointments = appointments.filter(
    (app: AppointmentList) => app.status === 'CONFIRMED' && app.appointmentType === 'IMMEDIATE',
  );

  const scheduledAppointments = appointments.filter(
    (app: AppointmentList) => app.status === 'CONFIRMED' && app.appointmentType === 'SCHEDULED',
  );

  const requestedAppointments = appointments.filter(
    (app: AppointmentList) => app.status === 'REQUESTED',
  );

  return (
    <DashboardWrapper>
      <DatePickerWrapper>
        <DatePicker
          selected={selectedDate}
          onChange={(date: Date | null) => {
            if (date) setSelectedDate(date);
          }}
          dateFormat="yyyy-MM-dd"
          isClearable={false}
          placeholderText="날짜 선택"
        />
      </DatePickerWrapper>

      <HospitalTitle>{appointments.hospitalName}</HospitalTitle>

      {loading ? (
        <LoadingIndicator />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <SectionWrapper>
          {/** 당일 예약내역 */}
          <Section>
            <SectionTitle>당일 예약내역</SectionTitle>
            {immediateAppointments?.map((app: AppointmentList) => (
              <DashboardCard
                key={app.appointmentId}
                doctorName={app.doctorName}
                patientName={app.patientName}
                appointmentTime={app.appointmentTime}
                onClick={() => setSelectedAppointmentId(app.appointmentId)}
              />
            ))}
          </Section>

          {/* 스케줄 예약내역 */}
          <Section>
            <SectionTitle>스케줄 예약내역</SectionTitle>
            {scheduledAppointments?.map((app: AppointmentList) => (
              <DashboardCard
                key={app.appointmentId}
                doctorName={app.doctorName}
                patientName={app.patientName}
                appointmentTime={app.appointmentTime}
                onClick={() => setSelectedAppointmentId(app.appointmentId)}
              />
            ))}
          </Section>

          {/* 접수 대기 내역 */}
          <Section>
            <SectionTitle>접수 대기 내역</SectionTitle>
            {requestedAppointments?.map((app: AppointmentList) => (
              <DashboardCard
                key={app.appointmentId}
                doctorName={app.doctorName}
                patientName={app.patientName}
                appointmentTime={app.appointmentTime}
                onClick={() => setSelectedAppointmentId(app.appointmentId)}
              />
            ))}
          </Section>
        </SectionWrapper>
      )}

      {selectedAppointmentId && (
        <AppointmentUpdateModal
          appointmentId={selectedAppointmentId}
          isOpen={!!selectedAppointmentId}
          onClose={() => setSelectedAppointmentId(null)}
        />
      )}
    </DashboardWrapper>
  );
};

export default AppointmentDashboard;

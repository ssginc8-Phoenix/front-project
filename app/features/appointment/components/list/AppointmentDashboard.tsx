import LoadingIndicator from '~/components/common/LoadingIndicator';
import ErrorMessage from '~/components/common/ErrorMessage';
import { useAppointmentDashboard } from '~/features/appointment/hooks/useAppointmentList';
import styled from 'styled-components';
import type { AppointmentList } from '~/types/appointment';
import { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import DashboardCard from '~/features/appointment/components/update/DashboardCard';
import Pagination from '~/components/common/Pagination';

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
  display: flex;
  flex-direction: column;
  min-height: 60vh;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #333;
`;

const NoAppointmentsMessage = styled.p`
  color: #777;
  font-size: 0.95rem;
  text-align: center;
  padding: 20px 0;
  border-top: 1px dashed #eee;
  margin-top: 10px;
`;

interface AppointmentDashboardProps {
  selectedDate: Date;
  onSelectAppointment: (id: number) => void;
  refreshTrigger?: boolean;
}

const AppointmentDashboard = ({
  selectedDate,
  onSelectAppointment,
  refreshTrigger,
}: AppointmentDashboardProps) => {
  // format YYYY-MM-DD → 백엔드 date 파라미터용
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const formattedDate = selectedDate.toISOString().slice(0, 10);
  const {
    list: appointments,
    pagination,
    loading,
    error,
  } = useAppointmentDashboard(page, pageSize, formattedDate, refreshTrigger);

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
      {loading ? (
        <LoadingIndicator />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : (
        <>
          <SectionWrapper>
            {/** 당일 예약내역 */}
            <Section>
              <SectionTitle>당일 예약내역</SectionTitle>
              {immediateAppointments.length > 0 ? (
                immediateAppointments.map((app: AppointmentList) => (
                  <DashboardCard
                    key={app.appointmentId}
                    doctorName={app.doctorName}
                    patientName={app.patientName}
                    appointmentTime={app.appointmentTime}
                    onClick={() => onSelectAppointment(app.appointmentId)}
                  />
                ))
              ) : (
                <NoAppointmentsMessage>아직 당일 예약이 없습니다.</NoAppointmentsMessage>
              )}
            </Section>

            {/* 스케줄 예약내역 */}
            <Section>
              <SectionTitle>스케줄 예약내역</SectionTitle>
              {scheduledAppointments.length > 0 ? (
                scheduledAppointments.map((app: AppointmentList) => (
                  <DashboardCard
                    key={app.appointmentId}
                    doctorName={app.doctorName}
                    patientName={app.patientName}
                    appointmentTime={app.appointmentTime}
                    onClick={() => onSelectAppointment(app.appointmentId)}
                  />
                ))
              ) : (
                <NoAppointmentsMessage>아직 스케줄 예약이 없습니다.</NoAppointmentsMessage>
              )}
            </Section>

            {/* 접수 대기 내역 */}
            <Section>
              <SectionTitle>접수 대기 내역</SectionTitle>
              {requestedAppointments.length > 0 ? (
                requestedAppointments.map((app: AppointmentList) => (
                  <DashboardCard
                    key={app.appointmentId}
                    doctorName={app.doctorName}
                    patientName={app.patientName}
                    appointmentTime={app.appointmentTime}
                    onClick={() => onSelectAppointment(app.appointmentId)}
                  />
                ))
              ) : (
                <NoAppointmentsMessage>아직 접수 대기 내역이 없습니다.</NoAppointmentsMessage>
              )}
            </Section>
          </SectionWrapper>

          {(pagination?.totalPages ?? 0) > 1 && (
            <Pagination
              totalPages={pagination.totalPages}
              currentPage={pagination.currentPage}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </DashboardWrapper>
  );
};

export default AppointmentDashboard;

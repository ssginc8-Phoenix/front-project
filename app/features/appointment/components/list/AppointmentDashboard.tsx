import LoadingIndicator from '~/components/common/LoadingIndicator';
import ErrorMessage from '~/components/common/ErrorMessage';
import { useAppointmentDashboard } from '~/features/appointment/hooks/useAppointmentList';
import type { AppointmentList } from '~/types/appointment';
import { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import DashboardCard from '~/features/appointment/components/update/DashboardCard';
import Pagination from '~/components/common/Pagination';
import {
  DashboardWrapper,
  Section,
  SectionTitle,
  SectionWrapper,
  NoAppointmentsMessage,
} from '~/features/appointment/components/list/Dashboard.styles';

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

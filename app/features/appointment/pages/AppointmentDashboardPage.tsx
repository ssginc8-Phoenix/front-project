import AppointmentDashboard from '~/features/appointment/components/list/AppointmentDashboard';
import DatePickerSection from '~/features/appointment/components/update/DatePickerSection';
import React, { useState } from 'react';
import AppointmentUpdateModal from '~/features/appointment/components/update/UpdateModal';
import WaitModal from '~/features/hospitals/components/waiting/RegisterWaitModal';
import { PageWrapper } from '~/components/styled/PageWrapper';
import {
  StyledButton,
  TopSectionContainer,
} from '~/features/appointment/components/list/Dashboard.styles';

const AppointmentDashboardPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [showWaitModal, setShowWaitModal] = useState(false);

  // 모달 닫을 때 리스트 갱신도 트리거
  const handleCloseModal = () => {
    setSelectedAppointmentId(null);
    setRefreshTrigger((prev) => !prev);
  };

  return (
    <PageWrapper>
      <TopSectionContainer>
        <DatePickerSection selectedDate={selectedDate} onChangeDate={setSelectedDate} />
        <StyledButton onClick={() => setShowWaitModal(true)}>대기 인원 설정</StyledButton>
      </TopSectionContainer>

      {showWaitModal && <WaitModal onClose={() => setShowWaitModal(false)} />}

      <AppointmentDashboard
        selectedDate={selectedDate}
        onSelectAppointment={(id) => setSelectedAppointmentId(id)}
        refreshTrigger={refreshTrigger}
      />

      {selectedAppointmentId && (
        <AppointmentUpdateModal
          appointmentId={selectedAppointmentId}
          isOpen={!!selectedAppointmentId}
          onClose={handleCloseModal}
        />
      )}
    </PageWrapper>
  );
};

export default AppointmentDashboardPage;

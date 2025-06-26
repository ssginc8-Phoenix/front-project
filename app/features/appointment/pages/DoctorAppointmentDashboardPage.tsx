import { useState } from 'react';
import DatePickerSection from '~/features/appointment/components/update/DatePickerSection';
import AppointmentDashboard from '~/features/appointment/components/list/AppointmentDashboard';
import DoctorAppointmentDetailModal from '~/features/appointment/components/detail/DoctorAppointmentDetailModal';
import DoctorCapacityModal from '~/features/doctor/components/doctorCapacity/DoctorCapacityModal';
import styled from 'styled-components';

const TopSectionContainer = styled.div`
  display: flex;
  justify-content: space-between; /* 양 끝 정렬 */
  align-items: center; /* 수직 중앙 정렬 */
  background-color: #ffffff;
  border-radius: 16px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto 20px auto;
  box-sizing: border-box;
`;

const StyledButton = styled.button`
  background: #007bff; /* 파란색 배경 */
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 20px; /* 패딩 조정 */
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #0056b3;
  }

  &:active {
    background-color: #004085;
  }
`;

const DoctorAppointmentDashboardPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleCloseModal = () => {
    setSelectedAppointmentId(null);
    setRefreshTrigger((prev) => !prev);
  };

  return (
    <>
      <TopSectionContainer>
        <DatePickerSection selectedDate={selectedDate} onChangeDate={setSelectedDate} />
        <StyledButton onClick={() => setShowModal(true)}>진료 인원 설정</StyledButton>
      </TopSectionContainer>

      {showModal && <DoctorCapacityModal onClose={() => setShowModal(false)} />}
      <AppointmentDashboard
        selectedDate={selectedDate}
        onSelectAppointment={(id) => setSelectedAppointmentId(id)}
        refreshTrigger={refreshTrigger}
      />

      {selectedAppointmentId && (
        <DoctorAppointmentDetailModal
          appointmentId={selectedAppointmentId}
          isOpen={!!selectedAppointmentId}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default DoctorAppointmentDashboardPage;

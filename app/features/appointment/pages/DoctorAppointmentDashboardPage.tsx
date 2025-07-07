import { useState } from 'react';
import DatePickerSection from '~/features/appointment/components/update/DatePickerSection';
import AppointmentDashboard from '~/features/appointment/components/list/AppointmentDashboard';
import DoctorAppointmentDetailModal from '~/features/appointment/components/detail/DoctorAppointmentDetailModal';
import DoctorCapacityModal from '~/features/doctor/components/doctorCapacity/DoctorCapacityModal';
import { TopSectionContainer, StyledButton } from '../components/list/Dashboard.styles';

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

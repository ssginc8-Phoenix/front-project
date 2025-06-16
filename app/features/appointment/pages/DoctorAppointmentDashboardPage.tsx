import { useState } from 'react';
import DatePickerSection from '~/features/appointment/components/update/DatePickerSection';
import AppointmentDashboard from '~/features/appointment/components/list/AppointmentDashboard';
import AppointmentUpdateModal from '~/features/appointment/components/update/UpdateModal';

const DoctorAppointmentDashboardPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const [isCapacityModalOpen, setCapacityModalOpen] = useState(false);

  const handleCloseModal = () => {
    setSelectedAppointmentId(null);
    setRefreshTrigger((prev) => !prev);
  };

  return (
    <>
      <DatePickerSection selectedDate={selectedDate} onChangeDate={setSelectedDate} />

      {/* 진료 인원 설정 버튼 */}
      <div>
        <button>+ 진료 인원 설정</button>

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
      </div>
    </>
  );
};

export default DoctorAppointmentDashboardPage;

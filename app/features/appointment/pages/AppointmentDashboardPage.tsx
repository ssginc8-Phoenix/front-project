import AppointmentDashboard from '~/features/appointment/components/update/AppointmentDashboard';
import DatePickerSection from '~/features/appointment/components/update/DatePickerSection';
import { useState } from 'react';
import AppointmentUpdateModal from '~/features/appointment/components/update/UpdateModal';

const AppointmentDashboardPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  // 모달 닫을 때 리스트 갱신도 트리거
  const handleCloseModal = () => {
    setSelectedAppointmentId(null);
    setRefreshTrigger((prev) => !prev);
  };

  return (
    <>
      <DatePickerSection selectedDate={selectedDate} onChangeDate={setSelectedDate} />

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
    </>
  );
};

export default AppointmentDashboardPage;

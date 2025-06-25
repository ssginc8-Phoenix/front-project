import { useState } from 'react';
import DatePickerSection from '~/features/appointment/components/update/DatePickerSection';
import AppointmentDashboard from '~/features/appointment/components/list/AppointmentDashboard';
import DoctorAppointmentDetailModal from '~/features/appointment/components/detail/DoctorAppointmentDetailModal';
import DoctorCapacityModal from '~/features/doctor/components/doctorCapacity/DoctorCapacityModal';

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
      <DatePickerSection selectedDate={selectedDate} onChangeDate={setSelectedDate} />

      {/* 진료 인원 설정 버튼 */}
      <div>
        <div style={{ marginBottom: '1rem' }}>
          <button
            onClick={() => setShowModal(true)}
            style={{
              background: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
            }}
          >
            진료 인원 설정
          </button>
        </div>

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
      </div>
    </>
  );
};

export default DoctorAppointmentDashboardPage;

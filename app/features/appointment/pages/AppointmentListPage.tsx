import { useState } from 'react';
import AppointmentDetailModal from '~/features/appointment/components/detail/AppointmentDetailModal';
import AppointmentListComponent from '~/features/appointment/components/list/AppointmentList';

const AppointmentListPage = () => {
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);

  return (
    <>
      <AppointmentListComponent onSelectAppointment={(id) => setSelectedAppointmentId(id)} />

      {selectedAppointmentId !== null && (
        <AppointmentDetailModal
          appointmentId={selectedAppointmentId}
          isOpen={true}
          onClose={() => setSelectedAppointmentId(null)}
        />
      )}
    </>
  );
};

export default AppointmentListPage;

import { useState } from 'react';
import AppointmentDetailModal from '~/features/appointment/components/detail/AppointmentDetailModal';
import AppointmentListComponent from '~/features/appointment/components/list/AppointmentList';
import styled from 'styled-components';

const AppointmentListPage = () => {
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
  const [refreshListTrigger, setRefreshListTrigger] = useState(false);

  const handleRefreshList = () => {
    setRefreshListTrigger((prev) => !prev);
  };

  return (
    <>
      <AppointmentListComponent
        onSelectAppointment={(id) => setSelectedAppointmentId(id)}
        refreshTrigger={refreshListTrigger}
      />

      {selectedAppointmentId !== null && (
        <AppointmentDetailModal
          appointmentId={selectedAppointmentId}
          isOpen={true}
          onClose={() => setSelectedAppointmentId(null)}
          onRefreshList={handleRefreshList}
        />
      )}
    </>
  );
};

export default AppointmentListPage;

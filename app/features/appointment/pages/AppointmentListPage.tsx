import { useState } from 'react';
import AppointmentDetailModal from '~/features/appointment/components/detail/AppointmentDetailModal';
import AppointmentListComponent from '~/features/appointment/components/list/AppointmentList';
import Sidebar from '~/common/Sidebar';
import styled from 'styled-components';

const PageLayout = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const ContentArea = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 2rem 3rem;
`;

const AppointmentListPage = () => {
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
  const [refreshListTrigger, setRefreshListTrigger] = useState(false);

  const handleRefreshList = () => {
    setRefreshListTrigger((prev) => !prev);
  };

  return (
    <PageLayout>
      <Sidebar />
      <ContentArea>
        <AppointmentListComponent
          onSelectAppointment={(id) => setSelectedAppointmentId(id)}
          refreshTrigger={refreshListTrigger}
        />
      </ContentArea>

      {selectedAppointmentId !== null && (
        <AppointmentDetailModal
          appointmentId={selectedAppointmentId}
          isOpen={true}
          onClose={() => setSelectedAppointmentId(null)}
          onRefreshList={handleRefreshList}
        />
      )}
    </PageLayout>
  );
};

export default AppointmentListPage;

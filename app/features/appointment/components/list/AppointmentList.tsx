import { useAppointmentList } from '~/features/appointment/hooks/useAppointmentList';
import LoadingIndicator from '~/components/common/LoadingIndicator';
import ErrorMessage from '~/components/common/ErrorMessage';
import styled from 'styled-components';
import AppointmentCard from '~/features/appointment/components/list/AppointmentCard';
import Pagination from '~/components/common/Pagination';
import { useState } from 'react';
import type { AppointmentList } from '~/types/appointment';
import AppointmentDetailModal from '~/features/appointment/components/detail/AppointmentDetailModal';

const Wrapper = styled.div`
  padding: 2rem;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
`;

const PaginationWrapper = styled.div`
  margin-top: 32px;
  display: flex;
  justify-content: center;
`;

const AppointmentList = () => {
  const [page, setPage] = useState(0);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);

  const { list, pagination, loading, error } = useAppointmentList(page, 5);

  return (
    <Wrapper>
      <Title>예약 관리</Title>

      {loading && <LoadingIndicator />}
      {error && <ErrorMessage message={error} />}

      <Grid>
        {list?.map((appointment: AppointmentList) => (
          <AppointmentCard
            key={appointment.appointmentId}
            appointment={appointment}
            onClick={() => setSelectedAppointmentId(appointment.appointmentId)}
          />
        ))}
      </Grid>

      <PaginationWrapper>
        <Pagination
          totalPages={pagination.totalPages}
          currentPage={pagination.currentPage}
          onPageChange={setPage}
        />
      </PaginationWrapper>

      {/** 모달 조건부 렌더링*/}
      {selectedAppointmentId !== null && (
        <AppointmentDetailModal
          appointmentId={selectedAppointmentId}
          isOpen={true}
          onClose={() => setSelectedAppointmentId(null)}
        />
      )}
    </Wrapper>
  );
};

export default AppointmentList;

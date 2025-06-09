import { useAppointmentList } from '~/features/appointment/hooks/useAppointmentList';
import LoadingIndicator from '~/components/common/LoadingIndicator';
import ErrorMessage from '~/components/common/ErrorMessage';
import styled from 'styled-components';
import AppointmentCard from '~/features/appointment/components/list/AppointmentCard';
import Pagination from '~/components/common/Pagination';
import { useEffect, useState } from 'react';
import type { AppointmentList } from '~/types/appointment';

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

interface AppointmentListProps {
  onSelectAppointment: (appointmentId: number) => void;
  refreshTrigger: boolean;
}

const AppointmentListComponent = ({
  onSelectAppointment,
  refreshTrigger,
}: AppointmentListProps) => {
  const [page, setPage] = useState(0);

  const { list, pagination, loading, error } = useAppointmentList(page, 5);

  useEffect(() => {}, [refreshTrigger]);

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
            onClick={() => onSelectAppointment(appointment.appointmentId)}
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
    </Wrapper>
  );
};

export default AppointmentListComponent;

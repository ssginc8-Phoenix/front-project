import LoadingIndicator from '~/components/common/LoadingIndicator';
import ErrorMessage from '~/components/common/ErrorMessage';
import styled from 'styled-components';
import AppointmentCard from '~/features/appointment/components/list/AppointmentCard';
import Pagination from '~/components/common/Pagination';
import { useEffect, useState } from 'react';
import type { AppointmentList } from '~/types/appointment';
import { useAppointmentListByFilter } from '~/features/appointment/hooks/useAppointmentListByFilter';
import {
  Wrapper,
  Title,
  PaginationWrapper,
  ContentBody,
  Icon,
} from '~/components/styled/MyPage.styles';

const TabContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
  border-bottom: 1.5px solid #d6d6d6;

  @media (max-width: 768px) {
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    margin-bottom: 15px;
  }
`;

interface TabButtonProps {
  $isActive: boolean;
}

const TabButton = styled.button<TabButtonProps>`
  padding: 10px 20px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: ${(props) => (props.$isActive ? 'bold' : 'normal')};
  color: ${(props) => (props.$isActive ? '#007bff' : '#555')};
  border-bottom: ${(props) => (props.$isActive ? '2px solid #007bff' : 'none')};
  transition: all 0.3s ease;

  &:hover {
    color: #007bff;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem; /* 모바일에서 탭 버튼 글자 크기 조정 */
    padding: 8px 15px;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
    padding: 7px 12px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
  max-width: calc(
    320px * 3 + 16px * 2
  ); /* 더 넓은 화면에서 더 나은 레이아웃을 위해 최대 너비 조정 */
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: minmax(280px, 1fr); /* 모바일에서 카드 한 줄에 하나씩 정렬 */
    gap: 12px;
    max-width: 100%; /* 모바일에서 최대 너비 제한 해제 */
    padding: 0 1rem; /* 좌우 패딩 추가 */
    box-sizing: border-box; /* 패딩이 너비에 포함되도록 */
  }

  @media (max-width: 480px) {
    padding: 0 0.8rem;
    gap: 10px;
  }
`;

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 20px; /* 상하 패딩으로 여유 공간 확보 */
  text-align: center;
  color: #6b7280; /* 부드러운 회색 텍스트 */
  font-size: 1.1rem; /* 글자 크기 약간 키우기 */
  min-height: 200px; /* 최소 높이 설정으로 레이아웃 유지 */
  gap: 10px; /* 아이콘이 있다면 아이콘과 텍스트 사이 간격 */

  @media (max-width: 768px) {
    padding: 40px 15px; /* 모바일에서 패딩 조정 */
    font-size: 1rem;
    min-height: 150px;
  }

  @media (max-width: 480px) {
    padding: 30px 10px;
    font-size: 0.95rem;
    min-height: 120px;
  }
`;

const EmptyStateText = styled.p`
  margin: 0; /* 기본 마진 제거 */
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
  const [filterType, setFilterType] = useState<'active' | 'inactive'>('active');

  const { list, pagination, loading, error, refetch } = useAppointmentListByFilter(
    filterType,
    page,
    6,
    undefined,
    refreshTrigger,
  );

  useEffect(() => {
    refetch();
  }, [refreshTrigger, refetch]);

  // filterType이 변경될 때 페이지를 0으로 리셋
  useEffect(() => {
    setPage(0);
  }, [filterType]);

  // 예약 / 지난 예약 탭 전환 메서드
  const handleTabChange = (type: 'active' | 'inactive') => {
    setFilterType(type);
  };

  return (
    <Wrapper>
      <Title>
        <Icon>📋</Icon>
        예약 관리
      </Title>

      <TabContainer>
        <TabButton $isActive={filterType === 'active'} onClick={() => handleTabChange('active')}>
          예약
        </TabButton>
        <TabButton
          $isActive={filterType === 'inactive'}
          onClick={() => handleTabChange('inactive')}
        >
          지난 예약
        </TabButton>
      </TabContainer>

      <ContentBody>
        {loading && <LoadingIndicator />}
        {error && <ErrorMessage message={error} />}

        {!loading && !error && (
          <>
            {list && list.length > 0 ? (
              <>
                <Grid>
                  {list.map((appointment: AppointmentList) => (
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
              </>
            ) : (
              <EmptyStateContainer>
                <EmptyStateText>예약 내역이 존재하지 않습니다.</EmptyStateText>
                <EmptyStateText>새로운 예약을 추가해보세요!</EmptyStateText>
              </EmptyStateContainer>
            )}
          </>
        )}
      </ContentBody>
    </Wrapper>
  );
};

export default AppointmentListComponent;

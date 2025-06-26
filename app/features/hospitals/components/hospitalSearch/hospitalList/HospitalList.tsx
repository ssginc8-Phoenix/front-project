import React, { useState } from 'react';
import styled from 'styled-components';
import type { Hospital } from '../../../types/hospital';
import type { HospitalSchedule } from '~/features/hospitals/types/hospitalSchedule';
import { calculateDistance } from '~/features/hospitals/hooks/useDistanceTo';
import { useCurrentLocation } from '~/features/hospitals/hooks/useCurrentLocation';
import Loading from '../../common/Loading';
import { media } from '../../common/breakpoints';

interface HospitalListProps {
  hospitals: Hospital[];
  loading: boolean;
  error: Error | null;
  currentPage: number;
  onPageChange: (page: number) => void;
  onHospitalSelect: (hospitalId: number, lat: number, lng: number) => void;
  selectedHospitalId?: number | null;
  baseLocation?: { lat: number; lng: number };
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 350px;

  ${media('laptop')`
    width: 300px;
  `}
  ${media('tablet')`
    width: 100%;
  `}
`;

const List = styled.ul`
  /* 카드 리스트가 남는 공간을 모두 차지 */
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0;
  margin: 0;
  list-style: none;
  overflow-y: auto;
  width: 100%;

  /* optional: 반응형 높이 제한 */
  ${media('laptop')`
     max-height: 300px;
   `}
  ${media('tablet')`
     max-height: none;
   `}
`;

const Card = styled.li<{ selected: boolean }>`
  background: #fff;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  box-shadow: ${({ selected }) =>
    selected ? '0 0 0 3px #a3c2ff' : '0 2px 6px rgba(0, 0, 0, 0.08)'};
  cursor: pointer;
  transition: box-shadow 0.2s;
  width: 90%;

  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &:hover {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HospitalName = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: bold;
  color: #2c3e50;
`;

const Tag = styled.span`
  background-color: #e5f0ff;
  color: #0051c7;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.85rem;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: #555;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  /* 버튼 그룹 폭만큼만 */
  width: fit-content;
  margin: 0 auto;
  gap: 8px;
  padding: 0.125rem 0;
  border-top: 1px solid #ddd;
`;

const PageButton = styled.button<{ active: boolean }>`
  padding: 0.3rem 0.6rem;
  font-size: 0.9rem;
  background-color: ${({ active }) => (active ? '#00499e' : '#f0f0f0')};
  color: ${({ active }) => (active ? '#fff' : '#333')};
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;

const HospitalList: React.FC<HospitalListProps> = ({
  hospitals,
  loading,
  error,
  onHospitalSelect,
  selectedHospitalId,
  baseLocation,
}) => {
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 3;
  const { currentLocation } = useCurrentLocation(); // ✅ 위치 한 번만 가져옴

  const dayOfWeekMap: Record<number, string> = {
    0: 'SUNDAY',
    1: 'MONDAY',
    2: 'TUESDAY',
    3: 'WEDNESDAY',
    4: 'THURSDAY',
    5: 'FRIDAY',
    6: 'SATURDAY',
  };

  const formatTime = (timeStr: string) => timeStr?.slice(0, 5);
  const todayKey = dayOfWeekMap[new Date().getDay()];
  const totalPages = Math.ceil(hospitals.length / ITEMS_PER_PAGE);
  const paginatedHospitals = hospitals.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  if (loading) return <Loading />;
  if (error) return <div style={{ color: 'red' }}>에러: {error.message}</div>;

  return (
    <Wrapper>
      <List>
        {paginatedHospitals.map((hospital) => {
          const todaySchedule = hospital.schedules?.find(
            (s: HospitalSchedule) => s.dayOfWeek === todayKey,
          );
          const sch = todaySchedule
            ? `${formatTime(todaySchedule.openTime)} ~ ${formatTime(todaySchedule.closeTime)}`
            : '진료시간 정보 없음';

          const base = baseLocation ?? currentLocation;
          const distance =
            baseLocation && hospital.latitude && hospital.longitude
              ? calculateDistance(
                  baseLocation.lat,
                  baseLocation.lng,
                  Number(hospital.latitude),
                  Number(hospital.longitude),
                )
              : null;

          return (
            <Card
              key={hospital.hospitalId}
              selected={hospital.hospitalId === selectedHospitalId}
              onClick={() =>
                onHospitalSelect(hospital.hospitalId, hospital.latitude, hospital.longitude)
              }
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onHospitalSelect(hospital.hospitalId, hospital.latitude, hospital.longitude);
                }
              }}
            >
              <Header>
                <HospitalName>{hospital.name}</HospitalName>
                <Tag>대기 {hospital.waiting ?? 0}명</Tag>
              </Header>
              <Row>🕒 {sch}</Row>
              {distance !== null && <Row>📍 거리: {distance.toFixed(2)} km</Row>}
              <Row>📌 {hospital.address}</Row>
            </Card>
          );
        })}
      </List>
      <Pagination>
        {Array.from({ length: totalPages }, (_, i) => (
          <PageButton key={i + 1} active={i + 1 === page} onClick={() => setPage(i + 1)}>
            {i + 1}
          </PageButton>
        ))}
      </Pagination>
    </Wrapper>
  );
};

export default HospitalList;

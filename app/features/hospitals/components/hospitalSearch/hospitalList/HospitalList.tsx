import React, { useState } from 'react';
import styled from 'styled-components';
import type { Hospital } from '../../../types/hospital';

interface HospitalListProps {
  hospitals: Hospital[];
  loading: boolean;
  error: Error | null;
  onHospitalSelect: (hospitalId: number, lat: number, lng: number) => void;
  selectedHospitalId?: number | null;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const List = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  overflow-y: auto;
`;

const Card = styled.li<{ selected: boolean }>`
  background: #fff;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: ${({ selected }) =>
    selected ? '0 0 0 3px #a3c2ff' : '0 2px 6px rgba(0, 0, 0, 0.08)'};
  cursor: pointer;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  }

  display: flex;
  flex-direction: column;
  gap: 0.6rem;
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
  font-size: 0.9rem;
  color: #555;
`;

const KeywordButton = styled.button`
  background: #e8f0ff;
  color: #00499e;
  border: none;
  padding: 0.3rem 0.7rem;
  border-radius: 20px;
  font-size: 0.8rem;
  cursor: default;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 0.75rem 0;
  border-top: 1px solid #ddd;
`;

const PageButton = styled.button<{ active: boolean }>`
  padding: 0.4rem 0.8rem;
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
}) => {
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 3;
  const totalPages = Math.ceil(hospitals.length / ITEMS_PER_PAGE);

  const paginatedHospitals = hospitals.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div style={{ color: 'red' }}>에러: {error.message}</div>;

  return (
    <Wrapper>
      <List>
        {paginatedHospitals.map((hospital) => (
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
              <HospitalName>{hospital.hospitalName}</HospitalName>
              <Tag>대기 {hospital.waiting ?? 0}명</Tag>
            </Header>
            <Row>🕒 {hospital.schedules ?? '진료시간 정보 없음'}</Row>
            <Row>📍 {hospital.distance ?? '거리 정보 없음'}</Row>
            <Row>📌 {hospital.address}</Row>
            <Row>
              {hospital.keywords?.map((kw, idx) => <KeywordButton key={idx}>{kw}</KeywordButton>)}
            </Row>
          </Card>
        ))}
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

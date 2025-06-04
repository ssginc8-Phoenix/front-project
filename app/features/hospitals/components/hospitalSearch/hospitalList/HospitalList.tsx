// src/components/hospitalSearch/hospitalList/HospitalList.tsx
import React from 'react';
import styled from 'styled-components';
import HospitalCard from './HospitalCard';
import type { Hospital } from '../../../types/hospital'; // HospitalCard 컴포넌트 임포트

// ✅ HospitalListProps 인터페이스 정의
interface HospitalListProps {
  hospitals: Hospital[] | null;
  loading: boolean;
  error: Error | null;
  onHospitalSelect: (hospitalId: number, lat: number, lng: number) => void;
  selectedHospitalId: number | null;
}

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 0;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #00499e;
  margin-bottom: 1rem;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  padding: 0 1rem;
`;

const MessageContainer = styled.p`
  text-align: center;
  color: #6b7280;
  font-size: 1rem;
  margin-top: 2rem;
`;

const HospitalList = ({
  hospitals,
  loading,
  error,
  onHospitalSelect,
  selectedHospitalId,
}: HospitalListProps) => {
  // 1. 로딩 중인 경우
  if (loading) {
    return <MessageContainer>병원을 불러오는 중입니다...</MessageContainer>;
  }

  // 2. 에러가 발생한 경우
  if (error) {
    return (
      <MessageContainer style={{ color: '#d32f2f' }}>
        병원을 불러오는데 오류가 발생했습니다: {error.message}
      </MessageContainer>
    );
  }

  // 3. hospitals가 null이거나, content 배열이 없거나, content 배열이 비어있는 경우
  // 이 조건문을 통해 hospitals가 null인 경우 'content' 속성에 접근하는 것을 방지합니다.
  if (!hospitals || hospitals.length === 0) {
    return <MessageContainer>검색 결과가 없습니다.</MessageContainer>;
  }
  console.log('asd222222222222222222222', hospitals);
  console.log('HospitalList hospitals:', hospitals);
  // 4. 병원 목록이 있는 경우
  return (
    <ListWrapper>
      <Title>병원 목록</Title>
      <CardGrid>
        {hospitals.map((hospital) => (
          <HospitalCard
            key={hospital.hospitalId}
            hospital={hospital}
            isSelected={hospital.hospitalId === selectedHospitalId}
            onSelect={(hospitalId) =>
              onHospitalSelect(hospitalId, hospital.latitude, hospital.longitude)
            }
          />
        ))}
      </CardGrid>
    </ListWrapper>
  );
};

export default React.memo(HospitalList);

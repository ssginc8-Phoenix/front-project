// src/components/hospitalSearch/hospitalList/HospitalList.tsx
import React from 'react';
import styled from 'styled-components';

import type { Hospital } from '../../../types/hospital';

interface HospitalListProps {
  hospitals: Hospital[];
  loading: boolean;
  error: Error | null;
  onHospitalSelect: (hospitalId: number, lat: number, lng: number) => void;
  selectedHospitalId?: number | null;
}

const List = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Card = styled.li<{ selected: boolean }>`
  background-color: ${({ selected }) => (selected ? '#d3e3fd' : '#fff')};
  cursor: pointer;
  border-radius: 8px;
  box-shadow: ${({ selected }) =>
    selected ? '0 0 10px rgba(66, 133, 244, 0.6)' : '0 1px 3px rgba(0, 0, 0, 0.1)'};
  padding: 16px 20px;
  transition:
    background-color 0.3s,
    box-shadow 0.3s;

  &:hover {
    background-color: #e6f0fe;
    box-shadow: 0 0 10px rgba(66, 133, 244, 0.4);
  }

  display: flex;
  flex-direction: column;
`;

const HospitalName = styled.h3`
  margin: 0 0 8px 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: #2c3e50;
`;

const HospitalAddress = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #666;
`;

const HospitalList: React.FC<HospitalListProps> = ({
  hospitals,
  loading,
  error,
  onHospitalSelect,
  selectedHospitalId,
}) => {
  if (loading) return <div>로딩 중...</div>;
  if (error) return <div style={{ color: 'red' }}>에러: {error.message}</div>;

  return (
    <List>
      {hospitals.map((hospital) => (
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
          <HospitalName>{hospital.name}</HospitalName>
          <HospitalAddress>{hospital.address}</HospitalAddress>
        </Card>
      ))}
    </List>
  );
};

export default HospitalList;

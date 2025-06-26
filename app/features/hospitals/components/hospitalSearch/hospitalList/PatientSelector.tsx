import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getGuardianPatients } from '~/features/guardian/api/guardianAPI';
import type { PatientSummary } from '~/features/hospitals/types/patient';
import { getCoordsFromAddress } from '~/features/hospitals/api/geocode';

interface Props {
  onSelect?: (patient: PatientSummary) => void;
  onLocate?: (coords: { lat: number; lng: number }) => void; // ⬅️ 마커 위치 설정 함수
}

const Container = styled.div`
  min-width: 120px;
  background: #f9fafb;
  border-radius: 6px;
  padding: 0.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  z-index: 1;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  margin-right: 0.5rem;
`;

const Select = styled.select`
  padding: 6px 10px;
  font-size: 0.9rem;
`;

const PatientSelector: React.FC<Props> = ({ onSelect, onLocate }) => {
  const [patients, setPatients] = useState<PatientSummary[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    getGuardianPatients()
      .then((data) => {
        setPatients(data);
        console.log('받은 환자 목록:', data);
      })
      .catch((err) => {
        console.error('환자 조회 실패:', err);
      });
  }, []);

  const handlePatientSelect = async (patient: PatientSummary) => {
    try {
      const coords = await getCoordsFromAddress(patient.address);
      if (onLocate) onLocate(coords); // ⬅️ 마커 위치 조정
    } catch (e) {
      console.error('주소 → 좌표 변환 실패:', e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    setSelectedId(id);
    const selected = patients.find((p) => p.patientId === id);
    if (selected) {
      if (onSelect) onSelect(selected);
      handlePatientSelect(selected); // ⬅️ 이걸로 마커 찍기
    }
  };
  return (
    <Container>
      <Label htmlFor="patient-select">👤 환자 선택</Label>
      <Select id="patient-select" value={selectedId ?? ''} onChange={handleChange}>
        <option value="">-- 선택 --</option>
        {patients.map((p) => (
          <option key={p.patientId} value={p.patientId}>
            {p.name}
          </option>
        ))}
      </Select>
    </Container>
  );
};

export default PatientSelector;

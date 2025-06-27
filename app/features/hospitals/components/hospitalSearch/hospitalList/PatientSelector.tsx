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
      if (onLocate) onLocate(coords);
    } catch (e) {
      console.error(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    setSelectedId(id);
    const selected = patients.find((p) => p.patientId === id);
    if (selected) {
      if (onSelect) onSelect(selected);
      handlePatientSelect(selected);
    }
  };
  const selectedPatient = patients.find((p) => p.patientId === selectedId);
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

      {/* ➊ 선택된 환자를 아래에 표시 */}
      {selectedPatient && (
        <SelectedInfo>
          <span>선택된 환자: {selectedPatient.name}</span>
          {/* ➋ 다시 눌러도 지도 리센터 */}
          <ResetButton onClick={() => handlePatientSelect(selectedPatient)}>
            위치 재설정
          </ResetButton>
        </SelectedInfo>
      )}
    </Container>
  );
};

export default PatientSelector;
const SelectedInfo = styled.div`
  margin-top: 0.5rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
const ResetButton = styled.button`
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: #2563eb;
  }
`;

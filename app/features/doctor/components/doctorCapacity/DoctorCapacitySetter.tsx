import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getMyDoctorInfo, updateDoctorCapacity } from '~/features/doctor/api/doctorAPI';
import { showErrorAlert, showSuccessAlert } from '~/components/common/alert';

interface Props {
  onSaved?: () => void;
}

const DoctorCapacitySetter: React.FC<Props> = ({ onSaved }) => {
  const [doctorId, setDoctorId] = useState<number | null>(null);
  const [capacity, setCapacity] = useState<number>(1);
  const [isDirty, setDirty] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const data = await getMyDoctorInfo();
        setDoctorId(data.doctorId);
        setCapacity(data.capacityPerHalfHour || 1);
      } catch (e) {
        console.error('의사 정보 불러오기 실패', e);
        await showErrorAlert('정보 로드 실패', '의사 정보를 불러오는 데 실패했습니다.');
      }
    };
    fetchDoctor();
  }, []);

  const handleChange = (delta: number) => {
    setCapacity((prev) => Math.max(1, prev + delta));
    setDirty(true);
  };

  const handleSave = async () => {
    if (!doctorId) return;
    try {
      await updateDoctorCapacity(doctorId, capacity);
      await showSuccessAlert('저장 완료', '진료 인원이 성공적으로 저장되었습니다.');
      setDirty(false);
      onSaved?.(); // 저장 후 모달 닫기
    } catch (e) {
      console.error(e);
      await showErrorAlert('저장 실패', '진료 인원 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <Wrapper>
      <Button onClick={() => handleChange(-1)}>-</Button>
      <CountDisplay>{capacity}</CountDisplay>
      <Button onClick={() => handleChange(1)}>+</Button>
      <SaveButton onClick={handleSave}>저장</SaveButton>
    </Wrapper>
  );
};

export default DoctorCapacitySetter;

// -------------------- styled components --------------------

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
`;

const Button = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background-color: #e5e7eb;
  font-size: 1.2rem;
  cursor: pointer;
  &:hover {
    background-color: #d1d5db;
  }
`;

const CountDisplay = styled.span`
  font-size: 1.1rem;
  font-weight: bold;
  width: 40px;
  text-align: center;
`;

const SaveButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background-color: #2563eb;
  }
`;

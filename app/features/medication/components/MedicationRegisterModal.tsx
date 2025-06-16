import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  postMedicationSchedule,
  updateMedicationSchedule,
} from '~/features/medication/api/medicationAPI';
import useLoginStore from '~/features/user/stores/LoginStore';
import { daysOfWeek } from '~/features/medication/constants/daysOfWeek';

const ModalBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  width: 100%;
`;

const Label = styled.div`
  margin-top: 1.2rem;
  margin-bottom: 0.5rem;
  font-weight: bold;
`;

const Input = styled.input`
  width: 80%;
  padding: 0.6rem 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
`;

const SelectButton = styled.button<{ selected: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: ${({ selected }) => (selected ? '2px solid #2563eb' : '1px solid #ccc')};
  background: ${({ selected }) => (selected ? '#eff6ff' : '#fff')};
  color: ${({ selected }) => (selected ? '#2563eb' : '#333')};
  font-weight: ${({ selected }) => (selected ? '600' : 'normal')};
  cursor: pointer;
  transition: all 0.2s ease;
`;

const TimeInput = styled.input`
  margin-top: 0.5rem;
  padding: 0.4rem 0.6rem;
  font-size: 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
`;

const ButtonRow = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const ActionButton = styled.button`
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  border: none;
  background-color: #2563eb;
  color: white;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #1d4ed8;
  }

  &:first-child {
    background-color: #e5e7eb;
    color: #333;

    &:hover {
      background-color: #d1d5db;
    }
  }
`;

interface MedicationData {
  medicationId: number;
  medicationName: string;
  timeToTake: string;
  days: string[];
  startDate: string;
  endDate: string;
}
interface Props {
  date: string;
  patientGuardianId: number;
  initialData?: MedicationData;
  onClose: () => void;
}
export default function MedicationRegisterModal({
  date,
  patientGuardianId,
  initialData,
  onClose,
}: Props) {
  const { user } = useLoginStore();
  const [medicationName, setMedicationName] = useState('');
  const [selectedTime, setSelectedTime] = useState('08:00');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [startDate, setStartDate] = useState(date);
  const [endDate, setEndDate] = useState(date);

  useEffect(() => {
    if (initialData) {
      setMedicationName(initialData.medicationName);
      setSelectedTime(initialData.timeToTake.slice(0, 5));
      setSelectedDays(initialData.days ?? []);
      setStartDate(initialData.startDate);
      setEndDate(initialData.endDate);
    }
  }, [initialData]);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const handleSubmit = async () => {
    if (initialData) {
      // 수정 모드: 날짜 필드까지 포함해 보내기
      try {
        const payload: Record<string, any> = {
          newTimeToTake: `${selectedTime}:00`,
          newDays: selectedDays,
          newStartDate: startDate,
          newEndDate: endDate,
        };
        await updateMedicationSchedule(initialData.medicationId, payload);
        alert('수정되었습니다.');
        onClose();
      } catch (e) {
        console.error(e);
        alert('수정 실패');
      }
      return; // 반드시 return 해서 이후 등록 로직이 실행되지 않도록
    }

    // 등록용 바디
    const createBody = {
      userId: user?.userId ?? 0,
      patientGuardianId,
      medicationName: medicationName.trim(),
      timeToTake: `${selectedTime}:00`,
      days: selectedDays,
      startDate,
      endDate,
    };

    try {
      if (initialData) {
        // 수정 시에는 newTimeToTake, newDays 만 보내야 백엔드가 처리합니다.
        await updateMedicationSchedule(initialData.medicationId, {
          newTimeToTake: `${selectedTime}:00`,
          newDays: selectedDays,
        });
        alert('수정되었습니다.');
      } else {
        await postMedicationSchedule(createBody);
        alert('등록되었습니다.');
      }
      onClose();
    } catch (e) {
      alert(initialData ? '수정 실패' : '등록 실패');
      console.error(e);
    }
  };

  return (
    <ModalBox>
      <Label>💊 약 이름</Label>
      <Input
        type="text"
        value={medicationName}
        onChange={(e) => setMedicationName(e.target.value)}
        disabled={!!initialData}
      />

      <Label>🕓 복약 시간</Label>
      <TimeInput
        type="time"
        value={selectedTime}
        onChange={(e) => setSelectedTime(e.target.value)}
      />

      <Label>📅 복약 요일</Label>
      <ButtonGroup>
        {daysOfWeek.map((d) => (
          <SelectButton
            key={d.value}
            selected={selectedDays.includes(d.value)}
            onClick={() => toggleDay(d.value)}
          >
            {d.label}
          </SelectButton>
        ))}
      </ButtonGroup>

      <Label>📌 복용 시작일</Label>
      <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

      <Label>📌 복용 종료일</Label>
      <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

      <ButtonRow>
        <ActionButton onClick={onClose}>취소</ActionButton>
        <ActionButton onClick={handleSubmit}>{initialData ? '수정하기' : '등록하기'}</ActionButton>
      </ButtonRow>
    </ModalBox>
  );
}

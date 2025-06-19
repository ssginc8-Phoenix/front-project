// MedicationRegisterModal.tsx
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  postMedicationSchedule,
  updateMedicationSchedule,
} from '~/features/medication/api/medicationAPI';
import useLoginStore from '~/features/user/stores/LoginStore';
import { daysOfWeek } from '~/features/medication/constants/daysOfWeek';

const ModalBox = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60vw;
  max-width: 700px;
  max-height: 85vh;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 2001;
`;

const ModalHeader = styled.div`
  flex: 0 0 auto;
  padding: 1rem;
  text-align: center;
  font-size: 1.25rem;
  font-weight: bold;
  border-bottom: 1px solid #eee;
`;

const ModalBody = styled.div`
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 1rem;
`;

const ModalFooter = styled.div`
  flex: 0 0 auto;
  padding: 1rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
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
  days: string[];
  startDate: string;
  endDate: string;
  times?: { meal: 'morning' | 'lunch' | 'dinner'; time: string }[];
}

interface Props {
  date: string;
  patientGuardianId: number;
  initialData?: MedicationData;
  onClose: () => void;
}

const mealOptions = [
  { value: 'morning', label: '아침' },
  { value: 'lunch', label: '점심' },
  { value: 'dinner', label: '저녁' },
];

export default function MedicationRegisterModal({
  date,
  patientGuardianId,
  initialData,
  onClose,
}: Props) {
  const { user } = useLoginStore();
  const [medicationName, setMedicationName] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [startDate, setStartDate] = useState(date);
  const [endDate, setEndDate] = useState(date);
  const [selectedMeals, setSelectedMeals] = useState<string[]>([]);
  const [mealTimes, setMealTimes] = useState<Record<string, string>>({
    morning: '',
    lunch: '',
    dinner: '',
  });

  useEffect(() => {
    if (!initialData) return;

    setMedicationName(initialData.medicationName);
    setSelectedDays(initialData.days);
    setStartDate(initialData.startDate);
    setEndDate(initialData.endDate);

    const times = initialData.times ?? [];
    const meals = Array.from(new Set(times.map((t) => t.meal)));
    setSelectedMeals(meals);

    const timesMap: Record<string, string> = {};
    times.forEach((t) => {
      timesMap[t.meal] = t.time.slice(0, 5);
    });
    setMealTimes((prev) => ({ ...prev, ...timesMap }));
  }, [initialData]);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const toggleMeal = (meal: string) => {
    setSelectedMeals((prev) =>
      prev.includes(meal) ? prev.filter((m) => m !== meal) : [...prev, meal],
    );
  };

  const handleSubmit = async () => {
    if (!medicationName.trim()) {
      alert('약 이름을 입력해주세요.');
      return;
    }
    if (selectedDays.length === 0 || selectedMeals.length === 0) {
      alert('요일과 끼니를 모두 선택해주세요.');
      return;
    }

    const timesPayload = selectedMeals.map((meal) => ({
      meal,
      time: `${mealTimes[meal]}:00`,
    }));

    try {
      if (initialData) {
        await updateMedicationSchedule(initialData.medicationId, {
          newTimes: timesPayload,
          newDays: selectedDays,
          newStartDate: startDate,
          newEndDate: endDate,
        });
        alert('수정되었습니다.');
      } else {
        await postMedicationSchedule({
          userId: user?.userId ?? 0,
          patientGuardianId,
          medicationName: medicationName.trim(),
          times: timesPayload,
          days: selectedDays,
          startDate,
          endDate,
        });
        alert('등록되었습니다.');
      }
      onClose();
    } catch {
      alert(initialData ? '수정 실패' : '등록 실패');
    }
  };

  return (
    <ModalBox>
      <ModalHeader>{initialData ? '💊 약 수정' : '💊 약 등록'}</ModalHeader>
      <ModalBody>
        <Label>💊 약 이름</Label>
        <Input
          type="text"
          value={medicationName}
          onChange={(e) => setMedicationName(e.target.value)}
          disabled={!!initialData}
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

        <Label>⏰ 복용 끼니 선택</Label>
        <ButtonGroup>
          {mealOptions.map((m) => (
            <SelectButton
              key={m.value}
              selected={selectedMeals.includes(m.value)}
              onClick={() => toggleMeal(m.value)}
            >
              {m.label}
            </SelectButton>
          ))}
        </ButtonGroup>

        {selectedMeals.map((meal, idx) => {
          const label = mealOptions.find((m) => m.value === meal)!.label;
          return (
            <div key={`${meal}-${idx}`} style={{ width: '80%' }}>
              <Label>{label} 시간</Label>
              <TimeInput
                type="time"
                value={mealTimes[meal]}
                onChange={(e) =>
                  setMealTimes((prev) => ({
                    ...prev,
                    [meal]: e.target.value,
                  }))
                }
              />
            </div>
          );
        })}

        <Label>📌 복용 시작일</Label>
        <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

        <Label>📌 복용 종료일</Label>
        <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </ModalBody>

      <ModalFooter>
        <ActionButton onClick={onClose}>취소</ActionButton>
        <ActionButton onClick={handleSubmit}>{initialData ? '수정하기' : '등록하기'}</ActionButton>
      </ModalFooter>
    </ModalBox>
  );
}

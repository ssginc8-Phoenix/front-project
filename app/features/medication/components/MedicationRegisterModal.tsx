import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import {
  postMedicationSchedule,
  updateMedicationSchedule,
} from '~/features/medication/api/medicationAPI';
import useLoginStore from '~/features/user/stores/LoginStore';
import { daysOfWeek } from '~/features/medication/constants/daysOfWeek';

// 공통 인풋 스타일
const inputStyles = css`
  width: 100%;
  height: 44px;
  padding: 0.75rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-size: 1rem;
  background: #f8fafc;
  box-sizing: border-box;
`;

const Input = styled.input`
  ${inputStyles}
`;

const Select = styled.select`
  ${inputStyles}
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ModalContainer = styled.div`
  width: 600px;
  max-width: 95vw;
  max-height: 90vh;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 1.75rem;
  border-bottom: 1px solid #eff3f8;
`;

const HeaderIcon = styled.div`
  font-size: 1.6rem;
  background: #e0f2fe;
  color: #2563eb;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HeaderTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
`;

const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  align-items: center;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  max-width: 480px;
  padding: 0 1rem;
`;

const SectionLabel = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: #334155;
`;

const TagGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.5rem;
`;

const TagButton = styled.button<{ $active?: boolean }>`
  padding: 0.45rem 0.9rem;
  border: ${({ $active }) => ($active ? '2px solid #2563eb' : '1px solid #cbd5e1')};
  border-radius: 9999px;
  background: ${({ $active }) => ($active ? '#eff6ff' : '#ffffff')};
  color: ${({ $active }) => ($active ? '#2563eb' : '#475569')};
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
`;

const Footer = styled.div`
  padding: 1.25rem 1.75rem;
  border-top: 1px solid #eff3f8;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

const FooterBtn = styled.button<{ primary?: boolean }>`
  padding: 0.65rem 1.4rem;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  ${({ primary }) =>
    primary
      ? `background:#2563eb;color:#ffffff; &:hover{background:#1d4ed8;}`
      : `background:#f1f5f9;color:#334155; &:hover{background:#e2e8f0;}`};
`;

const DateRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  width: 100%;
  max-width: 480px;
  padding: 0 1rem;
`;

const mealOptions = [
  { value: 'morning', label: '아침' },
  { value: 'lunch', label: '점심' },
  { value: 'dinner', label: '저녁' },
];

export default function MedicationRegisterModal({
  date,
  patientGuardianId,
  patients,
  initialData,
  onClose,
}) {
  const { user } = useLoginStore();

  const initialTarget = initialData
    ? String(patientGuardianId!)
    : patientGuardianId !== undefined
      ? String(patientGuardianId)
      : 'all';
  const [selectedTarget, setSelectedTarget] = useState(initialTarget);
  const [medicationName, setMedicationName] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [startDate, setStartDate] = useState(date);
  const [endDate, setEndDate] = useState(date);
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [mealTimes, setMealTimes] = useState({ morning: '', lunch: '', dinner: '' });

  useEffect(() => {
    if (!initialData) return;
    setMedicationName(initialData.medicationName);
    setSelectedDays(initialData.days);
    setStartDate(initialData.startDate);
    setEndDate(initialData.endDate);
    const meals = mealOptions
      .map((m) => m.value)
      .filter((v) => initialData.times?.some((t) => t.meal === v));
    setSelectedMeals(meals);
    const map = {};
    initialData.times?.forEach((t) => {
      map[t.meal] = t.time.slice(0, 5);
    });
    setMealTimes((prev) => ({ ...prev, ...map }));
  }, [initialData]);

  const toggleDay = (day) =>
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  const toggleMeal = (meal) =>
    setSelectedMeals((prev) =>
      prev.includes(meal) ? prev.filter((m) => m !== meal) : [...prev, meal],
    );

  const handleSubmit = async () => {
    if (!initialData && selectedTarget === '') return alert('환자를 선택해주세요.');
    if (!medicationName.trim()) return alert('약 이름을 입력해주세요.');
    if (!selectedDays.length || !selectedMeals.length)
      return alert('요일과 끼니를 모두 선택해주세요.');

    const timesPayload = selectedMeals.map((meal) => ({ meal, time: `${mealTimes[meal]}:00` }));
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
        const targets =
          selectedTarget === 'all'
            ? patients.map((p) => p.patientGuardianId)
            : [Number(selectedTarget)];
        for (const pid of targets) {
          await postMedicationSchedule({
            userId: user?.userId ?? 0,
            patientGuardianId: pid,
            medicationName: medicationName.trim(),
            times: timesPayload,
            days: selectedDays,
            startDate,
            endDate,
          });
        }
        alert(
          selectedTarget === 'all'
            ? '모든 환자에게 등록되었습니다.'
            : '선택된 환자에게 등록되었습니다.',
        );
      }
      onClose();
    } catch {
      alert(initialData ? '수정 실패' : '등록 실패');
    }
  };

  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>
          <HeaderIcon>💊</HeaderIcon>
          <HeaderTitle>{initialData ? '약 정보 수정' : '약 정보 등록'}</HeaderTitle>
        </ModalHeader>

        <ModalBody>
          {!initialData && (
            <Section>
              <SectionLabel>환자 선택</SectionLabel>
              <Select value={selectedTarget} onChange={(e) => setSelectedTarget(e.target.value)}>
                <option value="all">전체</option>
                {patients.map((p) => (
                  <option key={p.patientGuardianId} value={p.patientGuardianId}>
                    {p.name}
                  </option>
                ))}
              </Select>
            </Section>
          )}

          <Section>
            <SectionLabel>약 이름</SectionLabel>
            <Input
              type="text"
              value={medicationName}
              onChange={(e) => setMedicationName(e.target.value)}
              disabled={!!initialData}
            />
          </Section>

          <Section>
            <SectionLabel>복약 요일</SectionLabel>
            <TagGroup>
              {daysOfWeek.map((d) => (
                <TagButton
                  key={d.value}
                  $active={selectedDays.includes(d.value)}
                  onClick={() => toggleDay(d.value)}
                >
                  {d.label}
                </TagButton>
              ))}
            </TagGroup>
          </Section>

          <Section>
            <SectionLabel>복용 끼니</SectionLabel>
            <TagGroup>
              {mealOptions.map((m) => (
                <TagButton
                  key={m.value}
                  $active={selectedMeals.includes(m.value)}
                  onClick={() => toggleMeal(m.value)}
                >
                  {m.label}
                </TagButton>
              ))}
            </TagGroup>
          </Section>

          {mealOptions
            .filter((m) => selectedMeals.includes(m.value))
            .map((m) => (
              <Section key={m.value}>
                <SectionLabel>{m.label} 시간</SectionLabel>
                <Input
                  type="time"
                  value={mealTimes[m.value]}
                  onChange={(e) => setMealTimes((prev) => ({ ...prev, [m.value]: e.target.value }))}
                />
              </Section>
            ))}

          <Section>
            <SectionLabel>시작일</SectionLabel>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </Section>
          <Section>
            <SectionLabel>종료일</SectionLabel>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </Section>
        </ModalBody>

        <Footer>
          <FooterBtn onClick={onClose}>취소</FooterBtn>
          <FooterBtn primary onClick={handleSubmit}>
            {initialData ? '수정하기' : '등록하기'}
          </FooterBtn>
        </Footer>
      </ModalContainer>
    </ModalOverlay>
  );
}

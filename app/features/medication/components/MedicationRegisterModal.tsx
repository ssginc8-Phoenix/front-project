import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import {
  postMedicationSchedule,
  updateMedicationSchedule,
} from '~/features/medication/api/medicationAPI';
import useLoginStore from '~/features/user/stores/LoginStore';
import { daysOfWeek } from '~/features/medication/constants/daysOfWeek';
import { showErrorAlert, showSuccessAlert } from '~/components/common/alert';

const inputStyles = css`
  width: 100%;
  height: 44px;
  padding: 0.75rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-size: 1rem;
  background: #f8fafc;
  box-sizing: border-box;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }

  /* Responsive adjustments for Inputs & Selects */
  @media (max-width: 360px) {
    height: 40px; /* Slightly reduced height for mobile */
    padding: 0.6rem 0.8rem;
    font-size: 0.9rem;
  }
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

  /* Responsive adjustments for ModalContainer */
  @media (max-width: 768px) {
    width: 90vw; /* Wider on tablets/smaller desktops */
  }

  @media (max-width: 360px) {
    width: 95vw; /* Maximize width on mobile */
    border-radius: 15px; /* Slightly smaller border-radius */
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 1.75rem;
  border-bottom: 1px solid #eff3f8;

  /* Responsive adjustments for ModalHeader */
  @media (max-width: 360px) {
    padding: 1rem 1.25rem;
    gap: 0.5rem;
  }
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

  /* Responsive adjustments for HeaderIcon */
  @media (max-width: 360px) {
    width: 35px;
    height: 35px;
    font-size: 1.4rem;
  }
`;

const HeaderTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;

  /* Responsive adjustments for HeaderTitle */
  @media (max-width: 360px) {
    font-size: 1rem;
  }
`;

const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  align-items: center;

  /* Responsive adjustments for ModalBody */
  @media (max-width: 360px) {
    padding: 1.25rem;
    gap: 1.2rem;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  max-width: 480px;
  padding: 0 1rem;

  /* Responsive adjustments for Section */
  @media (max-width: 360px) {
    padding: 0 0.5rem; /* Reduce horizontal padding */
    gap: 0.6rem;
  }
`;

const SectionLabel = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: #334155;

  /* Responsive adjustments for SectionLabel */
  @media (max-width: 360px) {
    font-size: 0.85rem;
  }
`;

const TagGroup = styled.div`
  display: flex;
  flex-wrap: wrap; /* Allow wrapping for smaller screens if needed, though we aim for one row */
  justify-content: space-between; /* Distribute items evenly */
  gap: 0.3rem; /* Adjusted gap for better fit, considering 7 items */

  /* Specific adjustment for 360px width to ensure 7 items fit in one row */
  @media (max-width: 360px) {
    gap: 0.2rem; /* Even smaller gap for a tight fit on 360px */
  }
`;

const TagButton = styled.button<{ $active?: boolean }>`
  /* Calculate flex-basis for 7 items in a row, considering TagGroup's gap */
  /* For a TagGroup gap of 0.3rem, there are 6 gaps, so total gap space is 6 * 0.3rem = 1.8rem */
  /* flex-basis = (100% - total_gap_width) / number_of_items */
  flex-basis: calc(100% / 7 - (0.3rem * 6 / 7)); /* Distribute gap more precisely */
  padding: 0.45rem 0.2rem; /* Adjusted padding to make button smaller */
  min-width: 38px; /* Ensure minimum width for single character days */
  height: 38px; /* Ensure a consistent height for circular appearance if desired */
  display: flex;
  align-items: center;
  justify-content: center;
  border: ${({ $active }) => ($active ? '2px solid #2563eb' : '1px solid #cbd5e1')};
  border-radius: 9999px; /* Make it circular or pill-shaped */
  background: ${({ $active }) => ($active ? '#eff6ff' : '#ffffff')};
  color: ${({ $active }) => ($active ? '#2563eb' : '#475569')};
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  box-sizing: border-box; /* Include padding and border in the element's total width and height */

  /* Mobile adjustments for 360px width */
  @media (max-width: 360px) {
    /* For TagGroup gap of 0.2rem, total gap for 6 gaps is 1.2rem */
    flex-basis: calc(100% / 7 - (0.2rem * 6 / 7)); /* Adjust based on new gap */
    font-size: 0.8rem; /* Smaller font for tiny buttons */
    padding: 0.4rem 0.1rem; /* Adjust padding for small size */
    min-width: 35px; /* Minimum width for mobile */
    height: 35px; /* Consistent height for mobile */
  }
`;

const Footer = styled.div`
  padding: 1.25rem 1.75rem;
  border-top: 1px solid #eff3f8;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;

  /* Responsive adjustments for Footer */
  @media (max-width: 360px) {
    padding: 1rem 1.25rem;
    gap: 0.5rem;
  }
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

  /* Responsive adjustments for FooterBtn */
  @media (max-width: 360px) {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
  }
`;

const DateRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  width: 100%;
  max-width: 480px;
  padding: 0 1rem;

  /* Responsive adjustments for DateRow */
  @media (max-width: 360px) {
    gap: 1.2rem;
    padding: 0 0.5rem;
  }
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
    ? String(initialData.patientGuardianId) // Use initialData's patientGuardianId if editing
    : patientGuardianId !== undefined
      ? String(patientGuardianId)
      : 'all';
  const [selectedTarget, setSelectedTarget] = useState(initialTarget);
  const [medicationName, setMedicationName] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [startDate, setStartDate] = useState(date);
  const [endDate, setEndDate] = useState(date);
  const [selectedMeals, setSelectedMeals] = useState<string[]>([]);
  const [mealTimes, setMealTimes] = useState<{ [key: string]: string }>({
    morning: '',
    lunch: '',
    dinner: '',
  });

  useEffect(() => {
    if (!initialData) return;
    setMedicationName(initialData.medicationName);
    setSelectedDays(initialData.days || []);
    setStartDate(initialData.startDate);
    setEndDate(initialData.endDate);
    const meals = mealOptions
      .map((m) => m.value)
      .filter((v) => initialData.times?.some((t: { meal: string }) => t.meal === v));
    setSelectedMeals(meals);
    const map: { [key: string]: string } = {};
    initialData.times?.forEach((t: { meal: string; time: string }) => {
      map[t.meal] = t.time.slice(0, 5);
    });
    setMealTimes((prev) => ({ ...prev, ...map }));

    if (initialData.patientGuardianId) {
      setSelectedTarget(String(initialData.patientGuardianId));
    }
  }, [initialData]);

  const toggleDay = (day: string) =>
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  const toggleMeal = (meal: string) =>
    setSelectedMeals((prev) =>
      prev.includes(meal) ? prev.filter((m) => m !== meal) : [...prev, meal],
    );

  const handleSubmit = async () => {
    if (!initialData) {
      if (selectedTarget === 'all' && patients.length === 0) {
        showErrorAlert('등록 오류', '등록할 환자가 없습니다. 먼저 환자를 등록해주세요.');
        return;
      }
      if (selectedTarget === '') {
        showErrorAlert('선택 오류', '환자를 선택해주세요.');
        return;
      }
    }

    if (!medicationName.trim()) {
      showErrorAlert('입력 오류', '약 이름을 입력해주세요.');
      return;
    }
    if (selectedDays.length === 0) {
      showErrorAlert('선택 오류', '복약 요일을 하나 이상 선택해주세요.');
      return;
    }
    if (selectedMeals.length === 0) {
      showErrorAlert('선택 오류', '복용 끼니를 하나 이상 선택해주세요.');
      return;
    }

    // Validate times for selected meals
    for (const meal of selectedMeals) {
      if (!mealTimes[meal]) {
        showErrorAlert(
          '시간 입력 오류',
          `${mealOptions.find((o) => o.value === meal)?.label} 시간을 입력해주세요.`,
        );
        return;
      }
    }

    // Validate dates
    if (new Date(startDate) > new Date(endDate)) {
      showErrorAlert('날짜 오류', '시작일은 종료일보다 이전이거나 같아야 합니다.');
      return;
    }

    const timesPayload = selectedMeals.map((meal) => ({ meal, time: `${mealTimes[meal]}:00` }));
    try {
      if (initialData) {
        await updateMedicationSchedule(initialData.medicationId, {
          newMedicationName: medicationName.trim(),
          newTimes: timesPayload,
          newDays: selectedDays,
          newStartDate: startDate,
          newEndDate: endDate,
        });
        showSuccessAlert('수정 완료', '약 정보가 성공적으로 수정되었습니다.');
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
        showSuccessAlert(
          '등록 완료',
          selectedTarget === 'all'
            ? '모든 환자에게 약 정보가 성공적으로 등록되었습니다.'
            : '선택된 환자에게 약 정보가 성공적으로 등록되었습니다.',
        );
      }
      onClose();
    } catch (error) {
      console.error('Error submitting medication schedule:', error);
      showErrorAlert(
        '처리 실패',
        initialData
          ? '약 정보 수정에 실패했습니다.'
          : '약 정보 등록에 실패했습니다. 다시 시도해주세요.',
      );
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
              <Select
                value={selectedTarget}
                onChange={(e) => setSelectedTarget(e.target.value)}
                disabled={patients.length === 0} // Disable if no patients are available
              >
                {patients.length > 1 && <option value="all">전체</option>}
                {patients.map((p) => (
                  <option key={p.patientGuardianId} value={p.patientGuardianId}>
                    {p.name}
                  </option>
                ))}
                {patients.length === 0 && (
                  <option value="" disabled>
                    등록된 환자 없음
                  </option>
                )}
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
              placeholder="예: 타이레놀"
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
            .sort(
              (a, b) =>
                mealOptions.findIndex((opt) => opt.value === a.value) -
                mealOptions.findIndex((opt) => opt.value === b.value),
            )
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
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              max={endDate}
            />
          </Section>
          <Section>
            <SectionLabel>종료일</SectionLabel>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
            />
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

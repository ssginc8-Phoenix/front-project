import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Plus, X } from 'lucide-react';
import {
  createDoctorSchedules,
  deleteDoctorSchedule,
  getMyDoctorInfo,
  updateDoctorSchedule,
} from '~/features/doctor/api/doctorAPI';
import type { DoctorSchedule } from '~/types/doctor';

const dayOfWeekMap: Record<string, string> = {
  월요일: 'MONDAY',
  화요일: 'TUESDAY',
  수요일: 'WEDNESDAY',
  목요일: 'THURSDAY',
  금요일: 'FRIDAY',
  토요일: 'SATURDAY',
  일요일: 'SUNDAY',
};

const reverseDayOfWeekMap = Object.fromEntries(
  Object.entries(dayOfWeekMap).map(([kor, eng]) => [eng, kor]),
);

const timeOptions = Array.from({ length: 24 * 2 }, (_, i) => {
  const hour = String(Math.floor(i / 2)).padStart(2, '0');
  const minute = i % 2 === 0 ? '00' : '30';
  return { label: `${hour}:${minute}`, value: `${hour}:${minute}` };
});

interface HourRow {
  scheduleId?: number;
  day: string;
  open: string;
  close: string;
  lunchStart: string;
  lunchEnd: string;
}

const DoctorScheduleForm = () => {
  const [businessHours, setBusinessHours] = useState<HourRow[]>([]);
  const [doctorId, setDoctorId] = useState<number | null>(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      const res = await getMyDoctorInfo();
      setDoctorId(res.doctorId);

      if (res.schedules) {
        setBusinessHours(
          res.schedules.map((s: DoctorSchedule) => ({
            scheduleId: s.scheduleId,
            day: reverseDayOfWeekMap[s.dayOfWeek] || '',
            open: s.startTime.slice(0, 5),
            close: s.endTime.slice(0, 5),
            lunchStart: s.lunchStart?.slice(0, 5) || '',
            lunchEnd: s.lunchEnd?.slice(0, 5) || '',
          })),
        );
      }
    };
    fetchDoctor();
  }, []);

  const handleScheduleChange = (idx: number, key: keyof HourRow, value: string) => {
    setBusinessHours((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [key]: value };
      return updated;
    });
  };

  const handleRemoveSchedule = async (idx: number) => {
    const target = businessHours[idx];
    if (target.scheduleId && doctorId) {
      try {
        await deleteDoctorSchedule(doctorId, target.scheduleId);
      } catch (e) {
        console.error('삭제 실패:', e);
      }
    }
    setBusinessHours((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddSchedule = () => {
    const used = businessHours.map((b) => dayOfWeekMap[b.day]);
    const available = (Object.values(dayOfWeekMap) as string[]).find((d) => !used.includes(d));
    if (!available) return alert('모든 요일이 이미 등록되었습니다.');
    const kor = Object.entries(dayOfWeekMap).find(([, val]) => val === available)?.[0] ?? '';
    setBusinessHours((prev) => [
      ...prev,
      { day: kor, open: '', close: '', lunchStart: '', lunchEnd: '' },
    ]);
  };

  const handleSaveSchedules = async () => {
    if (!doctorId) return alert('의사 정보를 불러올 수 없습니다.');

    const toCreate = businessHours.filter((b) => !b.scheduleId);
    const toUpdate = businessHours.filter((b) => b.scheduleId);

    try {
      if (toCreate.length) {
        await createDoctorSchedules(
          doctorId,
          toCreate.map((b) => ({
            dayOfWeek: dayOfWeekMap[b.day],
            startTime: `${b.open}:00`,
            endTime: `${b.close}:00`,
            lunchStart: `${b.lunchStart}:00`,
            lunchEnd: `${b.lunchEnd}:00`,
          })),
        );
      }

      await Promise.all(
        toUpdate.map((b) =>
          updateDoctorSchedule(doctorId, b.scheduleId!, {
            dayOfWeek: dayOfWeekMap[b.day],
            startTime: `${b.open}:00`,
            endTime: `${b.close}:00`,
            lunchStart: `${b.lunchStart}:00`,
            lunchEnd: `${b.lunchEnd}:00`,
          }),
        ),
      );

      alert('저장 완료');
    } catch (e) {
      console.error('저장 실패:', e);
      alert('저장 실패');
    }
  };

  return (
    <Wrapper>
      <Title>🕒 진료시간 설정</Title>
      <BusinessHoursWrapper>
        {businessHours.map((row, idx) => (
          <DayRow key={idx}>
            <StyledSelect
              value={dayOfWeekMap[row.day]}
              onChange={(e) => {
                const kor = Object.entries(dayOfWeekMap).find(
                  ([, val]) => val === e.target.value,
                )?.[0];
                if (!kor) return;
                setBusinessHours((prev) => {
                  const updated = [...prev];
                  updated[idx] = { ...updated[idx], day: kor };
                  return updated;
                });
              }}
            >
              {Object.entries(dayOfWeekMap).map(([kor, eng]) => (
                <option key={eng} value={eng}>
                  {kor}
                </option>
              ))}
            </StyledSelect>

            {['open', 'close', 'lunchStart', 'lunchEnd'].map((key) => (
              <StyledTimeSelect
                key={key}
                value={row[key as keyof HourRow]}
                onChange={(e) => handleScheduleChange(idx, key as keyof HourRow, e.target.value)}
              >
                <option value="">시간 선택</option>
                {timeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </StyledTimeSelect>
            ))}
            <RemoveScheduleButton type="button" onClick={() => handleRemoveSchedule(idx)}>
              <X size={16} />
            </RemoveScheduleButton>
          </DayRow>
        ))}
        <AddScheduleButton type="button" onClick={handleAddSchedule}>
          <Plus size={16} style={{ marginRight: '4px' }} /> 진료시간 추가
        </AddScheduleButton>
        <SaveButton type="button" onClick={handleSaveSchedules}>
          저장하기
        </SaveButton>
      </BusinessHoursWrapper>
    </Wrapper>
  );
};

export default DoctorScheduleForm;

const Wrapper = styled.div`
  max-width: 700px;
  margin: 0 auto;
  padding: 3rem 2rem;
  font-family: 'Pretendard', sans-serif;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 2rem;
  text-align: center;
`;

const BusinessHoursWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DayRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: #f9fafb;
`;

const StyledSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
`;

const StyledTimeSelect = styled.select`
  width: 100px;
  padding: 0.4rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
`;

const RemoveScheduleButton = styled.button`
  background: transparent;
  border: none;
  color: #e11d48;
  cursor: pointer;
`;

const AddScheduleButton = styled.button`
  margin-top: 0.75rem;
  display: inline-flex;
  align-items: center;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 9999px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  &:hover {
    background: #2563eb;
  }
`;

const SaveButton = styled.button`
  margin-top: 1rem;
  background: linear-gradient(to right, #4f46e5, #4338ca);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 600;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: none;
  cursor: pointer;
  &:hover {
    background: linear-gradient(to right, #4338ca, #312e81);
  }
`;

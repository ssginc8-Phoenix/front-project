import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Plus, X } from 'lucide-react';
import {
  createDoctorSchedules,
  deleteDoctorSchedule,
  getDoctorSchedules,
  getMyDoctorInfo,
  updateDoctorSchedule,
} from '~/features/doctor/api/doctorAPI';

import type { HospitalSchedule } from '~/features/hospitals/types/hospitalSchedule';
import { getHospitalSchedules } from '~/features/hospitals/api/hospitalAPI';
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

const timeOptions = Array.from({ length: 48 }, (_, i) => {
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

const DoctorScheduleForm: React.FC = () => {
  const [businessHours, setBusinessHours] = useState<HourRow[]>([]);
  const [doctorId, setDoctorId] = useState<number | null>(null);
  const [hospitalHours, setHospitalHours] = useState<HospitalSchedule[]>([]);

  // 초기 로딩
  useEffect(() => {
    (async () => {
      const doc = await getMyDoctorInfo();
      setDoctorId(doc.doctorId);

      const hospSched = await getHospitalSchedules(doc.hospitalId);
      console.log('getHospitalSchedules response:', hospSched);
      setHospitalHours(hospSched);

      const sched: DoctorSchedule[] = await getDoctorSchedules(doc.doctorId);
      console.log('getDoctorSchedules response:', sched);

      // 1) 한글요일 배열
      const korDays = Object.keys(dayOfWeekMap) as (keyof typeof dayOfWeekMap)[];

      // 2) 각 요일에 대해, 기존 스케줄이 있으면 그 값으로, 아니면 빈 칸으로 초기화
      // 초기 Rows 생성부
      const initialRows: HourRow[] = korDays.map((kor) => {
        const eng = dayOfWeekMap[kor];
        const found = sched.find((s) => s.dayOfWeek === eng);
        return {
          scheduleId: found?.scheduleId,
          day: kor,
          open: found?.startTime.slice(0, 5) ?? '',
          close: found?.endTime.slice(0, 5) ?? '',
          lunchStart: found?.lunchStart?.slice(0, 5) ?? '',
          lunchEnd: found?.lunchEnd?.slice(0, 5) ?? '',
        };
      });

      setBusinessHours(initialRows);
    })();
  }, []);

  const handleAdd = () => {
    const used = businessHours.map((b) => dayOfWeekMap[b.day]);
    const avail = Object.values(dayOfWeekMap).find((d) => !used.includes(d));
    if (!avail) return alert('모든 요일이 등록되었습니다.');
    const kor = Object.entries(dayOfWeekMap).find(([, e]) => e === avail)![0];
    setBusinessHours((prev) => [
      ...prev,
      { day: kor, open: '', close: '', lunchStart: '', lunchEnd: '' },
    ]);
  };

  const handleRemove = async (idx: number) => {
    const t = businessHours[idx];
    if (t.scheduleId && doctorId) {
      await deleteDoctorSchedule(doctorId, t.scheduleId).catch(() => alert('삭제 실패'));
    }
    setBusinessHours((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    if (!doctorId) {
      alert('의사 정보를 불러올 수 없습니다.');
      return;
    }

    // — 보낼 유효한 로우만 걸러내기 —
    const validRows = businessHours.filter((b) => b.open.trim() !== '' && b.close.trim() !== '');

    // 생성할 것 / 업데이트할 것 분리
    const toCreate = validRows.filter((b) => !b.scheduleId);
    const toUpdate = validRows.filter((b) => !!b.scheduleId);

    let errorOccurred = false;

    // 새로 추가된 스케줄 생성
    if (toCreate.length) {
      try {
        const payload = toCreate.map((b) => {
          return {
            dayOfWeek: dayOfWeekMap[b.day],
            startTime: `${b.open}:00`,
            endTime: `${b.close}:00`,
            // lunchStart/lunchEnd이 빈 문자열이면 null로
            lunchStart: b.lunchStart ? `${b.lunchStart}:00` : null,
            lunchEnd: b.lunchEnd ? `${b.lunchEnd}:00` : null,
          };
        });

        await createDoctorSchedules(doctorId, payload);
      } catch (e) {
        console.error(e);
        errorOccurred = true;
        alert('생성 실패');
      }
    }

    // 기존 스케줄 업데이트
    if (toUpdate.length) {
      await Promise.all(
        toUpdate.map(async (b) => {
          try {
            await updateDoctorSchedule(doctorId, b.scheduleId!, {
              dayOfWeek: dayOfWeekMap[b.day],
              startTime: `${b.open}:00`,
              endTime: `${b.close}:00`,
              lunchStart: b.lunchStart ? `${b.lunchStart}:00` : null,
              lunchEnd: b.lunchEnd ? `${b.lunchEnd}:00` : null,
            });
          } catch (e) {
            console.error(e);
            errorOccurred = true;
            alert('업데이트 실패');
          }
        }),
      );
    }

    if (!errorOccurred) {
      alert('저장 완료');
    }
  };

  return (
    <Wrapper>
      <Title>🕒 진료시간 설정</Title>
      <BusinessHoursWrapper>
        {businessHours.map((row, idx) => {
          // ① 해당 요일 병원 스케줄 찾기
          const eng = dayOfWeekMap[row.day] as keyof typeof dayOfWeekMap;
          const hs = hospitalHours.find((h) => h.dayOfWeek === eng);
          const isDisabled = !hs;
          // ② 허용되는 값 집합
          const allowedSet = new Set(
            hs
              ? timeOptions
                  .filter(
                    (o) =>
                      o.value >= hs.openTime.slice(0, 5) && o.value <= hs.closeTime.slice(0, 5),
                  )
                  .map((o) => o.value)
              : timeOptions.map((o) => o.value),
          );
          const allowedLunchSet = new Set(
            hs && hs.lunchStart && hs.lunchEnd
              ? (() => {
                  const start = hs.lunchStart.slice(0, 5);
                  const end = hs.lunchEnd.slice(0, 5);
                  return timeOptions
                    .filter((o) => o.value >= start && o.value <= end)
                    .map((o) => o.value);
                })()
              : Array.from(allowedSet), // null일 땐 영업시간 전체 허용
          );

          return (
            <DayRow key={idx}>
              <StyledSelect
                disabled={isDisabled}
                value={dayOfWeekMap[row.day]}
                onChange={(e) => {
                  const kor = Object.entries(dayOfWeekMap).find(
                    ([, v]) => v === e.target.value,
                  )![0];
                  setBusinessHours((prev) => {
                    const c = [...prev];
                    c[idx].day = kor;
                    return c;
                  });
                }}
              >
                {Object.entries(dayOfWeekMap).map(([kor, eng]) => (
                  <option key={eng} value={eng}>
                    {kor}
                  </option>
                ))}
              </StyledSelect>

              <LabelText>진료:</LabelText>
              <StyledSelect
                disabled={isDisabled}
                value={row.open}
                onChange={(e) => {
                  const value = e.target.value; // "HH:mm" 그대로
                  setBusinessHours((prev) => {
                    const copy = [...prev];
                    copy[idx] = { ...copy[idx], open: value };
                    return copy;
                  });
                }}
              >
                <option value="">시작</option>
                {timeOptions.map((o) => (
                  <option key={o.value} value={o.value} disabled={!allowedSet.has(o.value)}>
                    {o.label}
                  </option>
                ))}
              </StyledSelect>

              <StyledSelect
                disabled={isDisabled}
                value={row.close}
                onChange={(e) => {
                  const value = e.target.value; // "HH:mm" 그대로
                  setBusinessHours((prev) => {
                    const copy = [...prev];
                    copy[idx] = { ...copy[idx], close: value };
                    return copy;
                  });
                }}
              >
                <option value="">종료</option>
                {timeOptions.map((o) => (
                  <option key={o.value} value={o.value} disabled={!allowedSet.has(o.value)}>
                    {o.label}
                  </option>
                ))}
              </StyledSelect>

              <LabelText>점심:</LabelText>
              <StyledSelect
                disabled={isDisabled}
                value={row.lunchStart}
                onChange={(e) => {
                  const value = e.target.value; // "HH:mm" 그대로
                  setBusinessHours((prev) => {
                    const copy = [...prev];
                    copy[idx] = { ...copy[idx], lunchStart: value };
                    return copy;
                  });
                }}
              >
                <option value="">시작</option>
                {timeOptions.map((o) => (
                  <option key={o.value} value={o.value} disabled={!allowedLunchSet.has(o.value)}>
                    {o.label}
                  </option>
                ))}
              </StyledSelect>

              <StyledSelect
                disabled={isDisabled}
                value={row.lunchEnd}
                onChange={(e) => {
                  const value = e.target.value; // "HH:mm" 그대로
                  setBusinessHours((prev) => {
                    const copy = [...prev];
                    copy[idx] = { ...copy[idx], lunchEnd: value };
                    return copy;
                  });
                }}
              >
                <option value="">종료</option>
                {timeOptions.map((o) => (
                  <option key={o.value} value={o.value} disabled={!allowedLunchSet.has(o.value)}>
                    {o.label}
                  </option>
                ))}
              </StyledSelect>

              <RemoveScheduleButton onClick={() => handleRemove(idx)}>
                <X size={16} />
              </RemoveScheduleButton>
            </DayRow>
          );
        })}

        <AddScheduleButton onClick={handleAdd}>
          <Plus size={16} /> 진료시간 추가
        </AddScheduleButton>
        <SaveButton onClick={handleSave}>저장하기</SaveButton>
      </BusinessHoursWrapper>
    </Wrapper>
  );
};

export default DoctorScheduleForm;

/* Styled Components */
const Wrapper = styled.div`
  max-width: 770px;
  margin: 0 auto;
  padding: 3rem 2rem;
  font-family: 'Pretendard', sans-serif;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
`;
const BusinessHoursWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DayRow = styled.div<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: ${({ disabled }) => (disabled ? '#f3f4f6' : '#f9fafb')};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;

const StyledSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: ${({ disabled }) => (disabled ? '#e5e7eb' : 'white')};

  option:disabled {
    color: #999;
  }
`;
const LabelText = styled.span`
  margin: 0 0.5rem;
  font-weight: 500;
`;
const RemoveScheduleButton = styled.button`
  background: transparent;
  border: none;
  color: #e11d48;
  cursor: pointer;
`;
const AddScheduleButton = styled.button`
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 9999px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  &:hover {
    background: #2563eb;
  }
`;
const SaveButton = styled.button`
  align-self: flex-start;
  margin-top: 0.5rem;
  background: linear-gradient(to right, #4f46e5, #4338ca);
  color: #fff;
  padding: 0.6rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background: linear-gradient(to right, #4338ca, #312e81);
  }
`;

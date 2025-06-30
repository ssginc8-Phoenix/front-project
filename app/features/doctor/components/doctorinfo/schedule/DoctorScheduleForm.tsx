import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
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
import { useMediaQuery } from '~/features/hospitals/hooks/useMediaQuery';

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
  const [openAccordion, setOpenAccordion] = useState<boolean[]>([]);
  const [doctorId, setDoctorId] = useState<number | null>(null);
  const [hospitalHours, setHospitalHours] = useState<HospitalSchedule[]>([]);
  const isMobile = useMediaQuery('(max-width: 768px)');

  // 1) 초기 로딩
  useEffect(() => {
    (async () => {
      const doc = await getMyDoctorInfo();
      setDoctorId(doc.doctorId);

      const hospSched = await getHospitalSchedules(doc.hospitalId);
      setHospitalHours(hospSched);

      const sched: DoctorSchedule[] = await getDoctorSchedules(doc.doctorId);
      const korDays = Object.keys(dayOfWeekMap) as (keyof typeof dayOfWeekMap)[];
      const initialRows = korDays.map((kor) => {
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

  // 2) businessHours 변경 시 아코디언 초기화
  useEffect(() => {
    setOpenAccordion(businessHours.map(() => false));
  }, [businessHours]);

  const toggleAccordion = (idx: number) => {
    setOpenAccordion((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  const handleAdd = () => {
    const used = businessHours.map((b) => dayOfWeekMap[b.day]);
    const avail = Object.values(dayOfWeekMap).find((d) => !used.includes(d));
    if (!avail) return alert('모든 요일이 등록되었습니다.');
    const kor = Object.entries(dayOfWeekMap).find(([, e]) => e === avail)![0];
    setBusinessHours((p) => [
      ...p,
      { day: kor, open: '', close: '', lunchStart: '', lunchEnd: '' },
    ]);
  };

  const handleRemove = async (idx: number) => {
    const t = businessHours[idx];
    if (t.scheduleId && doctorId) {
      await deleteDoctorSchedule(doctorId, t.scheduleId).catch(() => alert('삭제 실패'));
    }
    setBusinessHours((p) => p.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    if (!doctorId) return alert('의사 정보를 불러올 수 없습니다.');
    const valid = businessHours.filter((b) => b.open && b.close);
    const toCreate = valid.filter((b) => !b.scheduleId);
    const toUpdate = valid.filter((b) => !!b.scheduleId);
    let err = false;

    if (toCreate.length) {
      try {
        const payload = toCreate.map((b) => ({
          dayOfWeek: dayOfWeekMap[b.day],
          startTime: `${b.open}:00`,
          endTime: `${b.close}:00`,
          lunchStart: b.lunchStart ? `${b.lunchStart}:00` : null,
          lunchEnd: b.lunchEnd ? `${b.lunchEnd}:00` : null,
        }));
        await createDoctorSchedules(doctorId, payload);
      } catch {
        err = true;
        alert('생성 실패');
      }
    }

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
          } catch {
            err = true;
            alert('업데이트 실패');
          }
        }),
      );
    }

    if (!err) alert('저장 완료');
  };

  return (
    <Wrapper>
      <BusinessHoursWrapper>
        {businessHours.map((row, idx) => {
          const eng = dayOfWeekMap[row.day] as keyof typeof dayOfWeekMap;
          const hs = hospitalHours.find((h) => h.dayOfWeek === eng);
          const disabled = !hs;
          const allowed = new Set(
            hs
              ? timeOptions
                  .filter(
                    (o) =>
                      o.value >= hs.openTime.slice(0, 5) && o.value <= hs.closeTime.slice(0, 5),
                  )
                  .map((o) => o.value)
              : timeOptions.map((o) => o.value),
          );
          const lunchAllowed = new Set(
            hs && hs.lunchStart && hs.lunchEnd
              ? timeOptions
                  .filter(
                    (o) =>
                      o.value >= hs.lunchStart.slice(0, 5) && o.value <= hs.lunchEnd.slice(0, 5),
                  )
                  .map((o) => o.value)
              : Array.from(allowed),
          );

          if (!isMobile) {
            // PC: 기존 풀 로우 UI
            return (
              <DayRow key={idx} disabled={disabled}>
                <StyledSelect
                  disabled={disabled}
                  value={dayOfWeekMap[row.day]}
                  onChange={(e) => {
                    const kor = Object.entries(dayOfWeekMap).find(
                      ([, v]) => v === e.target.value,
                    )![0];
                    setBusinessHours((p) => {
                      const c = [...p];
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
                  disabled={disabled}
                  value={row.open}
                  onChange={(e) =>
                    setBusinessHours((p) => {
                      const c = [...p];
                      c[idx].open = e.target.value;
                      return c;
                    })
                  }
                >
                  <option value="">시작</option>
                  {timeOptions.map((o) => (
                    <option key={o.value} value={o.value} disabled={!allowed.has(o.value)}>
                      {o.label}
                    </option>
                  ))}
                </StyledSelect>

                <StyledSelect
                  disabled={disabled}
                  value={row.close}
                  onChange={(e) =>
                    setBusinessHours((p) => {
                      const c = [...p];
                      c[idx].close = e.target.value;
                      return c;
                    })
                  }
                >
                  <option value="">종료</option>
                  {timeOptions.map((o) => (
                    <option key={o.value} value={o.value} disabled={!allowed.has(o.value)}>
                      {o.label}
                    </option>
                  ))}
                </StyledSelect>

                <LabelText>점심:</LabelText>
                <StyledSelect
                  disabled={disabled}
                  value={row.lunchStart}
                  onChange={(e) =>
                    setBusinessHours((p) => {
                      const c = [...p];
                      c[idx].lunchStart = e.target.value;
                      return c;
                    })
                  }
                >
                  <option value="">시작</option>
                  {timeOptions.map((o) => (
                    <option key={o.value} value={o.value} disabled={!lunchAllowed.has(o.value)}>
                      {o.label}
                    </option>
                  ))}
                </StyledSelect>

                <StyledSelect
                  disabled={disabled}
                  value={row.lunchEnd}
                  onChange={(e) =>
                    setBusinessHours((p) => {
                      const c = [...p];
                      c[idx].lunchEnd = e.target.value;
                      return c;
                    })
                  }
                >
                  <option value="">종료</option>
                  {timeOptions.map((o) => (
                    <option key={o.value} value={o.value} disabled={!lunchAllowed.has(o.value)}>
                      {o.label}
                    </option>
                  ))}
                </StyledSelect>

                <RemoveScheduleButton onClick={() => handleRemove(idx)}>
                  <X size={16} />
                </RemoveScheduleButton>
              </DayRow>
            );
          } else {
            // Mobile: PC와 동일한 셀렉트 UI
            return (
              <AccordionRow key={idx}>
                <AccordionHeader onClick={() => toggleAccordion(idx)}>
                  {row.day}
                  {openAccordion[idx] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </AccordionHeader>
                <AccordionPanel open={openAccordion[idx]}>
                  {/* 진료 */}
                  <FieldRow>
                    <FieldGroup>
                      <Label>진료:</Label>
                      <StyledSelect
                        disabled={disabled}
                        value={row.open}
                        onChange={(e) => {
                          const v = e.target.value;
                          setBusinessHours((p) => {
                            const c = [...p];
                            c[idx].open = v;
                            return c;
                          });
                        }}
                      >
                        <option value="">시작</option>
                        {timeOptions.map((o) => (
                          <option key={o.value} value={o.value} disabled={!allowed.has(o.value)}>
                            {o.label}
                          </option>
                        ))}
                      </StyledSelect>
                      <Separator>~</Separator>
                      <StyledSelect
                        disabled={disabled}
                        value={row.close}
                        onChange={(e) => {
                          const v = e.target.value;
                          setBusinessHours((p) => {
                            const c = [...p];
                            c[idx].close = v;
                            return c;
                          });
                        }}
                      >
                        <option value="">종료</option>
                        {timeOptions.map((o) => (
                          <option key={o.value} value={o.value} disabled={!allowed.has(o.value)}>
                            {o.label}
                          </option>
                        ))}
                      </StyledSelect>
                    </FieldGroup>
                  </FieldRow>

                  {/* 점심 */}
                  <FieldRow>
                    <FieldGroup>
                      <Label>점심:</Label>
                      <StyledSelect
                        disabled={disabled}
                        value={row.lunchStart}
                        onChange={(e) => {
                          const v = e.target.value;
                          setBusinessHours((p) => {
                            const c = [...p];
                            c[idx].lunchStart = v;
                            return c;
                          });
                        }}
                      >
                        <option value="">시작</option>
                        {timeOptions.map((o) => (
                          <option
                            key={o.value}
                            value={o.value}
                            disabled={!lunchAllowed.has(o.value)}
                          >
                            {o.label}
                          </option>
                        ))}
                      </StyledSelect>
                      <Separator>~</Separator>
                      <StyledSelect
                        disabled={disabled}
                        value={row.lunchEnd}
                        onChange={(e) => {
                          const v = e.target.value;
                          setBusinessHours((p) => {
                            const c = [...p];
                            c[idx].lunchEnd = v;
                            return c;
                          });
                        }}
                      >
                        <option value="">종료</option>
                        {timeOptions.map((o) => (
                          <option
                            key={o.value}
                            value={o.value}
                            disabled={!lunchAllowed.has(o.value)}
                          >
                            {o.label}
                          </option>
                        ))}
                      </StyledSelect>
                    </FieldGroup>
                    <RemoveScheduleButton onClick={() => handleRemove(idx)}>
                      <X size={16} />
                    </RemoveScheduleButton>
                  </FieldRow>
                </AccordionPanel>
              </AccordionRow>
            );
          }
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

/* ─── Styled Components ───────────────────────────────── */
const Wrapper = styled.div`
  max-width: 770px;
  margin: 0 auto;
  padding: 3rem 2rem;
  font-family: 'Pretendard', sans-serif;
  @media (max-width: 768px) {
    padding: 1.5rem 1rem; /* → 좌우 패딩 절반으로 */
  }
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
  background: ${({ disabled }) => (disabled ? '#f3f4f6' : '#fff')};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;

const StyledSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
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

/* Accordion */
const AccordionRow = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
  @media (max-width: 768px) {
    width: 90%;
    margin: 0 auto;
    box-sizing: border-box;
  }
`;

const AccordionHeader = styled.button.attrs({ type: 'button' })`
  width: 100%;
  padding: 0.5rem;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
`;

const AccordionPanel = styled.div<{ open: boolean }>`
  max-height: ${({ open }) => (open ? '500px' : '0')};
  opacity: ${({ open }) => (open ? 1 : 0)};
  padding: ${({ open }) => (open ? '0.5rem 0' : '0 0')};
  overflow: hidden;
  background: #f9fafb;
  transition:
    max-height 0.3s,
    padding 0.3s,
    opacity 0.3s;
`;

/* 모바일용 개선된 Row */
const FieldRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: #fff;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  &:last-child {
    margin-bottom: 0;
  }
  @media (max-width: 768px) {
    padding: 0.1em; /* → padding 통일, 좌우 줄이기 */
  }
`;

const FieldGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Label = styled.span`
  font-weight: 600;
  min-width: 3.5rem;
`;

const Separator = styled.span`
  font-size: 1rem;
  color: #6b7280;
`;

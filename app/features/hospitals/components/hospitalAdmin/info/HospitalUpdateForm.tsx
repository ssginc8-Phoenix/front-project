import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { X, Plus } from 'lucide-react';
import {
  registerHospital,
  updateHospital,
  getMyHospital,
  getHospitalSchedules,
  updateHospitalSchedules,
  createHospitalSchedule,
  createWaiting,
} from '~/features/hospitals/api/hospitalAPI';
import HospitalDaumPost from '~/features/hospitals/components/hospitalAdmin/info/HospitalDaumPost';

import type { CreateScheduleRequest, HospitalForm } from '~/features/hospitals/types/hospital';
import WaitModal from '~/features/hospitals/components/RegisterWaitModal';
import type { ScheduleDTO } from '~/features/hospitals/types/hospitalSchedule';

interface HourRow {
  hospitalScheduleId?: number;
  day: string;
  open: string;
  close: string;
  lunchStart: string;
  lunchEnd: string;
}
interface PreviewItem {
  id?: number; // 서버에 이미 저장된 파일이면 id
  file?: File; // 새로 선택한 파일이면 file
  url: string; // 미리보기 URL
}
const dayOfWeekMap: Record<string, CreateScheduleRequest['dayOfWeek']> = {
  월요일: 'MONDAY',
  화요일: 'TUESDAY',
  수요일: 'WEDNESDAY',
  목요일: 'THURSDAY',
  금요일: 'FRIDAY',
  토요일: 'SATURDAY',
  일요일: 'SUNDAY',
};

const mapDayOfWeekBack = (d: CreateScheduleRequest['dayOfWeek']) =>
  Object.keys(dayOfWeekMap).find((key) => dayOfWeekMap[key] === d) || '';
const timeOptions = Array.from({ length: 24 * 2 }, (_, i) => {
  const hour = String(Math.floor(i / 2)).padStart(2, '0');
  const minute = i % 2 === 0 ? '00' : '30';
  return { label: `${hour}:${minute}`, value: `${hour}:${minute}` };
});
export const ServiceInputChips: React.FC<{
  services: string[];
  onChange: (arr: string[]) => void;
}> = ({ services, onChange }) => {
  const [adding, setAdding] = useState(false);
  const [tempValue, setTempValue] = useState('');
  const handleAdd = () => {
    if (tempValue.trim()) onChange([...services, tempValue.trim()]);
    setTempValue('');
    setAdding(false);
  };
  return (
    <ChipsWrapper>
      {services.map((s, i) => (
        <Chip key={s}>
          {s}
          <RemoveButton
            type="button"
            onClick={() =>
              // i번째 서비스만 삭제
              onChange(services.filter((_, idx) => idx !== i))
            }
          >
            <X size={14} />
          </RemoveButton>
        </Chip>
      ))}
      {adding ? (
        <NewServiceInput
          autoFocus
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleAdd}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
      ) : (
        <AddButton type="button" onClick={() => setAdding(true)}>
          <Plus size={14} style={{ marginRight: 4 }} /> 서비스 추가
        </AddButton>
      )}
    </ChipsWrapper>
  );
};

const FileInput = styled.input`
  display: none;
`;

const PreviewImage = styled.img`
  width: 150px;
  max-height: 200px;
  object-fit: cover;
  margin-top: 0.5rem;
  border-radius: 0.5rem;
  background: #fff;
`;

const HospitalUpdateForm: React.FC = () => {
  const [hospitalId, setHospitalId] = useState<string | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [, setExistingFileIds] = useState<number[]>([]);
  const [, setPreviewUrls] = useState<string[]>([]);
  const [deletedFileIds, setDeletedFileIds] = useState<number[]>([]);
  const [previewItems, setPreviewItems] = useState<PreviewItem[]>([]);
  const nameRef = useRef<HTMLInputElement>(null);
  const businessNumberRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: '',
    address: '',
    detailAddress: '',
    phoneNumber: '',
    businessNumber: '',
    intro: '',
    notice: '',
    serviceName: [] as string[],
    imageUrls: [] as string[],
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    businessNumber: '',
    address: '',
    phoneNumber: '',
  });
  const [coords, setCoords] = useState({ lat: 0, lng: 0 });
  const [businessHours, setBusinessHours] = useState<HourRow[]>(
    Object.keys(dayOfWeekMap).map((day) => ({
      day,
      open: '',
      close: '',
      lunchStart: '',
      lunchEnd: '',
    })),
  );
  // 이미지 삭제 시
  const handleRemoveImage = (idx: number) => {
    setPreviewItems((prev) => {
      const removed = prev[idx];
      if (removed.id != null) {
        setDeletedFileIds((ids) => Array.from(new Set([...ids, removed.id!])));
      }
      return prev.filter((_, i) => i !== idx);
    });
  };

  // 2) 스케줄 변경 핸들러: businessHours 배열의 idx번째 HourRow에서 key(open/close/lunchStart/lunchEnd)만 바꿔줌
  const handleScheduleChange = (idx: number, key: keyof HourRow, value: string) => {
    setBusinessHours((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [key]: value };
      return updated;
    });
  };
  // 3) 대기 인원 등록 핸들러: 모달에서 입력받은 숫자를 API로 보내고 모달 닫기
  const handleRegisterWaiting = async (count: number) => {
    if (!hospitalId) return;
    try {
      await createWaiting(Number(hospitalId), count);
      alert(`대기 인원 ${count}명 등록 완료`);
      setIsModalOpen(false);
    } catch (err) {
      console.error('대기 등록 에러', err);
      alert('대기 등록에 실패했습니다.');
    }
  };
  const handleChange =
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };
  useEffect(() => {
    (async () => {
      const d = await getMyHospital();
      const oldItems: PreviewItem[] = (d.imageUrls ?? []).map((url, i) => ({
        id: d.fileIds?.[i],
        url,
      }));
      setPreviewItems(oldItems);
      if (!d) return;

      setPreviewItems(oldItems);
      setHospitalId(String(d.hospitalId));
      setIsEdit(true);
      const [addr, detail] = splitAddr(d.address || '');
      setForm({
        name: d.name || '',
        address: addr,
        detailAddress: detail,
        phoneNumber: d.phone || '',
        businessNumber: d.businessRegistrationNumber || '',
        intro: d.introduction || '',
        notice: d.notice || '',
        serviceName: d.serviceNames || [],
        imageUrls: d.imageUrls || [],
      });
      setCoords({ lat: d.latitude || 0, lng: d.longitude || 0 });
      setExistingFileIds(d.fileIds || []);
      setPreviewUrls(d.imageUrls || []);
      const sch = await getHospitalSchedules(d.hospitalId);
      console.log('[getMyHospital] raw schedules:', sch);
      setBusinessHours(mapSchedules(sch));
    })();
  }, []);

  // 파일 선택 핸들러
  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newItems = Array.from(e.target.files).map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setPreviewItems((prev) => [...prev, ...newItems]);
  };

  const handleAddressChange = (full: string) => {
    const [addr, detail] = splitAddr(full); // splitAddr은 "xxx) 상세" 식으로 나눠주는 유틸
    setForm((prev) => ({
      ...prev,
      address: addr,
      detailAddress: detail,
    }));
  };
  const buildFormData = () => {
    const fd = new FormData();
    const dataBlob = new Blob(
      [
        JSON.stringify({
          userId: localStorage.getItem('userId'),
          name: form.name,
          address: `${form.address} ${form.detailAddress}`,
          latitude: coords.lat,
          longitude: coords.lng,
          phone: form.phoneNumber,
          introduction: form.intro,
          notice: form.notice,
          serviceNames: form.serviceName,
          businessRegistrationNumber: form.businessNumber,
          existingFileIds: previewItems.filter((i) => i.id).map((i) => i.id),
          deletedFileIds,
        }),
      ],
      { type: 'application/json' },
    );
    fd.append('data', dataBlob);
    previewItems.filter((i) => i.file).forEach((i) => fd.append('files', i.file!));
    return fd;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateHours(businessHours)) return;
    const errs = validateForm(form);
    if (Object.values(errs).some(Boolean)) {
      setFormErrors(errs);

      // 에러 필드에 포커스
      if (errs.name) {
        nameRef.current?.focus();
      } else if (errs.businessNumber) {
        businessNumberRef.current?.focus();
      } else if (errs.address) {
        // HospitalDaumPost 내부 input에 ref 전달이 안 돼 있으면,
        // 해당 컴포넌트에 `inputRef={addressRef}` 같은 prop을 추가해 주세요.
        addressRef.current?.focus();
      } else if (errs.phoneNumber) {
        phoneRef.current?.focus();
      }

      return;
    }
    const fd = buildFormData();
    try {
      let id = Number(hospitalId);
      if (isEdit) {
        await updateHospital(id, fd);
      } else {
        const { hospitalId: newId } = await registerHospital(fd);
        id = newId;
        setHospitalId(String(id));
        setIsEdit(true);
      }

      const [up, cr] = splitSchedules(businessHours);
      if (up.length) await updateHospitalSchedules(id, up);
      if (cr.length) await Promise.all(cr.map((c) => createHospitalSchedule(id, c)));
      alert(isEdit ? '수정 완료' : '등록 완료');
    } catch {
      alert('저장 중 오류가 발생했습니다.');
    }
    console.group('%c[HospitalUpdate] Request payload', 'color: #4f46e5; font-weight: bold;');
    console.log(
      '  • 유지할 기존 파일 IDs:',
      previewItems.filter((i) => i.id).map((i) => i.id),
    );
    console.log('  • 삭제할 파일 IDs:', deletedFileIds);
    console.log(
      '  • 업로드할 새 파일 객체들:',
      previewItems.filter((i) => i.file).map((i) => i.file),
    );
    console.log('  • raw FormData entries:');
    for (const [key, value] of fd.entries()) {
      console.log(`     – ${key}:`, value);
    }
    console.groupEnd();
  };

  const handleRemoveSchedule = (idx: number) => {
    setBusinessHours((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddSchedule = () => {
    const used = businessHours.map((b) => dayOfWeekMap[b.day]);
    const available = (Object.values(dayOfWeekMap) as CreateScheduleRequest['dayOfWeek'][]).find(
      (d) => !used.includes(d),
    );
    if (!available) return alert('모든 요일이 이미 등록되었습니다.');
    const kor = Object.entries(dayOfWeekMap).find(([, val]) => val === available)?.[0] || '';
    setBusinessHours((prev) => [
      ...prev,
      { day: kor, open: '', close: '', lunchStart: '', lunchEnd: '' },
    ]);
  };
  return (
    <Form onSubmit={handleSubmit}>
      <FieldWrapper>
        <Label>병원 이미지</Label>
        <FileInput
          id="hospitalImage"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFilesChange}
        />
        <FileLabel htmlFor="hospitalImage">이미지 선택</FileLabel>
        <ThumbnailsRow>
          {previewItems.map((item, idx) => (
            <ThumbnailWrapper
              key={idx}
              onClick={() => {
                if (item.id != null) {
                  alert(`File ID: ${item.id}`);
                } else {
                  alert('새로 업로드된 파일입니다.');
                }
              }}
            >
              <PreviewImage src={item.url} />
              <RemoveThumbnailButton
                onClick={(e) => {
                  e.stopPropagation(); // 클릭 전파 막기
                  handleRemoveImage(idx);
                }}
              >
                ×
              </RemoveThumbnailButton>
            </ThumbnailWrapper>
          ))}
        </ThumbnailsRow>
      </FieldWrapper>
      <FieldWrapper>
        <Label>병원 명</Label>
        <Input
          ref={nameRef}
          value={form.name}
          onChange={handleChange('name')}
          placeholder="병원명을 입력하세요"
        />
        {formErrors.name && <ErrorMessage>{formErrors.name}</ErrorMessage>}
      </FieldWrapper>
      <FieldWrapper>
        <Label>사업자 번호</Label>
        <Input
          ref={businessNumberRef}
          value={form.businessNumber}
          onChange={handleChange('businessNumber')}
          placeholder="숫자만 입력하세요"
          readOnly={isEdit}
        />
        {formErrors.businessNumber && <ErrorMessage>{formErrors.businessNumber}</ErrorMessage>}
      </FieldWrapper>
      <FieldWrapper>
        <Label>주소</Label>
        <HospitalDaumPost
          address={form.address}
          setAddress={handleAddressChange}
          setCoords={setCoords}
        />
        {formErrors.address && <ErrorMessage>{formErrors.address}</ErrorMessage>}
      </FieldWrapper>
      <FieldWrapper>
        <Label>상세주소</Label>
        <Input
          value={form.detailAddress}
          onChange={(e) => setForm((prev) => ({ ...prev, detailAddress: e.target.value }))}
        />
      </FieldWrapper>
      <FieldWrapper>
        <Label>전화번호</Label>
        <Input
          ref={phoneRef}
          inputMode="numeric"
          value={form.phoneNumber}
          onChange={(e) => {
            let raw = e.target.value.replace(/\D/g, ''); // 숫자만
            let formatted = '';

            // 1) 0507: 0507-1234-1234 (4-4-4, 총 12자리 숫자)
            if (raw.startsWith('0507')) {
              raw = raw.slice(0, 12);
              if (raw.length <= 4) {
                formatted = raw;
              } else if (raw.length <= 8) {
                formatted = `${raw.slice(0, 4)}-${raw.slice(4)}`;
              } else {
                formatted = `${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8)}`;
              }

              // 2) 02: 02-123-1234 (2-3-4, 총 9자리 숫자)
            } else if (raw.startsWith('02')) {
              raw = raw.slice(0, 9);
              if (raw.length <= 2) {
                formatted = raw;
              } else if (raw.length <= 5) {
                formatted = `${raw.slice(0, 2)}-${raw.slice(2)}`;
              } else {
                formatted = `${raw.slice(0, 2)}-${raw.slice(2, 5)}-${raw.slice(5)}`;
              }

              // 3) 010: 010-1234-1234 (3-4-4, 총 11자리 숫자)
            } else if (raw.startsWith('010')) {
              raw = raw.slice(0, 11);
              if (raw.length <= 3) {
                formatted = raw;
              } else if (raw.length <= 7) {
                formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`;
              } else {
                formatted = `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7)}`;
              }

              // 4) 그 외 3자리 국번 (예: 051): 051-123-1234 (3-3-4, 총 10자리 숫자)
            } else if (/^0\d{2}/.test(raw)) {
              raw = raw.slice(0, 10);
              if (raw.length <= 3) {
                formatted = raw;
              } else if (raw.length <= 6) {
                formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`;
              } else {
                formatted = `${raw.slice(0, 3)}-${raw.slice(3, 6)}-${raw.slice(6)}`;
              }

              // 5) 나머지 잘못된 국번은 숫자만 자르고 하이픈 없이
            } else {
              raw = raw.slice(0, 11);
              formatted = raw;
            }

            setForm((prev) => ({
              ...prev,
              phoneNumber: formatted,
            }));
          }}
          placeholder="예: 010-1234-5678"
        />

        {formErrors.phoneNumber && <ErrorMessage>{formErrors.phoneNumber}</ErrorMessage>}
      </FieldWrapper>
      <FieldWrapper>
        <Label>소개글</Label>
        <Input
          as="textarea"
          rows={3}
          value={form.intro}
          onChange={handleChange('intro')}
          placeholder="병원에 대한 소개글을 입력하세요"
        />
      </FieldWrapper>
      <FieldWrapper>
        <Label>공지사항</Label>
        <Input
          as="textarea"
          rows={3}
          value={form.notice}
          onChange={handleChange('notice')}
          placeholder="병원 공지사항을 입력하세요"
        />
      </FieldWrapper>

      <FieldWrapper>
        <Label>서비스 이름</Label>
        <ServiceInputChips
          services={form.serviceName}
          onChange={(arr) => setForm((prev) => ({ ...prev, serviceName: arr }))}
        />
      </FieldWrapper>
      <BusinessHoursWrapper>
        <Label>진료시간</Label>
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
            <span style={{ fontWeight: 500 }}>진료:</span>
            {/* 오픈/종료 (input type="time" 적용) */}
            <InputTime
              type="time"
              step="1800"
              value={row.open}
              onChange={(e) => handleScheduleChange(idx, 'open', e.target.value)}
            />
            <Separator>~</Separator>
            <InputTime
              type="time"
              step="1800"
              value={row.close}
              onChange={(e) => handleScheduleChange(idx, 'close', e.target.value)}
            />

            <span style={{ fontWeight: 500 }}>점심:</span>

            {/* 점심 시작/종료 (input type="time" 적용) */}
            <InputTime
              type="time"
              step="1800"
              value={row.lunchStart}
              onChange={(e) => handleScheduleChange(idx, 'lunchStart', e.target.value)}
            />
            <Separator>~</Separator>
            <InputTime
              type="time"
              step="1800"
              value={row.lunchEnd}
              onChange={(e) => handleScheduleChange(idx, 'lunchEnd', e.target.value)}
            />

            <RemoveScheduleButton type="button" onClick={() => handleRemoveSchedule(idx)}>
              <X size={16} />
            </RemoveScheduleButton>
          </DayRow>
        ))}
        <AddScheduleButton type="button" onClick={handleAddSchedule}>
          <Plus size={16} style={{ marginRight: '4px' }} /> 진료시간 추가
        </AddScheduleButton>
      </BusinessHoursWrapper>
      <Button type="button" variant="secondary" onClick={() => setIsModalOpen(true)}>
        대기 인원 등록
      </Button>
      {isModalOpen && (
        <WaitModal
          hospitalId={Number(hospitalId)}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleRegisterWaiting}
        />
      )}

      <Button type="submit">{isEdit ? '병원 수정' : '병원 등록'}</Button>
    </Form>
  );
};

export default HospitalUpdateForm;

function splitAddr(full: string): [string, string] {
  const i = full.lastIndexOf(')');
  return i >= 0 ? [full.slice(0, i + 1), full.slice(i + 1).trim()] : [full, ''];
}
function mapSchedules(raw: ScheduleDTO[]): HourRow[] {
  // 1) raw 를 "목요일" 같은 한글 요일별로 묶기
  const grouped = raw.reduce<Record<string, ScheduleDTO[]>>(
    (acc, m) => {
      const kor = mapDayOfWeekBack(m.dayOfWeek); // "THURSDAY" → "목요일"
      if (!acc[kor]) acc[kor] = [];
      acc[kor].push(m);
      return acc;
    },
    {} as Record<string, ScheduleDTO[]>,
  );

  // 2) 전체 한글 요일 배열
  const week = Object.keys(dayOfWeekMap); // ["월요일","화요일",…,"일요일"]

  // 3) flatMap 으로 각 요일마다 하나 이상 → 각각 매핑, 0개 → 빈 Row 하나
  return week.flatMap((korDay) => {
    const list = grouped[korDay] ?? [null];
    return (list as (ScheduleDTO | null)[]).map((m) =>
      m
        ? {
            hospitalScheduleId: m.hospitalScheduleId,
            day: korDay,
            open: m.openTime.slice(0, 5),
            close: m.closeTime.slice(0, 5),
            lunchStart: m.lunchStart ? m.lunchStart.slice(0, 5) : '',
            lunchEnd: m.lunchEnd ? m.lunchEnd.slice(0, 5) : '',
          }
        : {
            day: korDay,
            open: '',
            close: '',
            lunchStart: '',
            lunchEnd: '',
          },
    );
  });
}
function validateHours(rows: HourRow[]): boolean {
  for (const r of rows) {
    // (1) 전부 빈칸이면 스킵
    if (!r.open && !r.close && !r.lunchStart && !r.lunchEnd) continue;

    // (2) 진료시간 필수 검사
    if (!r.open || !r.close) {
      alert(`${r.day} 진료 시작·종료 시간을 모두 입력해주세요.`);
      return false;
    }
    if (r.open >= r.close) {
      alert(`${r.day} 진료 시작시간은 종료시간보다 빠르게 입력해야 합니다.`);
      return false;
    }

    // (3) 점심시간은 둘 다 입력하거나, 둘 다 비워야 함
    const hasLunchStart = Boolean(r.lunchStart);
    const hasLunchEnd = Boolean(r.lunchEnd);
    if (hasLunchStart !== hasLunchEnd) {
      alert(`${r.day} 점심 시작·종료 시간을 모두 입력하거나, 모두 비워두세요.`);
      return false;
    }

    // (4) 점심시간을 입력하지 않았으면 더 이상 검사할 필요 없음
    if (!hasLunchStart && !hasLunchEnd) continue;

    // (5) 점심시간 순서 및 범위 검사
    if (r.lunchStart < r.open || r.lunchStart >= r.close) {
      alert(`${r.day} 점심 시작시간은 진료시간(${r.open}~${r.close}) 안에 있어야 합니다.`);
      return false;
    }
    if (r.lunchEnd <= r.open || r.lunchEnd > r.close) {
      alert(`${r.day} 점심 종료시간은 진료시간(${r.open}~${r.close}) 안에 있어야 합니다.`);
      return false;
    }
    if (r.lunchStart >= r.lunchEnd) {
      alert(`${r.day} 점심 시작시간은 점심 종료시간보다 빠르게 입력해야 합니다.`);
      return false;
    }
  }
  return true;
}
function validateForm(f: HospitalForm) {
  return {
    name: f.name.trim() ? '' : '병원명은 필수입니다.',
    businessNumber: f.businessNumber.trim() ? '' : '사업자번호는 필수입니다.',
    address: f.address.trim() ? '' : '주소는 필수입니다.',
    phoneNumber: f.phoneNumber.trim() ? '' : '전화번호는 필수입니다.',
  };
}
function splitSchedules(rows: HourRow[]): [CreateScheduleRequest[], CreateScheduleRequest[]] {
  const payloads: CreateScheduleRequest[] = rows
    .filter((r) => r.open && r.close)
    .map((r) => {
      // 필수 필드 먼저 설정
      const req: CreateScheduleRequest = {
        hospitalScheduleId: r.hospitalScheduleId,
        dayOfWeek: dayOfWeekMap[r.day],
        openTime: `${r.open}:00`,
        closeTime: `${r.close}:00`,
        lunchStart: r.lunchStart ? `${r.lunchStart}:00` : '', // 빈 문자열 혹은 "00:00:00"
        lunchEnd: r.lunchEnd ? `${r.lunchEnd}:00` : '',
      };

      // lunchStart가 있으면 추가
      if (r.lunchStart) {
        req.lunchStart = `${r.lunchStart}:00`;
      }
      // lunchEnd가 있으면 추가
      if (r.lunchEnd) {
        req.lunchEnd = `${r.lunchEnd}:00`;
      }

      return req;
    });

  // hospitalScheduleId 유무로 업데이트 / 생성 분리
  return [
    payloads.filter((p) => p.hospitalScheduleId != null),
    payloads.filter((p) => p.hospitalScheduleId == null),
  ];
}

const ChipsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;
const ErrorMessage = styled.span`
  color: red;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;
const Chip = styled.div`
  display: flex;
  align-items: center;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 9999px;
  padding: 4px 8px;
  font-size: 0.875rem;
`;
const RemoveButton = styled.button`
  background: transparent;
  border: none;
  margin-left: 4px;
  cursor: pointer;
  color: #1e3a8a;
  display: flex;
  align-items: center;
`;
const AddButton = styled.button`
  display: flex;
  align-items: center;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 9999px;
  padding: 4px 8px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #2563eb;
  }
`;
const Separator = styled.span`
  font-size: 1.2rem;
  color: #333;
`;
const NewServiceInput = styled.input`
  border: 1px solid #d1d5db;
  border-radius: 9999px;
  padding: 4px 8px;
  font-size: 0.875rem;
  outline: none;
  width: 120px;
`;
const Form = styled.form`
  max-width: 100%;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
const FileLabel = styled.label`
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #2563eb;
  color: white;
  font-weight: 600;
  border-radius: 0.5rem;
  cursor: pointer;
  &:hover {
    background-color: #003c80;
  }
`;
const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const Label = styled.label`
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
`;
const Input = styled.input`
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.75rem;
  outline: none;
  transition: box-shadow 0.2s;
  &:focus {
    box-shadow: 0 0 0 2px #60a5fa;
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  background: ${({ variant }) =>
    variant === 'secondary'
      ? 'linear-gradient(to right,#3b82f6,#2563eb)'
      : 'linear-gradient(to right,#4f46e5,#4338ca)'};
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 600;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: none;
  cursor: pointer;
  &:hover {
    background: ${({ variant }) =>
      variant === 'secondary'
        ? 'linear-gradient(to right,#2563eb,#1e40af)'
        : 'linear-gradient(to right,#4338ca,#312e81)'};
  }
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

const RemoveScheduleButton = styled.button`
  background: transparent;
  border: none;
  color: #e11d48;
  cursor: pointer;
`;
const BusinessHoursWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
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

const InputTime = styled.input`
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  font-size: 1rem;

  /* iOS Safari, Chrome on Android 등의 기본 시계 스타일 유지하면서 */
  /* Firefox 에서는 placeholder 폰트 크기 조정이 필요할 수 있습니다 */
  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
`;
const ThumbnailsRow = styled.div`
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0.5rem 0;
`;
const ThumbnailWrapper = styled.div`
  position: relative;
  width: 120px;
  height: 150px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
`;

const RemoveThumbnailButton = styled.button.attrs({ type: 'button' })`
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.6);
  border: none;
  border-radius: 50%;
  color: white;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1;
`;

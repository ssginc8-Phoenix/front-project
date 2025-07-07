// 병원 등록 전용 페이지: HospitalCreateForm.tsx
import React, { useRef, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { X, Plus } from 'lucide-react';
import { Copy } from 'lucide-react';
import { registerHospital, createHospitalSchedule } from '~/features/hospitals/api/hospitalAPI';
import HospitalDaumPost from '~/features/hospitals/components/hospitalAdmin/info/HospitalDaumPost';
import type { CreateScheduleRequest } from '~/features/hospitals/types/hospital';
import useHospitalStore from '~/features/hospitals/state/hospitalStore';
import { useNavigate } from 'react-router';
import useLoginStore from '~/features/user/stores/LoginStore';
import Resizer from 'react-image-file-resizer';
import { showErrorAlert, showSuccessAlert } from '~/components/common/alert';

const dayOfWeekMap: Record<string, CreateScheduleRequest['dayOfWeek']> = {
  월요일: 'MONDAY',
  화요일: 'TUESDAY',
  수요일: 'WEDNESDAY',
  목요일: 'THURSDAY',
  금요일: 'FRIDAY',
  토요일: 'SATURDAY',
  일요일: 'SUNDAY',
};

const reverseDayOfWeekMap = Object.entries(dayOfWeekMap).reduce(
  (acc, [kor, eng]) => ({ ...acc, [eng]: kor }),
  {} as Record<CreateScheduleRequest['dayOfWeek'], string>,
);

interface HourRow {
  dayOfWeek: CreateScheduleRequest['dayOfWeek'];
  open: string;
  close: string;
  lunchStart: string;
  lunchEnd: string;
}

const HospitalCreateForm: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    address: '',
    detailAddress: '',
    phoneNumber: '',
    businessNumber: '',
    intro: '',
    notice: '',
    serviceName: [] as string[],
  });
  const [coords, setCoords] = useState({ lat: 0, lng: 0 });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [newService, setNewService] = useState('');
  const { user } = useLoginStore.getState();
  const navigate = useNavigate();
  const { setHospitalId } = useHospitalStore();
  const [formErrors, setFormErrors] = useState({
    name: '',
    businessNumber: '',
    address: '',
    phoneNumber: '',
  });
  const [businessHours, setBusinessHours] = useState<HourRow[]>([
    { dayOfWeek: 'MONDAY', open: '', close: '', lunchStart: '', lunchEnd: '' },
  ]);

  const nameRef = useRef<HTMLInputElement>(null);
  const businessNumberRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  const handleChange =
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const urls: string[] = [];
    const resizedFiles: File[] = [];

    for (const file of files) {
      // 포맷 검사
      if (!['image/jpeg', 'image/png', 'image/svg+xml'].includes(file.type)) {
        await showErrorAlert('파일 형식 오류', 'JPEG, PNG, SVG 파일만 허용됩니다.');
        continue;
      }

      // 2MB 제한
      if (file.size / 1024 / 1024 > 2) {
        await showErrorAlert('파일 크기 초과', `${file.name}은(는) 2MB 이하만 허용됩니다.`);
        continue;
      }

      // Resizer.imageFileResizer 를 Promise 로 감싸기
      const resizedDataUrl: string = await new Promise((resolve) => {
        Resizer.imageFileResizer(
          file, // 원본 File 객체
          500, // 최대 width
          500, // 최대 height
          'JPEG', // output 포맷: JPEG / PNG / WEBP / ...
          90, // quality (0–100)
          0, // rotation (0–360)
          (uri) => resolve(uri as string),
          'base64', // output type: 'base64' 또는 'blob'
        );
      });

      // base64 string → File 객체로 변환(필요 시)
      const blob = await fetch(resizedDataUrl).then((res) => res.blob());
      const resizedFile = new File([blob], file.name, { type: blob.type });

      resizedFiles.push(resizedFile);
      urls.push(resizedDataUrl);
    }

    // state 업데이트
    setSelectedImages(resizedFiles);
    setPreviewUrls(urls);
  };

  const handleAddSchedule = async () => {
    const usedDays = businessHours.map((row) => row.dayOfWeek);
    const availableDay = (Object.values(dayOfWeekMap) as CreateScheduleRequest['dayOfWeek'][]).find(
      (day) => !usedDays.includes(day),
    );
    if (!availableDay) {
      await showErrorAlert('모든 요일 등록됨', '모든 요일의 진료시간이 이미 등록되었습니다.');
      return;
    }
    setBusinessHours((prev) => [
      ...prev,
      {
        dayOfWeek: availableDay,
        open: '',
        close: '',
        lunchStart: '',
        lunchEnd: '',
      },
    ]);
  };

  const handleScheduleChange = async (idx: number, key: keyof HourRow, value: string) => {
    if (
      key === 'dayOfWeek' &&
      businessHours.some((row, i) => row.dayOfWeek === value && i !== idx)
    ) {
      await showErrorAlert('중복 요일', '이미 선택된 요일입니다. 다른 요일을 선택해주세요.');
      return;
    }
    setBusinessHours((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [key]: value };
      return updated;
    });
  };

  const handleRemoveSchedule = (idx: number) => {
    setBusinessHours((prev) => prev.filter((_, i) => i !== idx));
  };
  const WEEKDAYS: CreateScheduleRequest['dayOfWeek'][] = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
  ];
  const handleCopySchedule = (idx: number) => {
    setBusinessHours((prev) => {
      const baseDay = prev[idx].dayOfWeek;
      const baseIdx = WEEKDAYS.indexOf(baseDay);
      if (baseIdx < 0) return prev;

      // 원본 행 바로 아래부터 연속으로 몇 개 복사했는지 센다
      let copiedCount = 0;
      for (let i = idx + 1; i < prev.length; i++) {
        // 기대하는 다음 요일
        const expectedNext = WEEKDAYS[baseIdx + copiedCount + 1];
        if (prev[i].dayOfWeek === expectedNext) {
          copiedCount++;
        } else {
          break;
        }
      }

      const nextDayIdx = baseIdx + copiedCount + 1;
      // 이미 일요일(SUNDAY)이거나 그 이후라면 복사 안 함
      if (nextDayIdx >= WEEKDAYS.length) {
        return prev;
      }

      // 새로운 행은 원본을 복사하되 dayOfWeek만 다음 요일로 바꿈
      const newRow: HourRow = {
        ...prev[idx],
        dayOfWeek: WEEKDAYS[nextDayIdx],
      };

      // 삽입 위치: 원본 idx + (지금까지 복사된 개수) + 1
      const insertPos = idx + copiedCount + 1;
      return [...prev.slice(0, insertPos), newRow, ...prev.slice(insertPos)];
    });
  };
  const parseTime = (timeStr: string) => {
    if (!timeStr) return null; // ← 빈 값은 명시적으로 null 반환
    const [h, m] = timeStr.split(':').map(Number);
    return new Date(0, 0, 0, h, m);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasValidSchedule = businessHours.some(({ open, close }) => open && close);
    if (!hasValidSchedule) {
      await showErrorAlert('진료시간 필요', '진료시간을 최소 1개 이상 등록해주세요.');
      return;
    }
    for (const { dayOfWeek, open, close, lunchStart, lunchEnd } of businessHours) {
      const dayLabel = reverseDayOfWeekMap[dayOfWeek];

      if (!open && !close && !lunchStart && !lunchEnd) continue;

      if (!open || !close) {
        await showErrorAlert(
          '시간 입력 오류',
          `${dayLabel}의 진료 시작·종료 시간을 모두 입력해주세요.`,
        );
        return;
      }

      const openTime = parseTime(open);
      const closeTime = parseTime(close);
      const lunchStartTime = parseTime(lunchStart);
      const lunchEndTime = parseTime(lunchEnd);

      if (!openTime || !closeTime) {
        await showErrorAlert('시간 형식 오류', `${dayLabel}의 진료시간 형식이 잘못되었습니다.`);
        return;
      }

      if (openTime >= closeTime) {
        await showErrorAlert(
          '시간 순서 오류',
          `${dayLabel} 진료 시작시간은 종료시간보다 빨라야 합니다.`,
        );
        return;
      }

      if (lunchStartTime && (lunchStartTime < openTime || lunchStartTime >= closeTime)) {
        await showErrorAlert(
          '점심시간 범위 오류',
          `${dayLabel} 점심 시작시간은 진료시간 내에 있어야 합니다.`,
        );
        return;
      }

      if (lunchEndTime && (lunchEndTime <= openTime || lunchEndTime > closeTime)) {
        await showErrorAlert(
          '점심시간 범위 오류',
          `${dayLabel} 점심 종료시간은 진료시간 내에 있어야 합니다.`,
        );
        return;
      }

      if (lunchStartTime && lunchEndTime && lunchStartTime >= lunchEndTime) {
        await showErrorAlert(
          '점심시간 순서 오류',
          `${dayLabel} 점심 시작시간은 점심 종료시간보다 빨라야 합니다.`,
        );
        return;
      }
    }
    const errors = {
      name: form.name.trim() ? '' : '병원명은 필수 입력 항목입니다.',
      businessNumber: form.businessNumber.trim() ? '' : '사업자번호는 필수 입력 항목입니다.',
      address: form.address.trim() ? '' : '주소는 필수 입력 항목입니다.',
      phoneNumber: form.phoneNumber.trim() ? '' : '전화번호는 필수 입력 항목입니다.',
    };
    setFormErrors(errors);
    if (errors.name) {
      nameRef.current?.focus();
      return;
    }
    if (errors.businessNumber) {
      businessNumberRef.current?.focus();
      return;
    }
    if (errors.address) {
      addressRef.current?.focus();
      return;
    }
    if (errors.phoneNumber) {
      phoneRef.current?.focus();
      return;
    }
    if (Object.values(errors).some(Boolean)) return;
    if (!user || user.userId === undefined) {
      await showErrorAlert('로그인 필요', '병원 등록을 위해 로그인이 필요합니다.');
      return;
    }
    try {
      const fd = new FormData();

      // 2) JSON 부분을 Blob 으로 감싸서 `data` 파트로 추가
      const dataBlob = new Blob(
        [
          JSON.stringify({
            userId: user!.userId,
            name: form.name,
            address: `${form.address} ${form.detailAddress}`,
            latitude: coords.lat,
            longitude: coords.lng,
            phone: form.phoneNumber,
            introduction: form.intro,
            notice: form.notice,
            businessRegistrationNumber: form.businessNumber,
            serviceName: form.serviceName,
          }),
        ],
        { type: 'application/json' },
      );
      fd.append('data', dataBlob);

      // 3) 이미지 파일이 있으면 `files` 파트로 추가
      selectedImages.forEach((file) => {
        fd.append('files', file);
      });

      // 4) FormData 를 통째로 보내기
      const created = await registerHospital(fd);
      console.log('🏥 created hospital:', created);

      const hospitalId = typeof created === 'number' ? created : created.hospitalId;

      setHospitalId(created.hospitalId);
      const schedulePayloads = businessHours.map(
        ({ dayOfWeek, open, close, lunchStart, lunchEnd }) => ({
          dayOfWeek,
          openTime: open ? `${open}:00` : null,
          closeTime: close ? `${close}:00` : null,
          lunchStart: lunchStart ? `${lunchStart}:00` : null,
          lunchEnd: lunchEnd ? `${lunchEnd}:00` : null,
        }),
      );

      await Promise.all(schedulePayloads.map((s) => createHospitalSchedule(hospitalId, s)));

      await showSuccessAlert('등록 완료', '병원 등록이 완료되었습니다. 이제 의사를 등록해주세요.');
      navigate('/register-doctors');
    } catch (err) {
      console.error(err);
      await showErrorAlert('등록 실패', '병원 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <GlobalStyle />
      <Form onSubmit={handleSubmit}>
        <FieldWrapper>
          <Label>병원 명</Label>
          <Input ref={nameRef} value={form.name} onChange={handleChange('name')} />
          {formErrors.name && <Error>{formErrors.name}</Error>}
        </FieldWrapper>
        <FieldWrapper>
          <Label>사업자 번호</Label>
          <Input
            ref={businessNumberRef}
            inputMode="numeric"
            maxLength={12} // 하이픈 포함 12자
            value={form.businessNumber}
            onChange={(e) => {
              const value = e.target.value;

              // 숫자만 남김
              const numeric = value.replace(/\D/g, '');

              // 하이픈 포맷 적용
              let formatted = '';
              if (numeric.length <= 3) {
                formatted = numeric;
              } else if (numeric.length <= 5) {
                formatted = `${numeric.slice(0, 3)}-${numeric.slice(3)}`;
              } else {
                formatted = `${numeric.slice(0, 3)}-${numeric.slice(3, 5)}-${numeric.slice(5, 10)}`;
              }

              setForm((prev) => ({
                ...prev,
                businessNumber: formatted,
              }));
            }}
          />
          {formErrors.businessNumber && <Error>{formErrors.businessNumber}</Error>}
        </FieldWrapper>
        <FieldWrapper>
          <Label>주소</Label>
          <HospitalDaumPost
            ref={addressRef}
            address={form.address}
            setAddress={(addr) => setForm((prev) => ({ ...prev, address: addr }))}
            setCoords={setCoords}
          />
          {formErrors.address && <Error>{formErrors.address}</Error>}
        </FieldWrapper>
        <FieldWrapper>
          <Label>상세주소</Label>
          <Input value={form.detailAddress} onChange={handleChange('detailAddress')} />
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
            placeholder="예: 0507-1234-5678"
          />

          {formErrors.phoneNumber && <Error>{formErrors.phoneNumber}</Error>}
        </FieldWrapper>
        <FieldWrapper>
          <Label>소개글</Label>
          <BigTextArea value={form.intro} onChange={handleChange('intro')} />
        </FieldWrapper>
        <FieldWrapper>
          <Label>공지사항</Label>
          <BigTextArea value={form.notice} onChange={handleChange('notice')} />
        </FieldWrapper>
        <FieldWrapper>
          <Label>병원 이미지</Label>
          <FileInput
            id="hospitalImage"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
          <FileLabel htmlFor="hospitalImage">이미지 선택</FileLabel>
          {previewUrls.length > 0 && (
            <PreviewWrapper>
              {previewUrls.map((url, i) => (
                <PreviewImage key={i} src={url} alt={`미리보기 ${i + 1}`} />
              ))}
            </PreviewWrapper>
          )}
        </FieldWrapper>
        <FieldWrapper>
          <Label>서비스 이름</Label>
          <ServiceInputWrapper>
            {form.serviceName.map((name, i) => (
              <ServiceChip key={i}>
                {name}
                <RemoveButton
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      serviceName: prev.serviceName.filter((_, idx) => idx !== i),
                    }))
                  }
                >
                  <X size={14} />
                </RemoveButton>
              </ServiceChip>
            ))}
            <ServiceInput
              type="text"
              placeholder="서비스 추가"
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newService.trim()) {
                  e.preventDefault();
                  setForm((prev) => ({
                    ...prev,
                    serviceName: [...prev.serviceName, newService.trim()],
                  }));
                  setNewService('');
                }
              }}
            />
          </ServiceInputWrapper>
        </FieldWrapper>

        <FieldWrapper>
          <Label>진료시간</Label>
          {businessHours.map((row, idx) => (
            <ScheduleRow key={idx}>
              <DaySelect
                value={row.dayOfWeek}
                onChange={(e) => handleScheduleChange(idx, 'dayOfWeek', e.target.value)}
              >
                {Object.entries(reverseDayOfWeekMap).map(([eng, kor]) => (
                  <option key={eng} value={eng}>
                    {kor}
                  </option>
                ))}
              </DaySelect>

              <TreatGroup>
                <GroupLabel>진료:</GroupLabel>
                <TreatStartTime
                  type="time"
                  step="1800"
                  value={row.open}
                  onChange={(e) => handleScheduleChange(idx, 'open', e.target.value)}
                />
                <TreatEndTime
                  type="time"
                  step="1800"
                  value={row.close}
                  onChange={(e) => handleScheduleChange(idx, 'close', e.target.value)}
                />
              </TreatGroup>

              <LunchGroup>
                <GroupLabel>점심:</GroupLabel>
                <LunchStartTime
                  type="time"
                  step="1800"
                  value={row.lunchStart}
                  onChange={(e) => handleScheduleChange(idx, 'lunchStart', e.target.value)}
                />
                <LunchEndTime
                  type="time"
                  step="1800"
                  value={row.lunchEnd}
                  onChange={(e) => handleScheduleChange(idx, 'lunchEnd', e.target.value)}
                />
              </LunchGroup>
              <ButtonRow>
                <CopyScheduleButton
                  type="button"
                  onClick={() => handleCopySchedule(idx)}
                  title="이 행 복사"
                >
                  <Copy size={16} />
                </CopyScheduleButton>
                <RemoveScheduleButton type="button" onClick={() => handleRemoveSchedule(idx)}>
                  <X size={16} />
                </RemoveScheduleButton>
              </ButtonRow>
            </ScheduleRow>
          ))}

          <AddScheduleButton type="button" onClick={handleAddSchedule}>
            <Plus size={16} /> 진료시간 추가
          </AddScheduleButton>
        </FieldWrapper>
        <Button type="submit">병원 등록</Button>
      </Form>
    </>
  );
};

export default HospitalCreateForm;

const Form = styled.form`
  max-width: 100%;
  box-sizing: border-box;
  margin: 1rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 768px) {
    margin: 0.5rem auto;
    width: calc(100% - 1rem);
    padding: 0 0.5rem;
  }
`;

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  font-size: 1rem;
`;

const InputTime = styled.input`
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  font-size: 0.875rem;

  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }

  @media (max-width: 768px) {
    text-align: center;
    height: 2.5rem;
    width: 45%; /* shrink to fit two per line */
    box-sizing: border-box;
    margin-bottom: 0.5rem; /* give a bit of vertical gap */
  }
`;

const PreviewWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  width: 100%;
  overflow-x: auto;
  padding-bottom: 0.5rem;
`;

const RemoveScheduleButton = styled.button`
  background: transparent;
  border: none;
  color: #e11d48;
  cursor: pointer;

  @media (max-width: 768px) {
    grid-area: remove;
  }
`;

const CopyScheduleButton = styled.button`
  background: transparent;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;

  &:hover {
    color: #2563eb;
  }

  @media (max-width: 768px) {
    grid-area: copy;
  }
`;

const PreviewImage = styled.img`
  flex: 0 0 auto;
  width: 100px;
  height: 100px;
  border-radius: 0.5rem;
  object-fit: cover;
`;

const FileInput = styled.input`
  display: none;
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

const BigTextArea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
  height: 3.5rem;
  font-size: 1rem;
`;

const Error = styled.div`
  color: red;
  font-size: 0.875rem;
`;

const Button = styled.button`
  margin-top: 1rem;
  background: #2563eb;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background: #1d4ed8;
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

const ServiceInputWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const ServiceChip = styled.div`
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

const ServiceInput = styled.input`
  border: 1px solid #d1d5db;
  border-radius: 9999px;
  padding: 4px 8px;
  font-size: 0.875rem;
  outline: none;
  width: 140px;
`;

const GlobalStyle = createGlobalStyle`
  /* TimePicker wheel panel sizing */
  .custom-wheel-timepicker .ant-picker-time-panel-column {
    width: 4rem !important;
    max-height: 250px !important;
  }
  .custom-wheel-timepicker .ant-picker-time-panel-cell-inner {
    font-size: 1rem;
    padding: 0.25rem 0;
  }
`;
const DaySelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;

  @media (max-width: 768px) {
    grid-area: day;
    height: 2.5rem;
    width: 100%;
    box-sizing: border-box;
    text-align: center;
  }
`;

const TreatStartTime = styled(InputTime)`
  @media (max-width: 768px) {
    grid-area: treat1;
    width: 40%;
    box-sizing: border-box;
    margin-bottom: 0.5rem;
  }
`;

const TreatEndTime = styled(InputTime)`
  @media (max-width: 768px) {
    grid-area: treat2;
    width: 40%;
    box-sizing: border-box;
    margin-bottom: 0.5rem;
  }
`;

const LunchStartTime = styled(InputTime)`
  @media (max-width: 768px) {
    grid-area: lunch1;
    width: 40%;
    box-sizing: border-box;
    margin-bottom: 0.5rem;
  }
`;

const LunchEndTime = styled(InputTime)`
  @media (max-width: 768px) {
    grid-area: lunch2;
    width: 40%;
    box-sizing: border-box;
    margin-bottom: 0.5rem;
  }
`;
const TimeGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  /* 모바일에서는 100% 너비에 두 개씩 정렬하고 싶다면 이렇게 */
  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 0.5rem;
  }

  &.treat {
    @media (max-width: 768px) {
      grid-area: treat;
    }
  }

  &.lunch {
    @media (max-width: 768px) {
      grid-area: lunch;
    }
  }
`;

const GroupLabel = styled.span`
  font-weight: 500;
  white-space: nowrap;
`;
const TreatGroup = styled(TimeGroup)`
  @media (max-width: 768px) {
    grid-area: treat;
  }
`;
const LunchGroup = styled(TimeGroup)`
  @media (max-width: 768px) {
    grid-area: lunch;
  }
`;
const ScheduleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    /* 세로 스택 */
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
    padding: 0.75rem;
    background: #f9fafb;
    border-radius: 0.5rem;

    /* 1) 요일 드롭다운: 보이게, 전체 폭, 아래 여백 */
    ${DaySelect} {
      width: 100%;
      padding: 0.5rem;
      box-sizing: border-box;
    }

    /* 2) 진료·점심 그룹: 세로 스택 안에서 row로 */
    ${TreatGroup}, ${LunchGroup} {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;

      ${GroupLabel} {
        flex: none;
        white-space: nowrap;
      }
      input {
        flex: 1;
      }
    }

    /* 3) 버튼은 마지막에 모아서 우측 정렬 */
    ${CopyScheduleButton}, ${RemoveScheduleButton} {
      align-self: flex-end;
    }
  }
`;
const ButtonRow = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;

  @media (min-width: 769px) {
    /* 데스크탑에선 필요 없으니 숨김 */
    display: none;
  }
`;

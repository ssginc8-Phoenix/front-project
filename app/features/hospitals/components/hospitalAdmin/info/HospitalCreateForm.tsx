// 병원 등록 전용 페이지: HospitalCreateForm.tsx
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { X, Plus } from 'lucide-react';
import { Select } from 'antd';
import { registerHospital, createHospitalSchedule } from '~/features/hospitals/api/hospitalAPI';
import HospitalDaumPost from '~/features/hospitals/components/hospitalAdmin/info/HospitalDaumPost';
import type {
  CreateScheduleRequest,
  CreateHospitalRequest,
} from '~/features/hospitals/types/hospital';
import useHospitalStore from '~/features/hospitals/state/hospitalStore';
import { useNavigate } from 'react-router';
import useLoginStore from '~/features/user/stores/LoginStore';
import { resizeImage } from '~/features/hospitals/components/common/resizeImage';

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
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
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
    const file = e.target.files?.[0];
    if (!file) return;

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > 2) {
      alert('2MB 이하의 이미지만 업로드할 수 있습니다.');
      return;
    }

    // ✅ 이미지 리사이즈
    const resized = await resizeImage(file, 500);
    setSelectedImage(resized);

    // 미리보기
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPreviewUrl(reader.result);
      }
    };
    reader.readAsDataURL(resized);
  };

  const handleAddSchedule = () => {
    const usedDays = businessHours.map((row) => row.dayOfWeek);
    const availableDay = (Object.values(dayOfWeekMap) as CreateScheduleRequest['dayOfWeek'][]).find(
      (day) => !usedDays.includes(day),
    );
    if (!availableDay) return alert('모든 요일이 이미 등록되었습니다.');
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

  const handleScheduleChange = (idx: number, key: keyof HourRow, value: string) => {
    if (
      key === 'dayOfWeek' &&
      businessHours.some((row, i) => row.dayOfWeek === value && i !== idx)
    ) {
      alert('이미 선택된 요일입니다.');
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

  const timeOptions = Array.from({ length: 24 * 2 }, (_, i) => {
    const hour = String(Math.floor(i / 2)).padStart(2, '0');
    const minute = i % 2 === 0 ? '00' : '30';
    const label = `${hour}:${minute}`;
    return { label, value: label };
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    for (const { dayOfWeek, open, close, lunchStart, lunchEnd } of businessHours) {
      // ① 빈 데이터(오픈/종료 둘 다 빈 값)는 건너뛰기
      if (!open && !close && !lunchStart && !lunchEnd) {
        continue;
      }

      // ② 진료 시작/종료는 둘 다 있어야 함
      if (!open || !close) {
        alert(`${dayOfWeek}의 진료 시작·종료 시간을 모두 입력해주세요.`);
        return;
      }

      // ③ 진료 시작 < 종료
      if (open >= close) {
        alert(`${dayOfWeek} 진료 시작시간은 종료시간보다 빠르게 입력해야 합니다.`);
        return;
      }

      // ④ 점심이 있으면 진료시간 내부에 있어야 함
      if (lunchStart) {
        if (lunchStart < open || lunchStart >= close) {
          alert(`${dayOfWeek} 점심 시작시간은 진료시간(${open}~${close}) 안에 있어야 합니다.`);
          return;
        }
      }
      if (lunchEnd) {
        if (lunchEnd <= open || lunchEnd > close) {
          alert(`${dayOfWeek} 점심 종료시간은 진료시간(${open}~${close}) 안에 있어야 합니다.`);
          return;
        }
      }

      // ⑤ 점심 시작 < 점심 종료
      if (lunchStart && lunchEnd && lunchStart >= lunchEnd) {
        alert(`${dayOfWeek} 점심 시작시간은 점심 종료시간보다 빠르게 입력해야 합니다.`);
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
    if (Object.values(errors).some(Boolean)) return;
    if (!user || user.userId === undefined) {
      alert('로그인이 필요합니다.');
      return;
    }
    try {
      const hospitalPayload: CreateHospitalRequest = {
        userId: user?.userId,
        name: form.name,
        address: `${form.address} ${form.detailAddress}`,
        latitude: coords.lat,
        longitude: coords.lng,
        phone: form.phoneNumber,
        introduction: form.intro,
        notice: form.notice,
        businessRegistrationNumber: form.businessNumber,
        serviceNames: form.serviceName,
        file: selectedImage ?? undefined,
      };

      const created = await registerHospital({
        ...hospitalPayload,
        file: hospitalPayload.file ?? undefined,
      });

      const hospitalId = created.hospitalId;
      setHospitalId(created.hospitalId);
      const schedulePayloads = businessHours.map(
        ({ dayOfWeek, open, close, lunchStart, lunchEnd }) => ({
          dayOfWeek,
          openTime: open ? `${open}:00` : '00:00:00',
          closeTime: close ? `${close}:00` : '00:00:00',
          lunchStart: lunchStart ? `${lunchStart}:00` : '00:00:00',
          lunchEnd: lunchEnd ? `${lunchEnd}:00` : '00:00:00',
        }),
      );

      await Promise.all(schedulePayloads.map((s) => createHospitalSchedule(hospitalId, s)));

      alert('병원 등록이 완료되었습니다. 이제 의사를 등록해주세요.');
      navigate('/register-doctors');
    } catch (err) {
      console.error(err);
      alert('등록 중 오류가 발생했습니다.');
    }
  };

  return (
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
          placeholder="예: 010-1234-5678"
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
        <FileInput id="hospitalImage" type="file" accept="image/*" onChange={handleImageChange} />
        <FileLabel htmlFor="hospitalImage">이미지 선택</FileLabel>
        <PreviewWrapper>
          <PreviewImage src={previewUrl} alt="미리보기" />
        </PreviewWrapper>
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
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              flexWrap: 'wrap',
              marginBottom: '1rem',
            }}
          >
            {/* 요일 */}
            <select
              value={row.dayOfWeek}
              onChange={(e) => handleScheduleChange(idx, 'dayOfWeek', e.target.value)}
            >
              {Object.entries(reverseDayOfWeekMap).map(([eng, kor]) => (
                <option key={eng} value={eng}>
                  {kor}
                </option>
              ))}
            </select>
            {/* 진료시간 */}
            <Select
              value={row.open || undefined}
              onChange={(val: string) => handleScheduleChange(idx, 'open', val)}
              placeholder="시작"
              style={{ width: 100 }}
            >
              {timeOptions.map((opt) => (
                <Select.Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Select.Option>
              ))}
            </Select>
            ~
            <Select
              value={row.close || undefined}
              onChange={(val: string) => handleScheduleChange(idx, 'close', val)}
              placeholder="종료"
              style={{ width: 100 }}
            >
              {timeOptions.map((opt) => (
                <Select.Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Select.Option>
              ))}
            </Select>
            점심:
            <Select
              value={row.lunchStart || undefined}
              onChange={(val: string) => handleScheduleChange(idx, 'lunchStart', val)}
              placeholder="시작"
              style={{ width: 100 }}
            >
              {timeOptions.map((opt) => (
                <Select.Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Select.Option>
              ))}
            </Select>
            ~
            <Select
              value={row.lunchEnd || undefined}
              onChange={(val: string) => handleScheduleChange(idx, 'lunchEnd', val)}
              placeholder="종료"
              style={{ width: 100 }}
            >
              {timeOptions.map((opt) => (
                <Select.Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Select.Option>
              ))}
            </Select>
            {/* 삭제 버튼 */}
            <button type="button" onClick={() => handleRemoveSchedule(idx)}>
              <X size={16} />
            </button>
          </div>
        ))}

        <AddScheduleButton type="button" onClick={handleAddSchedule}>
          <Plus size={16} style={{ marginRight: '4px' }} /> 진료시간 추가
        </AddScheduleButton>
      </FieldWrapper>
      <Button type="submit">병원 등록</Button>
    </Form>
  );
};

export default HospitalCreateForm;

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
const PreviewWrapper = styled.div`
  width: 150px;
  height: 150px;
  margin-top: 1rem;
  border-radius: 0.5rem;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
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

const PreviewImage = styled.img`
  width: 150px;
  height: 150px;
  margin-top: 1rem;
  border-radius: 0.5rem;
  object-fit: cover;
  background-color: #fff;
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

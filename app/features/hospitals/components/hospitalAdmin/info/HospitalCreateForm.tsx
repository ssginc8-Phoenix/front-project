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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
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
      console.log('스케줄 생성 hospitalId:', hospitalId);
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
          value={form.phoneNumber}
          inputMode="numeric"
          onChange={(e) => {
            let value = e.target.value.replace(/\D/g, ''); // 숫자만 추출

            // 숫자만 기준으로 11자리 이상 못 쓰게 자름
            value = value.slice(0, 10); // 3+3+4 = 10자리 숫자 (051-123-4567)

            let formatted = '';
            if (value.length <= 3) {
              formatted = value;
            } else if (value.length <= 6) {
              formatted = `${value.slice(0, 3)}-${value.slice(3)}`;
            } else {
              formatted = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6)}`;
            }

            setForm((prev) => ({
              ...prev,
              phoneNumber: formatted,
            }));
          }}
          maxLength={13} // 하이픈 포함 최대 길이
          placeholder="예: 051-123-4567"
        />

        {formErrors.phoneNumber && <Error>{formErrors.phoneNumber}</Error>}
      </FieldWrapper>
      <FieldWrapper>
        <Label>소개글</Label>
        <TextArea value={form.intro} onChange={handleChange('intro')} />
      </FieldWrapper>
      <FieldWrapper>
        <Label>공지사항</Label>
        <TextArea value={form.notice} onChange={handleChange('notice')} />
      </FieldWrapper>
      <FieldWrapper>
        <Label>병원 이미지</Label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {previewUrl && <PreviewImage src={previewUrl} alt="미리보기" />}
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
`;
const TextArea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
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
const PreviewImage = styled.img`
  margin-top: 0.5rem;
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
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

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
import WaitModal from '~/features/hospitals/components/RegisterWaitModal';
import type {
  CreateScheduleRequest,
  CreateHospitalRequest,
} from '~/features/hospitals/types/hospital';
import FileUploader from '~/features/hospitals/components/hospitalAdmin/file/FileUploader';

interface HourRow {
  scheduleId?: number;
  day: string;
  open: string;
  close: string;
  lunchStart: string;
  lunchEnd: string;
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
        <Chip key={i}>
          {s}
          <RemoveButton
            type="button"
            onClick={() => onChange(services.filter((_, idx) => idx !== i))}
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
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  padding: 0.75rem;
  margin-bottom: 1rem;
`;

const PreviewImage = styled.img`
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  margin-top: 0.5rem;
  border-radius: 0.5rem;
`;

const HospitalRegisterForm: React.FC = () => {
  const [hospitalId, setHospitalId] = useState<string | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialBusinessNumber, setInitialBusinessNumber] = useState('');
  const nameRef = useRef<HTMLInputElement>(null);
  const businessNumberRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const [form, setForm] = useState({
    name: '',
    address: '',
    phoneNumber: '',
    businessNumber: '',
    intro: '',
    notice: '',
    serviceName: [] as string[],
    waiting: '',
  });
  const [coords, setCoords] = useState({ lat: 0, lng: 0 });
  const [businessHours, setBusinessHours] = useState<HourRow[]>(
    Object.keys(dayOfWeekMap).map((day) => ({ day, open: '', close: '' })),
  );

  useEffect(() => {
    const fetchHospitalAndSchedules = async () => {
      try {
        const data = await getMyHospital();
        if (!data) return;

        setHospitalId(String(data.hospitalId));
        setIsEdit(true);
        setForm({
          name: data.name || '',
          address: data.address || '',
          phoneNumber: data.phone || '',
          businessNumber: data.businessRegistrationNumber || '',
          intro: data.introduction || '',
          notice: data.notice || '',
          serviceName: data.serviceNames || [],
          waiting: data.waiting?.toString() || '',
        });
        setCoords({ lat: data.latitude || 0, lng: data.longitude || 0 });

        if (data.image?.url) {
          setPreviewUrl(data.image.url);
        }

        setInitialBusinessNumber(data.businessRegistrationNumber || '');
        const schedules = await getHospitalSchedules(data.hospitalId);
        setBusinessHours((prev) =>
          prev.map((row) => {
            const match = schedules.find((s) => mapDayOfWeekBack(s.dayOfWeek) === row.day);
            return match
              ? {
                  scheduleId: match.hospitalScheduleId,
                  day: row.day,
                  open: match.openTime.slice(0, 5),
                  close: match.closeTime.slice(0, 5),
                  lunchStart: match.lunchStart.slice(0, 5),
                  lunchEnd: match.lunchEnd.slice(0, 5),
                }
              : { ...row, lunchStart: '12:00', lunchEnd: '13:00' }; // 기본값
          }),
        );
      } catch (err) {
        console.error(err);
      }
    };
    fetchHospitalAndSchedules();
  }, []);

  const handleChange =
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const handleTimeChange =
    (idx: number, key: 'open' | 'close' | 'lunchStart' | 'lunchEnd') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setBusinessHours((prev) => {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], [key]: e.target.value };
        return updated;
      });
    };

  const handleRegisterWaiting = async (count: number) => {
    if (!hospitalId) return;
    try {
      await createWaiting(Number(hospitalId), count);
      alert(`대기 인원 ${count}명 등록 완료`);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };
  const [formErrors, setFormErrors] = useState({
    name: '',
    businessNumber: '',
    address: '',
    phoneNumber: '',
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let fileId: number | undefined = undefined;
    const newErrors = {
      name: form.name.trim() ? '' : '병원명은 필수 입력 항목입니다.',
      businessNumber: form.businessNumber.trim() ? '' : '사업자번호는 필수 입력 항목입니다.',
      address: form.address.trim() ? '' : '주소는 필수 입력 항목입니다.',
      phoneNumber: form.phoneNumber.trim() ? '' : '전화번호는 필수 입력 항목입니다.',
    };

    setFormErrors(newErrors);
    if (!form.name.trim()) {
      nameRef.current?.focus();
    } else if (!form.businessNumber.trim()) {
      businessNumberRef.current?.focus();
    } else if (!form.address.trim()) {
      addressRef.current?.focus();
    } else if (!form.phoneNumber.trim()) {
      phoneRef.current?.focus();
    }
    const hasError = Object.values(newErrors).some((msg) => msg);
    if (hasError) {
      return;
    }
    const userId = Number(localStorage.getItem('userId') || '0');
    const hospitalPayload: CreateHospitalRequest = {
      userId,
      name: form.name,
      address: form.address,
      latitude: coords.lat,
      longitude: coords.lng,
      phone: form.phoneNumber,
      introduction: form.intro,
      notice: form.notice,
      businessRegistrationNumber: form.businessNumber,
      serviceNames: form.serviceName,
      fileId,
    };
    if (selectedImage) {
      const formData = new FormData();
      formData.append('file', selectedImage);
      const res = await fetch('http://localhost:8080/api/v1/file/upload?category=HOSPITAL', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        alert('이미지 업로드 실패');
        return;
      }

      const data = await res.json();
      fileId = data.fileId; // ✅ 받아온 fileId 저장
    }
    const schedulePayloads = businessHours
      .filter(({ open, close }) => open && close)
      .map(({ scheduleId, day, open, close, lunchStart, lunchEnd }) => {
        const dayOfWeek = dayOfWeekMap[day];
        if (!dayOfWeek) {
          console.warn(`❗️[dayOfWeekMap] '${day}' 값이 올바르지 않거나 누락되었습니다.`);
          return null; // 또는 throw new Error(...) 처리도 가능
        }

        return {
          hospitalScheduleId: scheduleId,
          dayOfWeek,
          openTime: `${open}:00`,
          closeTime: `${close}:00`,
          lunchStart: `${lunchStart || '12:00'}:00`,
          lunchEnd: `${lunchEnd || '13:00'}:00`,
        };
      })
      .filter(Boolean); // null 제거

    const [toUpdate, toCreate] = [
      schedulePayloads.filter((s) => s.hospitalScheduleId),
      schedulePayloads.filter((s) => !s.hospitalScheduleId),
    ];

    try {
      let id = Number(hospitalId);
      if (isEdit) {
        await updateHospital(id, hospitalPayload);
      } else {
        const created = await registerHospital(hospitalPayload);
        id = created.hospitalId;
        setHospitalId(String(id));
        setIsEdit(true);
      }

      if (toUpdate.length) await updateHospitalSchedules(id, toUpdate);
      if (toCreate.length)
        await Promise.all(
          toCreate.map(({ hospitalScheduleId, ...rest }) => createHospitalSchedule(id, rest)),
        );

      alert(isEdit ? '수정 완료' : '등록 완료');
    } catch (err) {
      console.error(err);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
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
          disabled={isEdit && initialBusinessNumber !== ''}
        />
        {formErrors.businessNumber && <ErrorMessage>{formErrors.businessNumber}</ErrorMessage>}
      </FieldWrapper>
      <FieldWrapper>
        <Label>주소</Label>
        <HospitalDaumPost
          ref={addressRef}
          address={form.address}
          setAddress={(addr) => setForm((prev) => ({ ...prev, address: addr }))}
          setCoords={setCoords}
        />
        {formErrors.address && <ErrorMessage>{formErrors.address}</ErrorMessage>}
      </FieldWrapper>
      <FieldWrapper>
        <Label>전화번호</Label>
        <Input
          ref={phoneRef}
          value={form.phoneNumber}
          onChange={handleChange('phoneNumber')}
          placeholder="010-1234-5678"
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
        <Label>병원 이미지</Label>
        <FileInput type="file" accept="image/*" onChange={handleImageChange} />
        {previewUrl && <PreviewImage src={previewUrl} alt="미리보기" />}
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
        {businessHours.map((hour, idx) => (
          <DayRow key={idx}>
            <DayLabel>{hour.day}</DayLabel>
            <TimeInput type="time" value={hour.open} onChange={handleTimeChange(idx, 'open')} />
            <TimeSeparator>~</TimeSeparator>
            <TimeInput type="time" value={hour.close} onChange={handleTimeChange(idx, 'close')} />
            <LunchLabel>| 점심 </LunchLabel>
            <TimeInput
              type="time"
              value={hour.lunchStart}
              onChange={handleTimeChange(idx, 'lunchStart')}
            />
            <TimeSeparator>~</TimeSeparator>
            <TimeInput
              type="time"
              value={hour.lunchEnd}
              onChange={handleTimeChange(idx, 'lunchEnd')}
            />
          </DayRow>
        ))}
      </BusinessHoursWrapper>
      <Button type="button" variant="secondary" onClick={() => setIsModalOpen(true)}>
        대기 인원 등록
      </Button>
      {isModalOpen && (
        <WaitModal onClose={() => setIsModalOpen(false)} onConfirm={handleRegisterWaiting} />
      )}
      <Button type="submit">{isEdit ? '병원 수정' : '병원 등록'}</Button>
    </Form>
  );
};

export default HospitalRegisterForm;
const LunchLabel = styled.span`
  font-weight: 500;
  color: #6b7280;
`;
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
const NewServiceInput = styled.input`
  border: 1px solid #d1d5db;
  border-radius: 9999px;
  padding: 4px 8px;
  font-size: 0.875rem;
  outline: none;
  width: 120px;
`;
const Form = styled.form`
  max-width: 48rem;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
const BusinessHoursWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;
const DayRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: #f9fafb;
  padding: 0.75rem;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;
const DayLabel = styled.span`
  width: 5rem;
  font-weight: 500;
`;
const TimeInput = styled(Input)`
  padding: 0.25rem;
  width: 7rem;
`;
const TimeSeparator = styled.span`
  font-weight: 600;
  color: #6b7280;
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

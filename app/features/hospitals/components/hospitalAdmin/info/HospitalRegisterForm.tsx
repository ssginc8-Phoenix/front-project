import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { X, Plus } from 'lucide-react';
import {
  registerHospital,
  updateHospital,
  getMyHospital,
  getHospitalSchedules,
  updateHospitalSchedule,
  createHospitalSchedule,
  createWaiting,
} from '~/features/hospitals/api/hospitalAPI';
import HospitalDaumPost from '~/features/hospitals/components/hospitalAdmin/info/HospitalDaumPost';
import WaitModal from '~/features/hospitals/components/RegisterWaitModal';
import type {
  CreateScheduleRequest,
  CreateHospitalRequest,
} from '~/features/hospitals/types/hospital';

interface HourRow {
  scheduleId?: number;
  day: string;
  open: string;
  close: string;
}

// --- ServiceInputChips 컴포넌트 ---
const ChipsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
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

// --- HospitalRegisterForm 컴포넌트 ---
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

const HospitalRegisterForm: React.FC = () => {
  const [hospitalId, setHospitalId] = useState<string | null>(null);
  const isEdit = Boolean(hospitalId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    address: '',
    phoneNumber: '',
    businessNumber: '',
    intro: '',
    notice: '',
    serviceNames: [] as string[],
    waiting: '',
  });
  const [coords, setCoords] = useState({ lat: 0, lng: 0 });
  const [businessHours, setBusinessHours] = useState<HourRow[]>([
    { day: '월요일', open: '', close: '' },
    { day: '화요일', open: '', close: '' },
    { day: '수요일', open: '', close: '' },
    { day: '목요일', open: '', close: '' },
    { day: '금요일', open: '', close: '' },
    { day: '토요일', open: '', close: '' },
    { day: '일요일', open: '', close: '' },
  ]);
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
    (
      ({
        MONDAY: '월요일',
        TUESDAY: '화요일',
        WEDNESDAY: '수요일',
        THURSDAY: '목요일',
        FRIDAY: '금요일',
        SATURDAY: '토요일',
        SUNDAY: '일요일',
      }) as Record<string, string>
    )[d];

  useEffect(() => {
    const fetchHospitalAndSchedules = async () => {
      try {
        const data = await getMyHospital();
        if (!data) {
          setHospitalId(null);
          return;
        }
        setHospitalId(String(data.hospitalId));
        setForm({
          name: data.name || '',
          address: data.address || '',
          phoneNumber: data.phone || '',
          businessNumber: data.businessRegistrationNumber || '',
          intro: data.introduction || '',
          notice: data.notice || '',
          serviceNames: data.serviceNames || [],
          waiting: data.waiting?.toString() || '',
        });
        setCoords({ lat: data.latitude || 0, lng: data.longitude || 0 });
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
                }
              : row;
          }),
        );
      } catch (err) {
        console.error(err);
        setHospitalId(null);
      }
    };
    fetchHospitalAndSchedules();
  }, []);

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

  const handleChange =
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((p) => ({
        ...p,
        [key]:
          key === 'serviceNames'
            ? e.target.value
                .split(',')
                .map((s) => s.trim())
                .filter((s) => s)
            : e.target.value,
      }));
    };

  const handleTimeChange =
    (idx: number, key: 'open' | 'close') => (e: React.ChangeEvent<HTMLInputElement>) => {
      setBusinessHours((prev) => {
        const next = [...prev];
        next[idx] = { ...next[idx], [key]: e.target.value };
        return next;
      });
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentUserId = Number(localStorage.getItem('userId') || '0');
    const hospitalPayload: CreateHospitalRequest = {
      userId: currentUserId,
      name: form.name,
      address: form.address,
      latitude: coords.lat,
      longitude: coords.lng,
      phone: form.phoneNumber,
      introduction: form.intro,
      notice: form.notice,
      businessRegistrationNumber: form.businessNumber,
      serviceNames: form.serviceNames,
    };
    const schedulePayloads = businessHours.map(
      ({ scheduleId, day, open, close }) =>
        ({
          scheduleId,
          data: {
            dayOfWeek: dayOfWeekMap[day],
            openTime: `${open}:00`,
            closeTime: `${close}:00`,
            lunchStart: '12:00:00',
            lunchEnd: '13:00:00',
          },
        }) as { scheduleId?: number; data: CreateScheduleRequest },
    );

    try {
      let realHospitalId = Number(hospitalId);
      if (isEdit && hospitalId) {
        await updateHospital(realHospitalId, hospitalPayload);
      } else {
        const created = await registerHospital(hospitalPayload);
        realHospitalId = created.hospitalId;
        setHospitalId(String(realHospitalId));
      }
      await Promise.all(
        schedulePayloads.map(({ scheduleId, data }) =>
          scheduleId
            ? updateHospitalSchedule(realHospitalId, scheduleId, data)
            : createHospitalSchedule(realHospitalId, data),
        ),
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
          value={form.name}
          onChange={handleChange('name')}
          placeholder="병원명을 입력하세요"
        />
      </FieldWrapper>
      <FieldWrapper>
        <Label>사업자 번호</Label>
        <Input value={form.businessNumber} disabled />
      </FieldWrapper>
      <FieldWrapper>
        <Label>주소</Label>
        <HospitalDaumPost
          address={form.address}
          setAddress={(addr) => setForm((p) => ({ ...p, address: addr }))}
          setCoords={setCoords}
        />
      </FieldWrapper>
      <FieldWrapper>
        <Label>전화번호</Label>
        <Input
          value={form.phoneNumber}
          onChange={handleChange('phoneNumber')}
          placeholder="010-1234-5678"
        />
      </FieldWrapper>
      <FieldWrapper>
        <Label>곳서비스 이름</Label>
        <ServiceInputChips
          services={form.serviceNames}
          onChange={(arr) => setForm((p) => ({ ...p, serviceNames: arr }))}
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

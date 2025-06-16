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
  deleteHospitalSchedule,
  createWaiting,
} from '~/features/hospitals/api/hospitalAPI';
import HospitalDaumPost from '~/features/hospitals/components/hospitalAdmin/info/HospitalDaumPost';

import type {
  CreateScheduleRequest,
  CreateHospitalRequest,
} from '~/features/hospitals/types/hospital';
import WaitModal from '~/features/hospitals/components/RegisterWaitModal';

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
  object-fit: contain; // cover → contain 으로 변경
  margin-top: 0.5rem;
  border-radius: 0.5rem;
  background: #f9fafb; // 이미지가 작을 경우 배경 처리도 가능
`;

const HospitalUpdateForm: React.FC = () => {
  const [hospitalId, setHospitalId] = useState<string | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [, setExistingFileId] = useState<number | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const businessNumberRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | undefined>(undefined);
  const [previewUrl, setPreviewUrl] = useState<string>('');
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
    Object.keys(dayOfWeekMap).map((day) => ({
      day,
      open: '',
      close: '',
      lunchStart: '',
      lunchEnd: '',
    })),
  );

  useEffect(() => {
    const fetchHospitalAndSchedules = async () => {
      try {
        const data = await getMyHospital();
        console.log('[병원 데이터]', data);
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
        // 수정된 코드
        if (data.imageUrl) {
          console.log('[이미지 불러오기]', data.imageUrl);
          setPreviewUrl(data.imageUrl);
        }

        if (data.fileId) setExistingFileId(data.fileId);

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
              : { ...row, lunchStart: '', lunchEnd: '' };
          }),
        );
      } catch (err) {
        console.error(err);
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

  const handleChange =
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const handleScheduleChange = (idx: number, key: keyof HourRow, value: string) => {
    setBusinessHours((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [key]: value };
      return updated;
    });
  };

  const [formErrors, setFormErrors] = useState({
    name: '',
    businessNumber: '',
    address: '',
    phoneNumber: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

      setExistingFileId(data.fileId);
    }

    const newErrors = {
      name: form.name.trim() ? '' : '병원명은 필수 입력 항목입니다.',
      businessNumber: form.businessNumber.trim() ? '' : '사업자번호는 필수 입력 항목입니다.',
      address: form.address.trim() ? '' : '주소는 필수 입력 항목입니다.',
      phoneNumber: form.phoneNumber.trim() ? '' : '전화번호는 필수 입력 항목입니다.',
    };
    setFormErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    const hospitalPayload: CreateHospitalRequest = {
      userId: Number(localStorage.getItem('userId') || '0'),
      name: form.name,
      address: form.address,
      latitude: coords.lat,
      longitude: coords.lng,
      phone: form.phoneNumber,
      introduction: form.intro,
      notice: form.notice,
      businessRegistrationNumber: form.businessNumber,
      serviceNames: form.serviceName,
      file: selectedImage,
    };

    const schedulePayloads = businessHours
      .filter(({ open, close }) => open && close)
      .map(({ scheduleId, day, open, close, lunchStart, lunchEnd }) => {
        const dayOfWeek = dayOfWeekMap[day];
        return {
          hospitalScheduleId: scheduleId,
          dayOfWeek,
          openTime: `${open}:00`,
          closeTime: `${close}:00`,
          lunchStart: lunchStart ? `${lunchStart}:00` : '',
          lunchEnd: lunchEnd ? `${lunchEnd}:00` : '',
        };
      });

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

      console.log('[병원 저장 요청]', hospitalPayload);

      if (toUpdate.length) await updateHospitalSchedules(id, toUpdate);
      if (toCreate.length) {
        await Promise.all(toCreate.map(({ ...rest }) => createHospitalSchedule(id, rest)));
      }

      alert(isEdit ? '수정 완료' : '등록 완료');
    } catch (err) {
      console.error(err);
      alert('저장 중 오류가 발생했습니다.');
    }
  };
  const handleRemoveSchedule = async (idx: number) => {
    const target = businessHours[idx];
    if (target.scheduleId && hospitalId) {
      try {
        await deleteHospitalSchedule(Number(hospitalId), target.scheduleId);
      } catch (error) {
        console.error('스케줄 삭제 실패', error);
      }
    }
    setBusinessHours((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddSchedule = () => {
    const used = businessHours.map((b) => dayOfWeekMap[b.day]);
    const available = (Object.values(dayOfWeekMap) as CreateScheduleRequest['dayOfWeek'][]).find(
      (d) => !used.includes(d),
    );
    if (!available) return alert('모든 요일이 이미 등록되었습니다.');
    const kor = Object.entries(dayOfWeekMap).find(([, val]) => val === available)?.[0] ?? '';
    setBusinessHours((prev) => [
      ...prev,
      { day: kor, open: '', close: '', lunchStart: '', lunchEnd: '' },
    ]);
  };
  return (
    <Form onSubmit={handleSubmit}>
      <FieldWrapper>
        <Label>병원 이미지</Label>
        <FileInput type="file" accept="image/*" onChange={handleImageChange} />
        {previewUrl && <PreviewImage src={previewUrl} alt="미리보기" />}
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

            {/* 오픈/종료 */}
            {(['open', 'close'] as const).map((key) => (
              <StyledTimeSelect
                key={key}
                value={row[key]}
                onChange={(e) => handleScheduleChange(idx, key, e.target.value)}
              >
                <option value="">시간 선택</option>
                {timeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </StyledTimeSelect>
            ))}

            <span style={{ fontWeight: 500 }}>점심:</span>

            {/* 점심 시작/종료 */}
            {(['lunchStart', 'lunchEnd'] as const).map((key) => (
              <StyledTimeSelect
                key={key}
                value={row[key]}
                onChange={(e) => handleScheduleChange(idx, key, e.target.value)}
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

const StyledTimeSelect = styled.select`
  width: 100px;
  padding: 0.4rem;
  border: 1px solid #ccc;
  border-radius: 0.375rem;
`;

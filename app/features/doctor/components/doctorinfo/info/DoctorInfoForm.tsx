import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { getMyDoctorInfo, updateDoctorProfile } from '~/features/doctor/api/doctorAPI';

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
const ImagePreview = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-top: 0.5rem;
`;
const SaveButton = styled.button`
  padding: 0.75rem;
  background-color: #00499e;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background-color: #003c80;
  }
`;

export const specializationLabelMap: Record<string, string> = {
  CARDIOLOGY: '심장내과',
  NEUROLOGY: '신경과',
  DERMATOLOGY: '피부과',
  PEDIATRICS: '소아과',
  ORTHOPEDICS: '정형외과',
  RADIOLOGY: '영상의학과',
  ONCOLOGY: '종양내과',
  GYNECOLOGY: '산부인과',
  PSYCHIATRY: '정신과',
  GENERAL_SURGERY: '일반외과',
  UROLOGY: '비뇨기과',
  OPHTHALMOLOGY: '안과',
  ENT: '이비인후과',
  INTERNAL_MEDICINE: '내과',
};

const DoctorInfoForm: React.FC = () => {
  const [doctorId, setDoctorId] = useState<number | null>(null);
  const [form, setForm] = useState({
    hospitalName: '',
    hospitalAddress: '',
    doctorName: '',
    specialty: '',
    capacityPerHalfHour: '',
    phone: '',
    imageUrl: '',
  });
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchDoctorInfo = async () => {
      try {
        const data = await getMyDoctorInfo();
        console.log('[DoctorInfoForm] 의사 정보:', data);
        setDoctorId(data.doctorId);
        setForm({
          hospitalName: data.hospitalName || '',
          hospitalAddress: data.address || '',
          doctorName: data.name || '',
          specialty: data.specialization || '',
          capacityPerHalfHour: data.capacityPerHalfHour?.toString() || '',
          phone: data.phone || '',
          imageUrl: data.imageUrl || '',
        });
        setPreview(data.imageUrl || null);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDoctorInfo();
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, phone: e.target.value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const handleSave = async () => {
    if (!doctorId) return;

    const formData = new FormData();
    formData.append(
      'data',
      new Blob([JSON.stringify({ phone: form.phone })], { type: 'application/json' }),
    );
    if (fileInputRef.current?.files?.[0]) {
      formData.append('profile', fileInputRef.current.files[0]);
    }

    try {
      await updateDoctorProfile(doctorId, formData);
      alert('프로필이 수정되었습니다.');
    } catch (err) {
      console.error(err);
      alert('수정에 실패했습니다.');
    }
  };

  return (
    <Form>
      <FieldWrapper>
        <Label>소속 병원</Label>
        <Input value={form.hospitalName} disabled />
      </FieldWrapper>
      <FieldWrapper>
        <Label>병원 주소</Label>
        <Input value={form.hospitalAddress} disabled />
      </FieldWrapper>
      <FieldWrapper>
        <Label>의사 이름</Label>
        <Input value={form.doctorName} disabled />
      </FieldWrapper>
      <FieldWrapper>
        <Label>전공</Label>
        <Input value={specializationLabelMap[form.specialty] || form.specialty} disabled />
      </FieldWrapper>
      <FieldWrapper>
        <Label>전화번호</Label>
        <Input value={form.phone} onChange={handlePhoneChange} />
      </FieldWrapper>
      <FieldWrapper>
        <Label>프로필 이미지</Label>
        <Input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} />
        {preview && <ImagePreview src={preview} alt="Profile preview" />}
      </FieldWrapper>
      <SaveButton type="button" onClick={handleSave}>
        저장
      </SaveButton>
    </Form>
  );
};

export default DoctorInfoForm;

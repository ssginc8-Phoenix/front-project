import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getMyDoctorInfo } from '~/features/doctor/api/doctorAPI';

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
  const [, setDoctorId] = useState<number | null>(null);
  const [form, setForm] = useState({
    hospitalName: '',
    hospitalAddress: '',
    doctorName: '',
    specialty: '',
    capacityPerHalfHour: '',
  });

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
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchDoctorInfo();
  }, []);

  const handleChange = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
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
    </Form>
  );
};

export default DoctorInfoForm;

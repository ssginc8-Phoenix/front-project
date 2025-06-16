import styled from 'styled-components';
import type { DoctorInfo } from '~/types/user';

interface Props {
  doctor: DoctorInfo;
  index: number;
  onChange: (index: number, field: keyof DoctorInfo, value: string) => void;
  onCheckEmail: (index: number, email: string) => void;
  onRemove: (index: number) => void;
  emailCheckMessage?: string;
  emailCheckSuccess?: boolean;
}
const SPECIALIZATIONS = [
  { value: 'CARDIOLOGY', label: '심장내과' },
  { value: 'NEUROLOGY', label: '신경과' },
  { value: 'DERMATOLOGY', label: '피부과' },
  { value: 'PEDIATRICS', label: '소아과' },
  { value: 'RADIOLOGY', label: '영상의학과' },
  { value: 'ONCOLOGY', label: '종양내과' },
  { value: 'GYNECOLOGY', label: '산부인과' },
  { value: 'PSYCHIATRY', label: '정신과' },
  { value: 'GENERAL_SURGERY', label: '일반외과' },
  { value: 'UROLOGY', label: '비뇨기과' },
  { value: 'OPHTHALMOLOGY', label: '안과' },
  { value: 'ENT', label: '이비인후과' },
  { value: 'INTERNAL_MEDICINE', label: '내과' },
];
const DoctorForm = ({
  doctor,
  index,
  onChange,
  onCheckEmail,
  onRemove,
  emailCheckMessage = '',
  emailCheckSuccess = false,
}: Props) => {
  return (
    <FormBlock>
      <FieldGroup>
        <Label>이메일</Label>
        <EmailGroup>
          <Input
            type="email"
            value={doctor.email}
            onChange={(e) => onChange(index, 'email', e.target.value)}
          />
          <Button type="button" onClick={() => onCheckEmail(index, doctor.email)}>
            중복 확인
          </Button>
        </EmailGroup>
        <EmailCheckMessage success={emailCheckSuccess}>{emailCheckMessage}</EmailCheckMessage>
      </FieldGroup>

      <FieldGroup>
        <Label>비밀번호</Label>
        <Input
          type="password"
          value={doctor.password}
          onChange={(e) => onChange(index, 'password', e.target.value)}
        />
      </FieldGroup>

      <FieldGroup>
        <Label>이름</Label>
        <Input
          type="text"
          value={doctor.name}
          onChange={(e) => onChange(index, 'name', e.target.value)}
        />
      </FieldGroup>

      <FieldGroup>
        <Label>휴대폰 번호</Label>
        <Input
          type="tel"
          value={doctor.phone}
          onChange={(e) => {
            const raw = e.target.value.replace(/\D/g, '').slice(0, 11); // 숫자만, 최대 11자리
            let formatted = raw;

            if (raw.length <= 3) {
              formatted = raw;
            } else if (raw.length <= 7) {
              formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`;
            } else {
              formatted = `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7)}`;
            }

            onChange(index, 'phone', formatted);
          }}
        />
      </FieldGroup>

      <FieldGroup>
        <Label>전공</Label>
        <Select
          value={doctor.specialization}
          onChange={(e) => onChange(index, 'specialization', e.target.value)}
        >
          <option value="">전공을 선택하세요</option>
          {SPECIALIZATIONS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </Select>
      </FieldGroup>

      <ButtonRow>
        <RemoveButton type="button" onClick={() => onRemove(index)}>
          삭제하기
        </RemoveButton>
      </ButtonRow>
    </FormBlock>
  );
};

export default DoctorForm;

const FormBlock = styled.div`
  padding: 1rem;
  margin-bottom: 1.5rem;
  border: 1px solid #eee;
  border-radius: 1rem;
  background-color: #f9f9f9;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
  }
`;

const EmailGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;
const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  font-size: 1rem;
  background-color: white;
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
  }
`;
const EmailCheckMessage = styled.div<{ success: boolean }>`
  font-size: 0.85rem;
  margin-top: 0.25rem;
  color: ${(props) => (props.success ? '#007bff' : 'red')};
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  &:hover {
    background-color: #005fcc;
  }
`;

const RemoveButton = styled(Button)`
  background-color: #dc3545;
  &:hover {
    background-color: #c82333;
  }
`;

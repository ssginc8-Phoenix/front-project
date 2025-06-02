import styled from 'styled-components';
import type { DoctorInfo } from '~/types/user';

interface Props {
  doctor: DoctorInfo;
  index: number;
  onChange: (index: number, field: keyof DoctorInfo, value: string) => void;
}

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

const FormBlock = styled.div`
  padding: 1rem;
  margin-bottom: 1.5rem;
  border: 1px solid #eee;
  border-radius: 1rem;
  background-color: #f9f9f9;
`;

const DoctorForm = ({ doctor, index, onChange }: Props) => {
  return (
    <FormBlock>
      <FieldGroup>
        <Label>이메일</Label>
        <Input
          type="email"
          value={doctor.email}
          onChange={(e) => onChange(index, 'email', e.target.value)}
        />
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
          onChange={(e) => onChange(index, 'phone', e.target.value)}
        />
      </FieldGroup>
    </FormBlock>
  );
};

export default DoctorForm;

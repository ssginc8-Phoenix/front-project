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

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

const EmailGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const EmailCheckMessage = styled.div<{ success: boolean }>`
  font-size: 0.85rem;
  margin-top: 0.25rem;
  color: ${(props) => (props.success ? '#007bff' : 'red')};
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
          onChange={(e) => onChange(index, 'phone', e.target.value)}
        />
      </FieldGroup>
      <FieldGroup>
        <Label>전공</Label>
        <Input
          type="text"
          value={doctor.specialization}
          onChange={(e) => onChange(index, 'specialization', e.target.value)}
        />
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

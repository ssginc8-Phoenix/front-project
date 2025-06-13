import styled from 'styled-components';
import type { DoctorInfo } from '~/types/user';
import { useEffect, useState } from 'react';

interface Props {
  doctor: DoctorInfo;
  index: number;
  onChange: (index: number, field: keyof DoctorInfo, value: string) => void;
  onCheckEmail: (index: number, email: string) => void;
  onRemove: (index: number) => void;
  emailCheckMessage?: string;
  emailCheckSuccess?: boolean;
  onPhoneValidChange?: (index: number, isValid: boolean) => void;
}

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 28px;
`;

const Label = styled.label`
  font-size: 1.05rem;
  font-weight: 600;
  color: #222;
`;

const InputWithButton = styled.div`
  display: flex;
  gap: 16px;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 32px;
`;

const FormBlock = styled.div`
  background: #ffffff;
  padding: 3rem;
  border-radius: 1.5rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
  margin-bottom: 3rem;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.08);
  }
`;

const Input = styled.input`
  padding: 1rem 1.25rem;
  font-size: 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.75rem;
  background-color: #f9fafb;
  transition: all 0.25s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
    background-color: #ffffff;
  }
`;

const ActionButton = styled.button`
  padding: 0.9rem 1.5rem;
  font-size: 0.95rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #2563eb;
  }
`;

const RemoveButton = styled(ActionButton)`
  background-color: #ef4444;

  &:hover {
    background-color: #dc2626;
  }
`;

const EmailCheckMessage = styled.div<{ success: boolean }>`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${(props) => (props.success ? '#10b981' : '#ef4444')};
  margin-top: 0.5rem;
  min-height: 1.25rem;
`;

const DoctorForm = ({
  doctor,
  index,
  onChange,
  onCheckEmail,
  onRemove,
  emailCheckMessage = '',
  emailCheckSuccess = false,
  onPhoneValidChange,
}: Props) => {
  const [phoneError, setPhoneError] = useState('');

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length < 4) return digits;
    if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  };

  const isValidPhone = (phone: string) => /^01[016789]-\d{3,4}-\d{4}$/.test(phone);

  useEffect(() => {
    const formatted = formatPhoneNumber(doctor.phone);
    const valid = isValidPhone(formatted);

    setPhoneError(
      doctor.phone && !valid ? '휴대폰 번호 형식이 올바르지 않습니다. (예: 010-1234-5678)' : '',
    );

    onPhoneValidChange?.(index, valid);
  }, [doctor.phone]);

  return (
    <FormBlock>
      <FieldGroup>
        <Label>이메일</Label>
        <InputWithButton>
          <Input
            type="email"
            value={doctor.email}
            onChange={(e) => onChange(index, 'email', e.target.value)}
            required
            style={{ flex: 1 }}
          />
          <ActionButton type="button" onClick={() => onCheckEmail(index, doctor.email)}>
            중복 확인
          </ActionButton>
        </InputWithButton>
        <EmailCheckMessage success={emailCheckSuccess}>
          {emailCheckMessage || '이메일 중복 확인을 해주세요.'}
        </EmailCheckMessage>
      </FieldGroup>

      <FieldGroup>
        <Label>비밀번호</Label>
        <Input
          type="password"
          value={doctor.password}
          onChange={(e) => onChange(index, 'password', e.target.value)}
          required
        />
      </FieldGroup>

      <FieldGroup>
        <Label>이름</Label>
        <Input
          type="text"
          value={doctor.name}
          onChange={(e) => onChange(index, 'name', e.target.value)}
          required
        />
      </FieldGroup>

      <FieldGroup>
        <Label>휴대폰 번호</Label>
        <Input
          type="tel"
          value={formatPhoneNumber(doctor.phone)}
          onChange={(e) => onChange(index, 'phone', e.target.value.replace(/\D/g, ''))}
          required
        />
        {phoneError && <EmailCheckMessage success={false}>{phoneError}</EmailCheckMessage>}
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

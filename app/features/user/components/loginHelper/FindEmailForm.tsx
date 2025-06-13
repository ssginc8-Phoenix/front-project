import styled from 'styled-components';
import { useState } from 'react';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
  }
`;

const Button = styled.button`
  padding: 1rem;
  margin-top: 1rem;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: #005fcc;
  }
`;

interface Props {
  onFindEmail: (name: string, phone: string) => void;
}

const formatPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11); // 숫자만 추출해서 11자리 제한
  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};

const FindEmailForm = ({ onFindEmail }: Props) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFindEmail(name, phone.replace(/-/g, ''));
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FieldGroup>
        <Label>이름</Label>
        <Input
          type="text"
          placeholder="홍길동"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </FieldGroup>
      <FieldGroup>
        <Label>휴대폰 번호</Label>
        <Input
          type="tel"
          placeholder="010-1234-5678"
          value={phone}
          onChange={handlePhoneChange}
          required
        />
      </FieldGroup>
      <Button type="submit">이메일 찾기</Button>
    </Form>
  );
};

export default FindEmailForm;

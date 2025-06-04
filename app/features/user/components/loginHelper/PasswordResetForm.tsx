import { useState } from 'react';
import styled from 'styled-components';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background-color: #f9f9f9;
  padding: 2rem;
  border-radius: 1rem;
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
  padding: 0.75rem 1rem;
  background-color: #007bff;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  &:hover {
    background-color: #005fcc;
  }
`;

const ErrorMessage = styled.p`
  font-size: 0.85rem;
  color: red;
  margin-top: 0.5rem;
`;

interface Props {
  onSubmit: (password: string) => void;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

const PasswordResetForm = ({ onSubmit, error, setError }: Props) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    setError('');
    try {
      onSubmit(password);
    } catch (err: any) {
      console.log('문제발생..');
      const errorMessage = err.response?.data?.message || '알 수 없는 오류가 발생했습니다.';
      console.log(errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FieldGroup>
        <Label>새 비밀번호</Label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호를 입력하세요"
          required
        />
      </FieldGroup>

      <FieldGroup>
        <Label>새 비밀번호 확인</Label>
        <Input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="비밀번호를 다시 입력하세요"
          required
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </FieldGroup>

      <Button type="submit">변경하기</Button>
    </Form>
  );
};

export default PasswordResetForm;

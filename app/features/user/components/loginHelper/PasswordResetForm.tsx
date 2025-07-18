import { useState } from 'react';
import styled from 'styled-components';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background-color: #f9f9f9;
  padding: 2rem;
  border-radius: 1rem;

  @media (max-width: 360px) {
    gap: 1rem;
    padding: 1.5rem;
  }
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;

  @media (max-width: 360px) {
    font-size: 0.9rem;
    margin-bottom: 0.3rem;
  }
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

  @media (max-width: 360px) {
    padding: 0.6rem;
    font-size: 0.9rem;
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

  @media (max-width: 360px) {
    padding: 0.6rem 0.8rem;
    font-size: 0.9rem;
  }
`;

const ErrorMessage = styled.p`
  font-size: 0.85rem;
  color: red;
  margin-top: 0.5rem;

  @media (max-width: 360px) {
    font-size: 0.75rem;
    margin-top: 0.3rem;
  }
`;

interface Props {
  onSubmit: (password: string) => void;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  validatePassword: (password: string) => string;
}

const PasswordResetForm = ({ onSubmit, error, setError, validatePassword }: Props) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localValidationError, setLocalValidationError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const ruleCheck = validatePassword(password);
    if (ruleCheck) {
      setLocalValidationError(ruleCheck);
      return;
    } else {
      setLocalValidationError('');
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setError('');
    onSubmit(password);
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
        {localValidationError && <ErrorMessage>{localValidationError}</ErrorMessage>}
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

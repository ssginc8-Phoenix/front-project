import { useEffect, useState } from 'react';
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

const ButtonRow = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Button = styled.button`
  padding: 0.75rem 1rem;
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

const ErrorMessage = styled.p`
  font-size: 0.85rem;
  color: red;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

interface Props {
  onSendCode: (email: string) => void;
  onVerifyCode: (email: string, code: string) => Promise<boolean>;
  onSuccess: (email: string) => void;
}

const PasswordResetForm = ({ onSendCode, onVerifyCode, onSuccess }: Props) => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(300); // 5 minutes
  const [isCodeSent, setIsCodeSent] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCodeSent && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isCodeSent, timer]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSendCode = () => {
    if (!email) return;
    onSendCode(email);
    setIsCodeSent(true);
    setTimer(300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valid = await onVerifyCode(email, code);
    if (!valid) {
      setError('인증 코드가 올바르지 않습니다.');
    } else {
      setError('');
      onSuccess(email);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FieldGroup>
        <Label>이메일</Label>
        <ButtonRow>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@example.com"
            required
          />
          <Button type="button" onClick={handleSendCode} disabled={timer > 0 && isCodeSent}>
            {isCodeSent ? `재전송 (${formatTime(timer)})` : '인증 코드 전송'}
          </Button>
        </ButtonRow>
      </FieldGroup>

      {isCodeSent && (
        <FieldGroup>
          <Label>인증 코드</Label>
          <Input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="6자리 숫자 코드 입력"
            required
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </FieldGroup>
      )}

      <Button type="submit">비밀번호 재설정 페이지로 이동</Button>
    </Form>
  );
};

export default PasswordResetForm;

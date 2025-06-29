import { useEffect, useState } from 'react';
import styled from 'styled-components';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background-color: #f9f9f9;
  padding: 2rem;
  border-radius: 1rem;

  /* Responsive adjustments for Form */
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

  /* Responsive adjustments for Label */
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
  flex: 1;
  /* Added explicit height and box-sizing */
  height: 45px; /* Default height */
  box-sizing: border-box; /* Ensures padding doesn't add to the total height */

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
  }

  /* Responsive adjustments for Input */
  @media (max-width: 360px) {
    height: 38px; /* Reduced height for mobile */
    padding: 0.6rem;
    font-size: 0.9rem;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 0.5rem;

  /* Responsive adjustments for ButtonRow */
  @media (max-width: 360px) {
    flex-direction: column; /* Stack buttons vertically on mobile */
    gap: 0.8rem; /* Increase gap when stacked */
  }
`;

const Button = styled.button`
  padding: 0.75rem 1rem;
  background-color: #007bff;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  flex-shrink: 0; /* Prevent button from shrinking */

  &:hover {
    background-color: #005fcc;
  }

  /* Responsive adjustments for Button */
  @media (max-width: 360px) {
    width: 100%; /* Full width when stacked */
    padding: 0.6rem 0.8rem; /* Adjust padding */
    font-size: 0.9rem; /* Adjust font size */
  }
`;

const ErrorMessage = styled.p`
  font-size: 0.85rem;
  color: red;
  margin-top: 1rem;
  margin-bottom: 1rem;

  /* Responsive adjustments for ErrorMessage */
  @media (max-width: 360px) {
    font-size: 0.75rem;
    margin-top: 0.8rem;
    margin-bottom: 0.8rem;
  }
`;

interface Props {
  onSendCode: (email: string) => void;
  onVerifyCode: (email: string, code: string) => Promise<boolean>;
  onSuccess: (email: string) => void;
}

const PasswordResetVerifyForm = ({ onSendCode, onVerifyCode, onSuccess }: Props) => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(300);
  const [isCodeSent, setIsCodeSent] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCodeSent && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0 && isCodeSent) {
      setError('인증 유효 시간이 만료되었습니다. 다시 시도해주세요.');
      setIsCodeSent(false);
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
    if (!email) {
      setError('이메일을 입력해주세요.');
      return;
    }
    setError('');
    onSendCode(email);
    setIsCodeSent(true);
    setTimer(300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCodeSent) {
      setError('인증 코드를 먼저 전송해주세요.');
      return;
    }
    if (timer === 0) {
      setError('인증 유효 시간이 만료되었습니다. 인증 코드를 다시 전송해주세요.');
      return;
    }

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
          <Button
            type="button"
            onClick={handleSendCode}
            disabled={timer > 0 && isCodeSent && timer !== 300}
          >
            {isCodeSent && timer > 0 ? `재전송 (${formatTime(timer)})` : '인증 코드 전송'}
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
            placeholder="이메일로 전송된 코드 입력"
            required
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </FieldGroup>
      )}
      <Button type="submit">비밀번호 재설정 페이지로 이동</Button>
      {error && !isCodeSent && <ErrorMessage>{error}</ErrorMessage>}{' '}
    </Form>
  );
};

export default PasswordResetVerifyForm;

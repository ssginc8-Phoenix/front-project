import { useState } from 'react';
import styled from 'styled-components';
import Button from '~/components/styled/Button';
import type { Appointment } from '~/types/appointment';
import { useNavigate } from 'react-router';
import CommonModal from '~/components/common/CommonModal';

const Card = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 1.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  max-width: 500px;
  width: 100%;
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 2rem;
  color: #222;
`;

const Section = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  color: #666;
  margin-bottom: 0.5rem;
`;

const Value = styled.div`
  font-size: 1.05rem;
  font-weight: 500;
  color: #111;
`;

const AmountInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.75rem;
  box-sizing: border-box;

  &:focus {
    border-color: #007aff;
    outline: none;
  }
`;

const ErrorText = styled.div`
  color: red;
  font-size: 0.85rem;
  margin-top: 0.5rem;
`;

const SubmitButton = styled(Button)`
  width: 100%;
  padding: 0.9rem 0;
  margin-top: 1.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 0.75rem;
`;

interface PaymentFormProps {
  appointment: Appointment;
  onSubmit: (amount: number) => void;
}

const PaymentForm = ({ appointment, onSubmit }: PaymentFormProps) => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isRequestComplete, setIsRequestComplete] = useState(false);

  const handleSubmit = () => {
    if (!amount || isNaN(Number(amount))) {
      setErrorMessage('올바른 금액을 입력해주세요.');
      return;
    }

    setErrorMessage('');
    onSubmit(Number(amount));
    setIsRequestComplete(true);
  };

  return (
    <Card>
      <Title>결제 요청</Title>
      <Section>
        <Label>병원명</Label>
        <Value>{appointment.hospitalName}</Value>
      </Section>
      <Section>
        <Label>담당 의사</Label>
        <Value>{appointment.doctorName} 원장</Value>
      </Section>
      <Section>
        <Label>환자명</Label>
        <Value>{appointment.patientName}</Value>
      </Section>
      <Section>
        <Label>증상</Label>
        <Value>{appointment.symptom}</Value>
      </Section>

      <Section>
        <Label>결제 금액 (원)</Label>
        <AmountInput
          type="number"
          placeholder="금액을 입력하세요"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
      </Section>

      <SubmitButton $variant="primary" onClick={handleSubmit}>
        결제 요청하기
      </SubmitButton>
      {isRequestComplete && (
        <CommonModal
          title="결제 요청을 보냈습니다."
          buttonText="예약 내역 페이지로 이동하기"
          onClose={() => navigate('/appointments/list')}
        />
      )}
    </Card>
  );
};

export default PaymentForm;

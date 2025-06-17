import { useSearchParams } from 'react-router-dom';
import { useAppointmentDetail } from '~/features/appointment/hooks/useAppointmentDetail';
import LoadingIndicator from '~/components/common/LoadingIndicator';
import ErrorMessage from '~/components/common/ErrorMessage';
import styled from 'styled-components';
import Button from '~/components/styled/Button';
import { useState } from 'react';
import Header from '~/layout/Header';

const Container = styled.div`
  max-width: 600px;
  margin: 3rem auto;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: bold;
  color: #1e40af;
  margin-bottom: 1.5rem;
`;

const InfoRow = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.div`
  font-size: 0.9rem;
  color: #555;
`;

const Value = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
  color: #222;
`;

const Input = styled.input`
  width: 95%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  margin-top: 0.5rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  &:focus {
    border-color: #60a5fa;
    outline: none;
  }
`;

const ButtonGroup = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
`;

const PaymentRequestPage = () => {
  const [params] = useSearchParams();
  const appointmentId = Number(params.get('appointmentId'));

  const {
    data: appointment,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useAppointmentDetail(appointmentId);

  const [amount, setAmount] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handlePaymentRequest = () => {
    if (!amount || isNaN(Number(amount))) {
      alert('유효한 금액을 입력해주세요.');
      return;
    }

    console.log('결제 요청 ID:', appointment?.appointmentId);
    console.log('입력한 금액:', amount);
    setSubmitted(true);

    // TODO: 실제 결제 요청 API 호출
  };

  if (isLoading || isRefetching) return <LoadingIndicator />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!appointment) return <ErrorMessage message="예약 정보를 찾을 수 없습니다." />;

  const canRequestPayment = appointment.status === 'COMPLETED' && appointment.paymentType;

  return (
    <>
      <Header />
      <Container>
        <Title>결제 요청</Title>

        <InfoRow>
          <Label>병원명</Label>
          <Value>{appointment.hospitalName}</Value>
        </InfoRow>

        <InfoRow>
          <Label>의사명</Label>
          <Value>{appointment.doctorName} 원장</Value>
        </InfoRow>

        <InfoRow>
          <Label>환자명</Label>
          <Value>{appointment.patientName}</Value>
        </InfoRow>

        <InfoRow>
          <Label>진료 날짜</Label>
          <Value>{new Date(appointment.appointmentTime).toLocaleDateString()}</Value>
        </InfoRow>

        <InfoRow>
          <Label>진료 시간</Label>
          <Value>
            {new Date(appointment.appointmentTime).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Value>
        </InfoRow>

        <InfoRow>
          <Label>결제 방식</Label>
          <Value>{appointment.paymentType}</Value>
        </InfoRow>

        <InfoRow>
          <Label>결제 금액</Label>
          <Input
            type="number"
            placeholder="금액을 입력하세요 (원)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </InfoRow>

        <ButtonGroup>
          <Button
            $variant="primary"
            disabled={!canRequestPayment || !amount}
            onClick={handlePaymentRequest}
          >
            결제 요청하기
          </Button>
        </ButtonGroup>

        {submitted && (
          <p style={{ marginTop: '1rem', color: '#16a34a' }}>결제 요청이 완료되었습니다.</p>
        )}
      </Container>
    </>
  );
};

export default PaymentRequestPage;

import { useSearchParams } from 'react-router-dom';
import { useAppointmentDetail } from '~/features/appointment/hooks/useAppointmentDetail';
import LoadingIndicator from '~/components/common/LoadingIndicator';
import ErrorMessage from '~/components/common/ErrorMessage';
import Header from '~/layout/Header';
import styled from 'styled-components';
import PaymentForm from '../components/PaymentForm';
import { createPaymentRequest } from '~/features/payments/api/paymentsAPI';
import * as console from 'node:console';

const Container = styled.div`
  display: flex;
  justify-content: center;
  padding: 4rem 1rem;
  background-color: #f5f7fa;
  min-height: 100vh;
`;

const PaymentRequestPage = () => {
  const [searchParams] = useSearchParams();
  const appointmentId = Number(searchParams.get('appointmentId'));

  const { data: appointment, isLoading, error } = useAppointmentDetail(appointmentId);

  const handleSubmit = (amount: number) => {
    createPaymentRequest(appointmentId, amount);
  };

  if (isLoading) return <LoadingIndicator />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <>
      <Header />
      <Container>
        {appointment && <PaymentForm appointment={appointment} onSubmit={handleSubmit} />}
      </Container>
    </>
  );
};

export default PaymentRequestPage;

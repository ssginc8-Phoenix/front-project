import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import TossPayment from '~/features/payments/components/TossPayment';
import { getPaymentInfo } from '~/features/payments/api/paymentsAPI';
import Header from '~/layout/Header';

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 4rem 1.5rem;
  min-height: 100vh;
`;

const Card = styled.div`
  background: #ffffff;
  padding: 2.5rem 2rem;
  border-radius: 1.5rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 580px;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2.5rem;
  color: #1b1e28;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1.2rem 0;
  border-bottom: 1px solid #eceef1;

  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: #7d8791;
`;

const Value = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #1b1e28;
  text-align: right;
`;

const ButtonWrapper = styled.div`
  margin-top: 2.5rem;
  display: flex;
  justify-content: center;
`;

const PayButton = styled.button`
  background-color: #0064ff;
  color: white;
  font-size: 1.05rem;
  font-weight: 600;
  padding: 0.95rem 2.2rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s ease;
  margin-top: 5rem;

  &:hover {
    background-color: #004fcc;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(27, 30, 40, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 1.25rem;
  padding: 2rem;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
  color: #999;

  &:hover {
    color: #333;
  }
`;

const PaymentHistoryPage = () => {
  const [searchParams] = useSearchParams();
  const paymentRequestId = Number(searchParams.get('paymentRequestId'));
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const data = await getPaymentInfo(paymentRequestId);
        setPaymentInfo(data);
      } catch (err) {
        console.error('결제 정보 조회 실패:', err);
      }
    };

    if (paymentRequestId) {
      fetchInfo();
    }
  }, [paymentRequestId]);

  if (!paymentInfo) return <div>로딩 중...</div>;

  return (
    <>
      <PageContainer>
        <Card>
          <Title>진료 결제 내역</Title>
          <Row>
            <Label>병원명</Label>
            <Value>{paymentInfo.hospitalName}</Value>
          </Row>
          <Row>
            <Label>의사</Label>
            <Value>{paymentInfo.doctorName}</Value>
          </Row>
          <Row>
            <Label>환자명</Label>
            <Value>{paymentInfo.patientName}</Value>
          </Row>
          <Row>
            <Label>진료일시</Label>
            <Value>{paymentInfo.appointmentTime}</Value>
          </Row>
          <Row>
            <Label>결제 금액</Label>
            <Value>{paymentInfo.paymentAmount.toLocaleString()}원</Value>
          </Row>
          <Row>
            <Label>결제 상태</Label>
            <Value>{paymentInfo.requestStatus === 'COMPLETED' ? '결제 완료' : '미결제'}</Value>
          </Row>

          {paymentInfo.requestStatus === 'REQUESTED' && (
            <ButtonWrapper>
              <PayButton onClick={() => setShowModal(true)}>결제하기</PayButton>
            </ButtonWrapper>
          )}
        </Card>

        {showModal && (
          <ModalOverlay>
            <ModalContent>
              <CloseButton onClick={() => setShowModal(false)}>×</CloseButton>
              <TossPayment
                paymentRequestId={paymentRequestId}
                amount={paymentInfo.paymentAmount}
                name={paymentInfo.guardianName}
                email={paymentInfo.guardianEmail}
                onClose={() => setShowModal(false)}
              />
            </ModalContent>
          </ModalOverlay>
        )}
      </PageContainer>
    </>
  );
};

export default PaymentHistoryPage;

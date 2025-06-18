import { useEffect, useState } from 'react';
import {
  loadTossPayments,
  ANONYMOUS,
  type TossPaymentsWidgets,
} from '@tosspayments/tosspayments-sdk';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { updatePaymentRequestInfo } from '~/features/payments/api/paymentsAPI';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 2rem;
  width: 100%;
`;

const ContentBox = styled.div`
  width: 100%;
  max-width: 540px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const PaymentWidget = styled.div`
  width: 100%;
`;

const AgreementWidget = styled.div`
  width: 100%;
`;

const ButtonArea = styled.div`
  width: 100%;
`;

const PaymentButton = styled.button`
  width: 100%;
  padding: 12px 24px;
  background-color: #0074e9;
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.25s;

  &:hover {
    background-color: #005fc3;
  }
`;

const clientKey = 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm';

interface TossPaymentProps {
  paymentRequestId: number;
  amount: number;
  name: string;
  email: string;
  onClose: () => void;
}

const TossPayment = ({ paymentRequestId, amount, name, email, onClose }: TossPaymentProps) => {
  const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);
  const [customerKey, setCustomerKey] = useState<string>(uuidv4());

  useEffect(() => {
    async function fetchWidgets() {
      const tossPayments = await loadTossPayments(clientKey);
      const widgets = tossPayments.widgets({ customerKey: customerKey });
      setWidgets(widgets);
    }

    fetchWidgets();
  }, []);

  useEffect(() => {
    async function renderWidgets() {
      if (!widgets) return;

      await widgets.setAmount({ currency: 'KRW', value: amount });

      await Promise.all([
        widgets.renderPaymentMethods({ selector: '#payment-method', variantKey: 'DEFAULT' }),
        widgets.renderAgreement({ selector: '#agreement', variantKey: 'AGREEMENT' }),
      ]);
    }

    renderWidgets();
  }, [widgets, amount]);

  const handlePayment = async () => {
    try {
      const orderId = uuidv4();

      await updatePaymentRequestInfo({
        paymentRequestId: paymentRequestId,
        orderId: orderId,
        clientKey: clientKey,
      });

      await widgets?.requestPayment({
        orderId: orderId,
        orderName: '진료비 결제',
        customerName: `${name}`,
        customerEmail: `${email}`,
        successUrl: window.location.origin + '/sandbox/success' + window.location.search,
        failUrl: window.location.origin + '/sandbox/fail' + window.location.search,
      });

      onClose(); // 결제 완료 후 모달 닫기
    } catch (error) {
      console.error('결제 요청 실패:', error);
    }
  };

  return (
    <Wrapper>
      <ContentBox>
        <PaymentWidget id="payment-method" />
        <AgreementWidget id="agreement" />
        <ButtonArea>
          <PaymentButton onClick={handlePayment}>결제하기</PaymentButton>
        </ButtonArea>
      </ContentBox>
    </Wrapper>
  );
};

export default TossPayment;

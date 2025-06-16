import styled from 'styled-components';
import PaymentMethodCard from '~/features/appointment/components/add/payment/PaymentMethodCard';
import { useState } from 'react';
import { FaCreditCard, FaStore } from 'react-icons/fa';
import useAppointmentStore from '~/features/appointment/state/useAppointmentStore';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TitleBox = styled.div`
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #00499e;
`;

const Description = styled.p`
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #6b7280;
`;

const CardList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const PAYMENT_OPTIONS = [
  {
    method: 'ONSITE',
    label: '현장 수납',
    icon: <FaStore />,
  },
  {
    method: 'ONLINE',
    label: '앱 내 결제',
    icon: <FaCreditCard />,
  },
] as const;

const PaymentMethodSelector = () => {
  const { paymentMethod, setPaymentMethod } = useAppointmentStore();

  return (
    <Wrapper>
      <TitleBox>
        <Title>수납방법 선택</Title>
        <Description>수납할 수단을 선택해주세요.</Description>
      </TitleBox>

      <CardList>
        {PAYMENT_OPTIONS.map((option) => {
          return (
            <PaymentMethodCard
              key={option.method}
              label={option.label}
              icon={option.icon}
              isSelected={paymentMethod === option.method}
              onSelect={() => {
                if (paymentMethod !== option.method) {
                  setPaymentMethod(option.method);
                }
              }}
            />
          );
        })}
      </CardList>
    </Wrapper>
  );
};

export default PaymentMethodSelector;

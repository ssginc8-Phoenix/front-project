import PaymentMethodCard from '~/features/appointment/components/add/payment/PaymentMethodCard';
import { FaCreditCard, FaStore } from 'react-icons/fa';
import useAppointmentStore from '~/features/appointment/state/useAppointmentStore';
import {
  Wrapper,
  Description,
  TitleBox,
  Title,
  CardList,
} from '~/features/appointment/components/add/Selector.styles';

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
        <Description>수납할 수단을 선택해주세요. (필수 항목)</Description>
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

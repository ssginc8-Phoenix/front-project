import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { confirmPaymentRequest } from '~/features/payments/api/paymentsAPI';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

const ContentBox = styled.div`
  width: 100%;
  max-width: 540px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  margin-top: 1.5rem;
`;

const SubTitle = styled.h4`
  font-size: 1rem;
  font-weight: 400;
  color: #666;
  text-align: center;
  margin-top: 0.5rem;
`;

const ResponseSection = styled.div`
  width: 100%;
  margin-top: 2rem;
`;

const ResponseRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const ResponseLabel = styled.span`
  font-weight: 500;
  color: #555;
`;

const ResponseText = styled.span`
  font-weight: 600;
`;

const ButtonGroup = styled.div`
  width: 100%;
  display: flex;
  gap: 16px;
  margin-top: 2rem;
`;

const StyledButton = styled.a`
  width: 100%;
  padding: 0.8rem;
  text-align: center;
  background-color: #0064ff;
  color: white;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  &:hover {
    background-color: #004fcc;
  }
`;

const SuccessPage = () => {
  const navigate = useNavigate();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [searchParams] = useSearchParams();
  const paymentKey = searchParams.get('paymentKey');
  const orderId = searchParams.get('orderId');
  const amount = searchParams.get('amount');

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        await confirmPaymentRequest({
          paymentKey,
          orderId,
          amount,
        });
        setIsConfirmed(true);
      } catch (error) {
        console.error('결제 확인 실패:', error);
      }
    };

    confirmPayment();
  }, []);

  return (
    <Wrapper>
      <ContentBox>
        {isConfirmed ? (
          <>
            <img
              src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png"
              width="120"
              height="120"
            />
            <Title>결제를 완료했어요</Title>
            <ResponseSection>
              <ResponseRow>
                <ResponseLabel>결제 금액</ResponseLabel>
                <ResponseText>{amount}</ResponseText>
              </ResponseRow>
            </ResponseSection>
            <ButtonGroup>
              <StyledButton onClick={() => navigate('/appointments')}>
                예약 관리 페이지로 이동
              </StyledButton>
            </ButtonGroup>
          </>
        ) : (
          <>
            <img
              src="https://static.toss.im/lotties/loading-spot-apng.png"
              width="120"
              height="120"
            />
            <Title>결제 중입니다.</Title>
          </>
        )}
      </ContentBox>
    </Wrapper>
  );
};

export default SuccessPage;

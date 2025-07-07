import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 4rem 1.5rem;
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
  color: #1b1e28;
  margin-top: 1.5rem;
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
  color: #666;
`;

const ResponseText = styled.span`
  font-weight: 600;
  color: #1b1e28;
`;

const ButtonGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2.5rem;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;
`;

const StyledButton = styled.a`
  flex: 1;
  padding: 0.8rem 1rem;
  background-color: #0064ff;
  color: white;
  text-align: center;
  text-decoration: none;
  font-weight: 600;
  border-radius: 8px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #004fcc;
  }
`;

const FailPage = () => {
  const [searchParams] = useSearchParams();
  const errorCode = searchParams.get('code');
  const errorMessage = searchParams.get('message');

  return (
    <Wrapper>
      <ContentBox>
        <img
          src="https://static.toss.im/lotties/error-spot-apng.png"
          width="120"
          height="120"
          alt="결제 실패"
        />
        <Title>결제를 실패했어요</Title>
        <ResponseSection>
          <ResponseRow>
            <ResponseLabel>코드</ResponseLabel>
            <ResponseText>{errorCode}</ResponseText>
          </ResponseRow>
          <ResponseRow>
            <ResponseLabel>메시지</ResponseLabel>
            <ResponseText>{errorMessage}</ResponseText>
          </ResponseRow>
        </ResponseSection>

        <ButtonGroup>
          <StyledButton
            href="https://developers.tosspayments.com/sandbox"
            target="_blank"
            rel="noreferrer noopener"
          >
            다시 테스트하기
          </StyledButton>
          <ButtonRow>
            <StyledButton
              href="https://docs.tosspayments.com/reference/error-codes"
              target="_blank"
              rel="noreferrer noopener"
            >
              에러코드 문서보기
            </StyledButton>
            <StyledButton
              href="https://techchat.tosspayments.com"
              target="_blank"
              rel="noreferrer noopener"
            >
              실시간 문의하기
            </StyledButton>
          </ButtonRow>
        </ButtonGroup>
      </ContentBox>
    </Wrapper>
  );
};

export default FailPage;

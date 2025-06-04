import styled from 'styled-components';

const Wrapper = styled.div`
  padding: 2rem;
  text-align: center;
  font-size: 1rem;
  color: #4b5563;
`;

const Spinner = styled.div`
  margin: 0 auto 1rem;
  width: 2rem;
  height: 2rem;
  border: 4px solid #93c5fd;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingIndicator = ({ message = '로딩 중입니다...' }: { message?: string }) => {
  return (
    <Wrapper>
      <Spinner />
      <p>{message}</p>
    </Wrapper>
  );
};

export default LoadingIndicator;

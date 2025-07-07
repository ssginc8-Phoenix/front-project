import styled from 'styled-components';

const Wrapper = styled.div`
  padding: 2rem;
  text-align: center;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  border-radius: 0.5rem;
  font-size: 0.95rem;
`;

const ErrorMessage = ({ message }: { message: string }) => {
  return (
    <Wrapper>
      <p>❗ {message}</p>
    </Wrapper>
  );
};

export default ErrorMessage;

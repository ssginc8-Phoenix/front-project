import styled from 'styled-components';

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
`;

const StyledButton = styled.button<{ bgColor: string; textColor: string }>`
  width: 200px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0 1rem;
  border: none;
  border-radius: 8px;
  background-color: ${({ bgColor }) => bgColor};
  color: ${({ textColor }) => textColor};
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    filter: brightness(0.95);
  }

  img {
    width: 20px;
    height: 20px;
    pointer-events: none;
    user-select: none;
  }
`;

const SocialLoginButtons = () => {
  const handleLogin = (provider: 'kakao' | 'naver') => {
    window.location.href = `http://localhost:8080/api/v1/auth/login/${provider}`;
  };

  return (
    <ButtonGroup>
      <StyledButton bgColor="#FEE500" textColor="#000000" onClick={() => handleLogin('kakao')}>
        <img src="/kakao.png" alt="Kakao Logo" />
        카카오 로그인
      </StyledButton>

      <StyledButton bgColor="#02B531" textColor="#ffffff" onClick={() => handleLogin('naver')}>
        <img src="/naver.png" alt="Naver Logo" />
        네이버 로그인
      </StyledButton>
    </ButtonGroup>
  );
};

export default SocialLoginButtons;

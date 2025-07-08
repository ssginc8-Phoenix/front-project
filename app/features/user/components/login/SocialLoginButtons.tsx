import styled from 'styled-components';

// 공통 sizes 및 media 객체 정의 (이 코드는 실제 파일에는 맨 위에 위치합니다)
const sizes = {
  laptopL: '1600px',
  laptop: '1024px',
  tablet: '768px',
  mobile: '480px',
  mobileSmall: '360px',
};

const media = {
  laptopL: `@media (max-width: ${sizes.laptopL})`,
  laptop: `@media (max-width: ${sizes.laptop})`,
  tablet: `@media (max-width: ${sizes.tablet})`,
  mobile: `@media (max-width: ${sizes.mobile})`,
  mobileSmall: `@media (max-width: ${sizes.mobileSmall})`,
};

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
  width: 100%; /* 부모 너비에 맞춰 확장 */
  justify-content: center; /* 버튼 그룹을 가운데 정렬 */
  max-width: 420px; /* 두 버튼 너비(200*2) + 간격(16px) = 416px, 약간 여유 있게 420px */

  ${media.tablet} {
    gap: 0.8rem;
    margin-bottom: 2.5rem;
    max-width: 80%; /* 태블릿에서는 80% 너비 */
    flex-wrap: wrap; /* 버튼이 줄 바꿈되도록 설정 */
  }

  ${media.mobile} {
    flex-direction: column; /* 모바일에서는 버튼을 세로로 쌓음 */
    gap: 0.75rem;
    margin-bottom: 2rem;
    max-width: 90%; /* 모바일에서는 90% 너비 */
  }

  ${media.mobileSmall} {
    gap: 0.6rem;
    margin-bottom: 1.5rem;
    max-width: calc(100% - 32px); /* 아주 작은 모바일에서는 양쪽 패딩 제외한 너비 */
  }
`;

const StyledButton = styled.button<{ bgColor: string; textColor: string }>`
  width: 200px; /* 기본 버튼 너비 */
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
  box-sizing: border-box; /* 패딩이 너비에 포함되도록 설정 */
  flex-shrink: 0; /* 기본적으로 줄어들지 않음 */

  &:hover {
    filter: brightness(0.95);
  }

  img {
    width: 20px;
    height: 20px;
    pointer-events: none;
    user-select: none;
  }

  ${media.tablet} {
    width: 48%; /* 태블릿에서 두 버튼이 나란히 오도록 */
    font-size: 0.9rem;
    padding: 0.8rem 1rem;
    height: 44px; /* 높이 약간 줄임 */
  }

  ${media.mobile} {
    width: 100%; /* 모바일에서는 버튼이 꽉 차도록 */
    font-size: 0.85rem;
    padding: 0.7rem 1rem;
    height: 40px; /* 높이 더 줄임 */
  }

  ${media.mobileSmall} {
    font-size: 0.8rem;
    height: 38px; /* 가장 작은 모바일에서 높이 */
    padding: 0.6rem 0.8rem;
  }
`;

const SocialLoginButtons = () => {
  const handleLogin = (provider: 'kakao' | 'naver') => {
    window.location.href = `https://beanstalk.docto.click/api/v1/auth/login/${provider}`;
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

import styled from 'styled-components';
// Header는 상단 고정이므로 여기서는 제외합니다.
import LoginForm from '~/features/user/components/login/LoginForm';
import SocialLoginButtons from '~/features/user/components/login/SocialLoginButtons';
import Divider from '~/features/user/components/login/Divider';
import LoginHelperLinks from '~/features/user/components/login/LoginHelperLinks';

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

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  /* 헤더 높이를 고려하여 padding-top을 유지합니다. (약 60~80px 정도로 예상) */
  padding-top: 100px;
  margin-bottom: 10rem;
  width: 100%; /* 전체 너비를 사용하도록 설정 */
  box-sizing: border-box; /* 패딩이 너비에 포함되도록 설정 */

  ${media.tablet} {
    padding-top: 80px; /* 태블릿에서는 패딩을 약간 줄임 */
    margin-bottom: 8rem;
  }

  ${media.mobile} {
    padding-top: 60px; /* 모바일에서는 패딩을 더 줄임 */
    margin-bottom: 6rem;
  }

  ${media.mobileSmall} {
    padding-top: 50px; /* 아주 작은 모바일에서는 최소 패딩 */
    margin-bottom: 4rem;
  }
`;

const LoginPage = () => {
  return (
    <>
      {/* <Header /> 컴포넌트는 전역 레이아웃에서 관리될 것으로 보이며,
          여기서는 Wrapper 안에 포함되지 않으므로 제거했습니다.
          만약 LoginPage 컴포넌트 내에서 헤더를 렌더링해야 한다면, Wrapper 바깥에 두어야 합니다.
          Wrapper의 padding-top은 이 헤더의 높이를 고려한 것입니다.
      */}
      <Wrapper>
        <LoginForm />
        <LoginHelperLinks />
        <Divider />
        <SocialLoginButtons />
      </Wrapper>
    </>
  );
};

export default LoginPage;

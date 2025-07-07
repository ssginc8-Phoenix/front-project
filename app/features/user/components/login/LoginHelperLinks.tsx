import { Link } from 'react-router-dom';
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

const HelperLinksWrapper = styled.div`
  margin-top: 1rem;
  font-size: 0.85rem;
  color: #555;
  display: flex;
  gap: 1rem;
  /* 작은 화면에서는 가운데 정렬을 위해 너비를 제한하고 margin: auto 사용 */
  max-width: 400px; /* 폼의 최대 너비와 유사하게 설정 */

  ${media.tablet} {
    margin-top: 0.8rem;
    font-size: 0.8rem;
    gap: 0.8rem;
    max-width: 80%; /* 태블릿에서는 80% 너비 */
  }

  ${media.mobile} {
    margin-top: 0.6rem;
    font-size: 0.75rem;
    gap: 0.6rem;
    flex-wrap: wrap; /* 링크가 너무 많으면 다음 줄로 넘어가도록 */
    justify-content: center; /* 가운데 정렬 */
    max-width: 90%; /* 모바일에서는 90% 너비 */
  }

  ${media.mobileSmall} {
    margin-top: 0.5rem;
    font-size: 0.7rem;
    gap: 0.5rem;
    max-width: 100%; /* 아주 작은 모바일에서는 거의 전체 너비 */
  }
`;

const StyledLink = styled(Link)`
  color: #007bff;
  text-decoration: none;
  white-space: nowrap; /* 링크 텍스트가 줄 바꿈되지 않도록 */

  &:hover {
    text-decoration: underline;
  }
`;

const LoginHelperLinks = () => {
  return (
    <HelperLinksWrapper>
      <StyledLink to="/signup">회원가입</StyledLink>
      <StyledLink to="/reset-password">비밀번호 재설정</StyledLink>
      <StyledLink to="/find-email">이메일 찾기</StyledLink>
    </HelperLinksWrapper>
  );
};

export default LoginHelperLinks;

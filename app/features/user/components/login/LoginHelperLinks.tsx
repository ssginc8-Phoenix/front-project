import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HelperLinksWrapper = styled.div`
  margin-top: 1rem;
  font-size: 0.85rem;
  color: #555;
  display: flex;
  gap: 1rem;
`;

const StyledLink = styled(Link)`
  color: #007bff;
  text-decoration: none;

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

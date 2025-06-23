import styled from 'styled-components';
import Profile from '~/common/Profile';
import useLoginStore from '~/features/user/stores/LoginStore';
import { Link } from 'react-router-dom';
import NotificationComponent from '~/features/notification/components/NotificationComponent';

const HeaderBar = styled.header`
  padding: 1rem 3rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
`;

const HeaderContent = styled.div`
  width: 100%;
  max-width: 1600px; /* MainLayout의 max-width와 동일하게 설정 */
  display: flex;
  justify-content: space-between; /* 내부 컨텐츠는 양 끝 정렬 */
  align-items: center;
`;

const LogoLink = styled(Link)`
  width: 10%;
  min-width: 80px;
  max-width: 120px;
`;

const LogoImage = styled.img`
  width: 100%;
`;

const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AuthButton = styled.a`
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid #007bff;
  color: #007bff;
  font-size: 0.9rem;
  text-decoration: none;
  transition:
    background-color 0.2s,
    color 0.2s;

  &:hover {
    background-color: #007bff;
    color: #fff;
  }
`;

const Header = () => {
  const user = useLoginStore((state) => state.user);

  return (
    <HeaderBar>
      <HeaderContent>
        <LogoLink to="/">
          <LogoImage src="/logo.png" alt="logo" />
        </LogoLink>
        <RightGroup>
          {user ? (
            <>
              <NotificationComponent />
              <Profile name={user.name} imageUrl={user.profileImageUrl} />
            </>
          ) : (
            <>
              <AuthButton href="/login">로그인</AuthButton>
              <AuthButton href="/signup">회원가입</AuthButton>
            </>
          )}
        </RightGroup>
      </HeaderContent>
    </HeaderBar>
  );
};

export default Header;

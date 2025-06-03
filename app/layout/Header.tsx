import styled from 'styled-components';
import Profile from '~/common/Profile';
import useLoginStore from '~/features/user/stores/LoginStore';

const HeaderBar = styled.header`
  padding: 1rem 2rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.img`
  width: 11%;
`;

const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Notification = styled.div`
  cursor: pointer;
  font-size: 1.5rem;
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
      <Logo src="/logo.png" alt="logo" />
      <RightGroup>
        {user ? (
          <>
            <Profile name={user.name} imageUrl={user.profileImageUrl} />
            <Notification>🔔</Notification>
          </>
        ) : (
          <>
            <AuthButton href="/login">로그인</AuthButton>
            <AuthButton href="/register">회원가입</AuthButton>
          </>
        )}
      </RightGroup>
    </HeaderBar>
  );
};

export default Header;

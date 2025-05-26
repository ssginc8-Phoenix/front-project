import styled from 'styled-components';
import Profile from '~/common/Profile';

const Header = styled.header`
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

const HeaderLayout = () => {
  return (
    <Header>
      <Logo src="/logo.png" alt="logo" />
      <RightGroup>
        <Profile />
        <Notification>🔔</Notification>
      </RightGroup>
    </Header>
  );
};

export default HeaderLayout;

import styled from 'styled-components';
import Profile from '~/common/Profile';
import useLoginStore from '~/features/user/stores/LoginStore';
import { Link } from 'react-router-dom';
import NotificationComponent from '~/features/notification/components/NotificationComponent';
import { useEffect, useState } from 'react';
import MobileSidebarMenu from '~/common/MobileSidebarMenu';
import { createCsRoom, fetchCsRoomDetail } from '~/features/cs/api/csAPI';
import ChatModal from '~/features/cs/components/user/ChatModal';
import { useNavigate } from 'react-router';

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

const HeaderBar = styled.header`
  padding: 1rem 3rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 1000;

  ${media.tablet} {
    padding: 0.8rem 1.5rem;
  }

  ${media.mobile} {
    padding: 0.6rem 1rem;
  }
`;

const HeaderContent = styled.div`
  width: 100%;
  max-width: 1600px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LogoLink = styled(Link)`
  width: 10%;
  min-width: 80px;
  max-width: 120px;

  ${media.mobile} {
    min-width: 60px;
    max-width: 100px;
  }
`;

const LogoImage = styled.img`
  width: 100%;
  height: auto;
`;

const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  ${media.tablet} {
    gap: 0.8rem;
  }

  ${media.mobile} {
    gap: 0.5rem;
  }
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
  white-space: nowrap;

  &:hover {
    background-color: #007bff;
    color: #fff;
  }

  ${media.tablet} {
    padding: 6px 12px;
    font-size: 0.85rem;
  }

  ${media.mobile} {
    display: none;
  }

  ${media.mobileSmall} {
    display: block;
    padding: 4px 8px;
    font-size: 0.75rem;
  }
`;

const NavBtn = styled.button`
  all: unset;
  cursor: pointer;
  font-size: 0.9rem;
  color: #444;
  padding: 8px 12px;
  border-radius: 4px;
  white-space: nowrap;

  &:hover {
    background: #f5f5f5;
  }

  ${media.tablet} {
    padding: 6px 10px;
    font-size: 0.85rem;
  }

  ${media.mobile} {
    display: none;
  }
`;

const HamburgerButton = styled.button`
  all: unset;
  cursor: pointer;
  display: none;
  width: 28px;
  height: 28px;
  position: relative;
  transition: transform 0.3s ease;
  margin-left: 0.5rem;

  ${media.mobile} {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:before,
  &:after {
    content: '';
    position: absolute;
    width: 24px;
    height: 2px;
    background-color: #333;
    transition:
      transform 0.3s ease,
      top 0.3s ease,
      bottom 0.3s ease;
  }

  &:before {
    top: 8px;
  }

  &:after {
    bottom: 8px;
  }

  & span {
    width: 24px;
    height: 2px;
    background-color: #333;
    transition: opacity 0.3s ease;
  }
`;

const HiddenOnMobileWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  ${media.mobile} {
    display: none;
  }
`;

const MobileNotificationWrapper = styled.div`
  display: none;
  ${media.mobile} {
    display: block;
  }
`;

const Header = () => {
  const user = useLoginStore((state) => state.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  // 채팅 모달용
  const [csRoomId, setCsRoomId] = useState<number | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [agentName, setAgentName] = useState('');
  const [agentAvatar, setAgentAvatar] = useState('');
  // 3. 고객센터 버튼 핸들러
  const openChat = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }
    if (user.role === 'SYSTEM_ADMIN') {
      return navigate('/cs');
    }
    document.body.style.overflow = 'hidden';
    if (!csRoomId) {
      const newId = await createCsRoom({ customerId: user.userId });
      setCsRoomId(newId);
    }
    setIsChatOpen(true);
  };
  // 4. 방 생성 후 상담사 정보 가져오기
  useEffect(() => {
    if (!csRoomId) return;
    fetchCsRoomDetail(csRoomId).then((res) => {
      setAgentName(res.data.agentName || '');
      setAgentAvatar(res.data.agentAvatarUrl || '');
    });
  }, [csRoomId]);

  // 5. 모달 닫기/나가기 핸들러
  const handleClose = () => {
    setIsChatOpen(false);
    document.body.style.overflow = 'auto';
  };
  const handleExit = () => {
    setIsChatOpen(false);
    setCsRoomId(null);
    document.body.style.overflow = 'auto';
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <>
      <HeaderBar>
        <HeaderContent>
          <LogoLink to="/">
            <LogoImage src="/logo.png" alt="logo" />
          </LogoLink>
          <RightGroup>
            <NavBtn onClick={() => scrollToSection('about-section')}>서비스 소개</NavBtn>
            <NavBtn onClick={openChat}>고객센터</NavBtn>

            {user ? (
              <>
                <HiddenOnMobileWrapper>
                  <NotificationComponent />
                  <Profile name={user.name} imageUrl={user.profileImageUrl} />
                </HiddenOnMobileWrapper>

                <MobileNotificationWrapper>
                  <NotificationComponent />
                </MobileNotificationWrapper>
              </>
            ) : (
              <AuthButtonsContainer>
                <AuthButton href="/login">로그인</AuthButton>
                <AuthButton href="/signup">회원가입</AuthButton>
              </AuthButtonsContainer>
            )}

            {user && (
              <HamburgerButton onClick={toggleMenu} className={isMenuOpen ? 'open' : ''}>
                <span />
              </HamburgerButton>
            )}
          </RightGroup>
        </HeaderContent>
      </HeaderBar>
      {isMenuOpen && (
        <MobileSidebarMenu onClose={toggleMenu} user={user} scrollToSection={scrollToSection} />
      )}
      {isChatOpen && user && csRoomId != null && (
        <ChatModal
          isOpen={isChatOpen}
          onClose={handleClose}
          onExit={handleExit}
          userId={user.userId}
          userName={user.name}
          userAvatar={user.profileImageUrl}
          csRoomId={csRoomId}
          agentName={agentName}
          agentAvatar={agentAvatar}
        />
      )}
    </>
  );
};

const AuthButtonsContainer = styled.div`
  display: flex;
  gap: 0.5rem;

  ${media.mobile} {
    display: none;
  }

  ${media.mobileSmall} {
    display: flex;
  }
`;

export default Header;

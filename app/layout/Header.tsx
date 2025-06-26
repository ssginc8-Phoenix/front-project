import styled from 'styled-components';
import Profile from '~/common/Profile';
import useLoginStore from '~/features/user/stores/LoginStore';
import { Link } from 'react-router-dom';
import NotificationComponent from '~/features/notification/components/NotificationComponent';
import { useState } from 'react';
import MobileSidebarMenu from '~/common/MobileSidebarMenu';

// ---
// Media Queries (기존과 동일)
// ---
const sizes = {
  laptopL: '1600px',
  laptop: '1024px',
  tablet: '768px',
  mobile: '480px',
};

const media = {
  laptopL: `@media (max-width: ${sizes.laptopL})`,
  laptop: `@media (max-width: ${sizes.laptop})`,
  tablet: `@media (max-width: ${sizes.tablet})`,
  mobile: `@media (max-width: ${sizes.mobile})`,
};

// ---
// Styled Components
// ---

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
    display: none; /* 모바일에서 숨김 */
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
    display: none; /* 모바일에서 숨김 */
  }
`;

const HamburgerButton = styled.button`
  all: unset;
  cursor: pointer;
  display: none; /* 기본적으로 숨김 */
  width: 28px;
  height: 28px;
  position: relative;
  transition: transform 0.3s ease;
  margin-left: 0.5rem;

  ${media.mobile} {
    display: flex; /* 모바일에서만 표시 */
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

  /* --- 이 아래의 .open 클래스 스타일을 제거하거나 주석 처리했습니다 --- */
  /*
  &.open {
    &:before {
      transform: translateY(8px) rotate(45deg);
      top: 50%;
    }
    &:after {
      transform: translateY(-8px) rotate(-45deg);
      bottom: 50%;
    }
    & span {
      opacity: 0;
    }
  }
  */
`;

// ---
// 외부 컴포넌트를 styled-components로 래핑하여 모바일에서 숨김 처리
// ---
const HiddenOnMobileWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  ${media.mobile} {
    display: none; /* 모바일에서 Wrapper 자체를 숨김 */
  }
`;

// ---
// 모바일에서만 알림 컴포넌트를 보이게 할 Wrapper 추가
// ---
const MobileNotificationWrapper = styled.div`
  display: none; /* 기본적으로 숨김 */
  ${media.mobile} {
    display: block; /* 모바일에서만 표시 */
  }
`;

// ---
// Header Component
// ---
const Header = () => {
  const user = useLoginStore((state) => state.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      document.body.style.overflow = 'hidden'; // 메뉴 열릴 때 스크롤 방지
    } else {
      document.body.style.overflow = 'auto'; // 메뉴 닫힐 때 스크롤 허용
    }
  };

  const scrollToSection = (id: string) => {
    if (location.pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false); // 메뉴가 열려있었다면 닫기
    document.body.style.overflow = 'auto'; // 메뉴 닫힐 때 스크롤 허용
  };

  return (
    <>
      <HeaderBar>
        <HeaderContent>
          <LogoLink to="/">
            <LogoImage src="/logo.png" alt="logo" />
          </LogoLink>
          <RightGroup>
            {/* PC/태블릿에서만 보이는 내비게이션 버튼 */}
            <NavBtn onClick={() => scrollToSection('about-section')}>서비스 소개</NavBtn>
            <NavBtn onClick={() => scrollToSection('tel-section')}>고객센터</NavBtn>

            {user ? (
              <>
                {/* PC/태블릿에서만 보이는 알림 및 프로필 그룹 */}
                <HiddenOnMobileWrapper>
                  <NotificationComponent />
                  <Profile name={user.name} imageUrl={user.profileImageUrl} />
                </HiddenOnMobileWrapper>

                {/* 모바일에서만 보이는 알림 컴포넌트 */}
                <MobileNotificationWrapper>
                  <NotificationComponent />
                </MobileNotificationWrapper>
              </>
            ) : (
              <>
                <AuthButton href="/login">로그인</AuthButton>
                <AuthButton href="/signup">회원가입</AuthButton>
              </>
            )}

            {/* 모바일에서만 보이는 햄버거 버튼 */}
            <HamburgerButton onClick={toggleMenu} className={isMenuOpen ? 'open' : ''}>
              <span />
            </HamburgerButton>
          </RightGroup>
        </HeaderContent>
      </HeaderBar>
      {/* 햄버거 메뉴 상태에 따라 렌더링될 모바일 사이드바 컴포넌트 */}
      {isMenuOpen && (
        <MobileSidebarMenu onClose={toggleMenu} user={user} scrollToSection={scrollToSection} />
      )}
    </>
  );
};

export default Header;

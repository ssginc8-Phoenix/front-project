// src/components/Layout/MobileSidebarMenu.tsx

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Sidebar from '~/common/Sidebar';

const sizes = {
  laptopL: '1600px',
  laptop: '1024px',
  tablet: '768px',
  mobile: '480px',
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.3s ease,
    visibility 0.3s ease;

  &.open {
    opacity: 1;
    visibility: visible;
  }
`;

const SidebarContainer = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 75vw;
  max-width: 280px;
  background: white;
  z-index: 1001;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.2);
  transform: translateX(-100%);
  transition: transform 0.3s ease-out;
  overflow-y: auto;
  overflow-x: hidden;

  ${(props) =>
    props.$isOpen &&
    `
    transform: translateX(0);
  `}

  @media (min-width: ${sizes.tablet}) {
    display: none;
    width: 80vw;
    max-width: 320px;
  }
`;

export interface MobileSidebarMenuProps {
  /** 사이드바 닫기 */
  onClose: () => void;
  /** 닫고 난 뒤 채팅 모달 열기 */
  onOpenChat: () => void;
  user: any;
  scrollToSection: (id: string) => void;
}

const MobileSidebarMenu: React.FC<MobileSidebarMenuProps> = ({
  onClose,
  onOpenChat,
  user,
  scrollToSection,
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isOpenInternal, setIsOpenInternal] = useState(false);

  // 처음 마운트 시 열기 애니메이션
  useEffect(() => {
    setIsOpenInternal(true);

    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        handleCloseWithAnimation();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 사이드바 닫기 + 애니메이션
  const handleCloseWithAnimation = () => {
    setIsOpenInternal(false);
    const timer = setTimeout(() => {
      onClose();
    }, 300);
    return () => clearTimeout(timer);
  };

  // 고객센터 클릭 시: 닫기 → 모달 오픈
  const handleCsClick = () => {
    handleCloseWithAnimation();
    setTimeout(() => {
      onOpenChat();
    }, 300);
  };

  return (
    <>
      <Overlay className={isOpenInternal ? 'open' : ''} onClick={handleCloseWithAnimation} />
      <SidebarContainer $isOpen={isOpenInternal} ref={sidebarRef}>
        <Sidebar onClose={handleCloseWithAnimation} onCsClick={handleCsClick} />
      </SidebarContainer>
    </>
  );
};

export default MobileSidebarMenu;

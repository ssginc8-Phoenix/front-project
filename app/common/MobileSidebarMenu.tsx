import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Sidebar from '~/common/Sidebar';

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

interface MobileSidebarMenuProps {
  onClose: () => void;
  user: any;
  scrollToSection: (id: string) => void;
}

const MobileSidebarMenu: React.FC<MobileSidebarMenuProps> = ({
  onClose,
  user,
  scrollToSection,
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isOpenInternal, setIsOpenInternal] = useState(false);

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

  const handleCloseWithAnimation = () => {
    setIsOpenInternal(false);
    const timer = setTimeout(() => {
      onClose();
    }, 300);
    return () => clearTimeout(timer);
  };

  return (
    <>
      <Overlay className={isOpenInternal ? 'open' : ''} onClick={handleCloseWithAnimation} />
      <SidebarContainer $isOpen={isOpenInternal} ref={sidebarRef}>
        <Sidebar onClose={handleCloseWithAnimation} />
      </SidebarContainer>
    </>
  );
};

export default MobileSidebarMenu;

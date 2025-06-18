import styled from 'styled-components';
import React from 'react';

// 사이드바 아이템 타입
interface SidebarItem {
  key: string;
  label: string;
  icon: React.ReactNode;
}

// 사이드바 메뉴 props 타입
interface SidebarMenuProps {
  items: SidebarItem[];
  activeKey: string;
  onChange: (key: string) => void;
  children?: React.ReactNode; // 프로필 등
}

// Styled-components

const Sidebar = styled.nav`
  width: 100%;
  padding: 0 1rem; /* SidebarBox의 내부 패딩과 조화되도록 조정 */
  box-sizing: border-box; /* 패딩이 너비에 포함되도록 */
`;

const SidebarMenuUl = styled.ul`
  width: 100%;
  padding: 0;
  margin: 0;
  list-style: none;
`;

const SidebarMenuItem = styled.li<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px; /* 좌우 패딩을 SidebarBox의 좌우 패딩에 맞춤 */
  font-size: 1.05rem;
  font-weight: 500;
  /* 캘린더 관리 페이지의 활성 스타일 (파란 배경, 흰 텍스트)을 따름 */
  color: ${({ $active }) => ($active ? 'white' : '#2c2c2c')}; /* 활성 시 흰색 텍스트 */
  background: ${({ $active }) => ($active ? '#00499e' : 'none')}; /* 활성 시 파란색 배경 */
  border-radius: 10px;
  cursor: pointer;
  margin: 4px 0;
  transition:
    background 0.12s,
    color 0.12s;

  &:hover {
    /* 호버 시에는 활성 배경색과 유사하게 유지하되 약간 밝게 */
    background: ${({ $active }) => ($active ? '#003a7a' : '#eef3fa')};
    color: ${({ $active }) => ($active ? 'white' : '#00499e')}; /* 호버 시 파란색 텍스트 (비활성) */
  }

  span {
    font-size: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

/**
 * 재사용 가능한 SidebarMenu 컴포넌트
 */
export const SidebarMenu: React.FC<SidebarMenuProps> = ({
  items,
  activeKey,
  onChange,
  children,
}) => (
  <Sidebar>
    {children}
    <SidebarMenuUl>
      {items.map((item) => (
        <SidebarMenuItem
          key={item.key}
          $active={item.key === activeKey}
          onClick={() => onChange(item.key)}
        >
          <span>{item.icon}</span>
          {item.label}
        </SidebarMenuItem>
      ))}
    </SidebarMenuUl>
  </Sidebar>
);

export default SidebarMenu;

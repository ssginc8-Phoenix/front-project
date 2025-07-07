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
  onChange: (key: string) => void;
  children?: React.ReactNode; // 프로필 등
}

// Styled-components
const Sidebar = styled.nav`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 1.25rem;
`;

const SidebarMenuList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SidebarMenuItem = styled.li<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  font-size: 1.125rem;
  font-weight: 500;
  border-radius: 0.625rem;
  cursor: pointer;
  transition:
    background 0.16s ease,
    color 0.16s ease;

  background: ${({ $active }) => ($active ? '#00499e' : 'transparent')}; /* 활성 시 파란색 배경 */
  color: ${({ $active }) => ($active ? '#fff' : '#2c2c2c')};

  span {
    font-size: 1.25rem;
    color: inherit;
  }

  &:hover {
    background: ${({ $active }) => ($active ? '#003a7a' : '#eef3fa')};
    color: ${({ $active }) => ($active ? '#fff' : '#00499e')}; /* 활성 시 흰색, 비활성 시 파란색 */
  }
`;

/**
 * 재사용 가능한 SidebarMenu 컴포넌트
 */
export const SidebarMenu = ({ items, onChange, children }: SidebarMenuProps) => (
  <Sidebar>
    {children}
    <SidebarMenuList>
      {items.map((item) => (
        <SidebarMenuItem key={item.key} onClick={() => onChange(item.key)}>
          {item.icon}
          {item.label}
        </SidebarMenuItem>
      ))}
    </SidebarMenuList>
  </Sidebar>
);

export default SidebarMenu;

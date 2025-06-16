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
  display: flex;
  flex-direction: column;
  flex: 0 0 15rem; /* 고정 너비 대신 rem 단위 */
  padding: 1rem; /* 상하좌우 1rem 패딩 */
`;

const SidebarMenuList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem; /* 항목 사이 0.5rem 간격 */
`;

const SidebarMenuItem = styled.li<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem; /* 아이콘과 텍스트 간격 */
  padding: 0.75rem 1rem; /* 상하 0.75rem, 좌우 1rem */
  font-size: 1.125rem; /* 1.125rem = 18px 정도 */
  font-weight: 500;
  color: ${({ $active }) => ($active ? '#1646a0' : '#222')};
  background: ${({ $active }) => ($active ? '#f3f6fa' : 'transparent')};
  border-radius: 0.625rem; /* 10px */
  cursor: pointer;
  transition:
    background 0.12s ease,
    color 0.12s ease;

  &:hover {
    background: #eef3fa;
    color: #1646a0;
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
    <SidebarMenuList>
      {items.map((item) => (
        <SidebarMenuItem
          key={item.key}
          $active={item.key === activeKey}
          onClick={() => onChange(item.key)}
        >
          <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
          {item.label}
        </SidebarMenuItem>
      ))}
    </SidebarMenuList>
  </Sidebar>
);

export default SidebarMenu;

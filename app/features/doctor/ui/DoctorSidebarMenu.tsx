import styled from 'styled-components';
import React from 'react';

// 사이드바 아이템 타입
interface doctorSidebarItem {
  key: string;
  label: string;
  icon: React.ReactNode;
}

// 사이드바 메뉴 props 타입
interface SidebarMenuProps {
  items: doctorSidebarItem[];
  activeKey: string;
  onChange: (key: string) => void;
  children?: React.ReactNode; // 프로필 등
}

// Styled-components
const Sidebar = styled.nav`
  width: 100%;
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
  padding: 14px 8px 14px 18px;
  font-size: 1.13rem;
  font-weight: 500;
  color: ${({ $active }) => ($active ? '#1646a0' : '#222')};
  background: ${({ $active }) => ($active ? '#f3f6fa' : 'none')};
  border-radius: 10px;
  cursor: pointer;
  margin: 4px 0;
  transition:
    background 0.12s,
    color 0.12s;

  &:hover {
    background: #eef3fa;
    color: #1646a0;
  }
`;

/**
 * 재사용 가능한 SidebarMenu 컴포넌트
 */
export const DoctorSidebarMenu: React.FC<SidebarMenuProps> = ({
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
          <span style={{ fontSize: '1.29rem' }}>{item.icon}</span>
          {item.label}
        </SidebarMenuItem>
      ))}
    </SidebarMenuUl>
  </Sidebar>
);

export default DoctorSidebarMenu;

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
  /* SidebarBox (부모 컴포넌트)에서 이미 너비와 패딩을 처리하므로,
     여기서는 flex 속성을 제거하여 부모의 레이아웃에 따르도록 합니다.
     필요하다면 max-width나 width: 100%를 설정할 수 있습니다. */
  width: 100%; /* 부모 SidebarBox의 너비를 꽉 채우도록 */
  padding: 0 1.25rem; /* 좌우 패딩을 SidebarBox 내부에서 조절 */
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
  border-radius: 0.625rem; /* 10px */
  cursor: pointer;
  transition:
    background 0.16s ease,
    /* 전환 속도 약간 증가 */ color 0.16s ease;

  // 활성 상태 스타일 (보호자 관리 페이지와 통일)
  background: ${({ $active }) => ($active ? '#00499e' : 'transparent')}; /* 활성 시 파란색 배경 */
  color: ${({ $active }) =>
    $active ? '#fff' : '#2c2c2c'}; /* 활성 시 흰색 텍스트, 비활성 시 어두운 회색 */

  // 아이콘 색상도 텍스트 색상을 따르도록
  span {
    font-size: 1.25rem;
    color: inherit; /* 부모 텍스트 색상을 상속 */
  }

  // 호버 상태 스타일 (활성 상태와 일관되게)
  &:hover {
    background: ${({ $active }) =>
      $active ? '#003a7a' : '#eef3fa'}; /* 활성 시 더 진한 파란색, 비활성 시 연한 파란색 */
    color: ${({ $active }) => ($active ? '#fff' : '#00499e')}; /* 활성 시 흰색, 비활성 시 파란색 */
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
          {item.icon} {/* 아이콘 자체에 색상이 있다면 span 대신 직접 렌더링하도록 변경 */}
          {item.label}
        </SidebarMenuItem>
      ))}
    </SidebarMenuList>
  </Sidebar>
);

export default SidebarMenu;

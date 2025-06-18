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

// Sidebar 자체는 SidebarBox 내부에 있으므로, Sidebar의 너비는 100%로 설정하는 것이 적절합니다.
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
  /* SidebarBox의 좌우 패딩이 1rem(16px)이므로, item 자체의 좌우 패딩을 조정하여 일관성 유지 */
  padding: 14px 16px; /* 좌우 패딩을 SidebarBox의 좌우 패딩에 맞춤 */
  font-size: 1.05rem; /* 폰트 크기 미세 조정 (기존 1.13rem -> 1.05rem) */
  font-weight: 500;
  color: ${({ $active }) =>
    $active ? '#00499e' : '#2c2c2c'}; /* 활성 색상 통일, 비활성 색상 조정 */
  background: ${({ $active }) => ($active ? '#e0edff' : 'none')}; /* 활성 배경색 통일 */
  border-radius: 10px;
  cursor: pointer;
  margin: 4px 0;
  transition:
    background 0.12s,
    color 0.12s;

  &:hover {
    background: #eef3fa; /* 호버 배경색 조정 */
    color: #00499e; /* 호버 텍스트 색상 통일 */
  }

  span {
    font-size: 1.25rem; /* 아이콘 크기 미세 조정 (기존 1.29rem -> 1.25rem) */
    display: flex; /* 아이콘 중앙 정렬을 위해 flex 추가 */
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
    {children} {/* 프로필 섹션 등 외부에서 넘겨주는 children 렌더링 */}
    <SidebarMenuUl>
      {items.map((item) => (
        <SidebarMenuItem
          key={item.key}
          $active={item.key === activeKey}
          onClick={() => onChange(item.key)}
        >
          {/* 아이콘에 직접 스타일을 적용하지 않고, SidebarMenuItem 내부 span에 스타일 적용 */}
          <span>{item.icon}</span>
          {item.label}
        </SidebarMenuItem>
      ))}
    </SidebarMenuUl>
  </Sidebar>
);

export default SidebarMenu;

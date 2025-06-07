// src/features/reviews/component/common/Modal.tsx

import React from 'react';
import styled from 'styled-components';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  zIndex?: number;
}

export function Modal({ isOpen, onClose, title, children, actions, zIndex = 1000 }: ModalProps) {
  if (!isOpen) return null;
  return (
    <Overlay zIndex={zIndex} onClick={onClose}>
      <Container onClick={(e) => e.stopPropagation()}>
        <Header>
          <h2>{title}</h2>
          <CloseBtn onClick={onClose}>✕</CloseBtn>
        </Header>
        <Content>{children}</Content>
        {actions && <Actions>{actions}</Actions>}
      </Container>
    </Overlay>
  );
}

const Overlay = styled.div<{ zIndex: number }>`
  position: fixed;
  inset: 0;
  z-index: ${(p) => p.zIndex};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.3);
  padding: 1rem; /* 여백을 줘서 모바일에서도 스크롤 가능 */
`;

const Container = styled.div`
  background: #fff;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 32rem; /* 최대 너비를 32rem으로 제한 */
  max-height: 90vh; /* 화면 높이의 90%를 넘지 않도록 */
  overflow-y: auto; /* 내용이 길면 내부 스크롤 생김 */
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  h2 {
    margin: 0;
    font-size: 1.25rem;
  }
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;

  &:focus {
    outline: none;
  }
`;

const Content = styled.div`
  margin-bottom: 1rem;
`;

const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.75rem;
`;

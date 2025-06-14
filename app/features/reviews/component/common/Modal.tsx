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
  padding: 1rem;
`;

const Container = styled.div`
  background: #fff;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 32rem;
  max-height: 90vh;
  overflow-y: auto;
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

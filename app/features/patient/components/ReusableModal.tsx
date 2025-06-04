import styled from 'styled-components';
import React from 'react';

const ModalOverlay = styled.div`
  position: fixed;
  z-index: 2000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(34, 34, 34, 0.24);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalBox = styled.div`
  background: #fff;
  padding: 38px 32px 32px 32px;
  border-radius: 14px;
  box-shadow: 0 8px 40px 0 rgba(0, 0, 0, 0.09);
  min-width: 370px;
  max-width: 95vw;
  text-align: center;
  position: relative;
`;

const ModalTitle = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1646a0;
  margin-bottom: 18px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 18px;
  right: 18px;
  background: none;
  border: none;
  font-size: 1.4rem;
  color: #888;
  cursor: pointer;
`;

export interface ModalProps {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  hideCloseButton?: boolean;
}

const ReusableModal: React.FC<ModalProps> = ({
  open,
  title,
  onClose,
  children,
  hideCloseButton = false,
}) => {
  if (!open) return null;

  return (
    <ModalOverlay>
      <ModalBox>
        {title && <ModalTitle>{title}</ModalTitle>}
        {!hideCloseButton && (
          <CloseButton onClick={onClose} aria-label="닫기">
            ×
          </CloseButton>
        )}
        {children}
      </ModalBox>
    </ModalOverlay>
  );
};

export default ReusableModal;

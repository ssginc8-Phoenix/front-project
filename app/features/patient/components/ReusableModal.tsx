import styled from 'styled-components';
import React from 'react';

// Media queries for responsive design
const media = {
  laptop: `@media (max-width: 1024px)`,
  tablet: `@media (max-width: 768px)`,
  mobile: `@media (max-width: 480px)`,
  mobileSmall: `@media (max-width: 360px)`,
};

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
  padding: 1rem; // Add some padding for very small screens
`;

const ModalBox = styled.div`
  background: #fff;
  padding: 38px 32px 32px 32px;
  border-radius: 14px;
  box-shadow: 0 8px 40px 0 rgba(0, 0, 0, 0.09);
  min-width: 370px;
  max-width: 500px; // A bit more controlled max-width
  width: 90vw; // Use viewport width for responsiveness
  max-height: 90vh; // Prevent modal from exceeding screen height
  overflow-y: auto; // Add scroll if content is too long
  text-align: center;
  position: relative;
  box-sizing: border-box; // Ensure padding is included in width calculation

  ${media.tablet} {
    padding: 30px 25px 25px 25px;
    min-width: 300px;
  }

  ${media.mobile} {
    padding: 25px 20px 20px 20px;
    min-width: unset; // Remove min-width on mobile to allow smaller sizes
    width: 95vw; // Even wider on mobile
  }

  ${media.mobileSmall} {
    padding: 20px 15px 15px 15px;
  }
`;

const ModalTitle = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1646a0;
  margin-bottom: 18px;

  ${media.tablet} {
    font-size: 1.15rem;
    margin-bottom: 15px;
  }

  ${media.mobile} {
    font-size: 1.05rem;
    margin-bottom: 12px;
  }
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
  transition: color 0.2s ease;

  &:hover {
    color: #555;
  }

  ${media.tablet} {
    top: 15px;
    right: 15px;
    font-size: 1.3rem;
  }

  ${media.mobile} {
    top: 12px;
    right: 12px;
    font-size: 1.2rem;
  }
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
    <ModalOverlay onClick={onClose}>
      {' '}
      {/* Close when clicking overlay */}
      <ModalBox onClick={(e) => e.stopPropagation()}>
        {' '}
        {/* Prevent closing when clicking inside */}
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

import styled from 'styled-components';
import { X } from 'lucide-react';

// --- 반응형 디자인을 위한 공통 사이즈 및 미디어 쿼리 정의 ---
const sizes = {
  laptopL: '1600px',
  laptop: '1024px',
  tablet: '768px',
  mobile: '480px',
  mobileSmall: '360px', // Target for 360x740
};

const media = {
  laptopL: `@media (max-width: ${sizes.laptopL})`,
  laptop: `@media (max-width: ${sizes.laptop})`,
  tablet: `@media (max-width: ${sizes.tablet})`,
  mobile: `@media (max-width: ${sizes.mobile})`,
  mobileSmall: `@media (max-width: ${sizes.mobileSmall})`,
};

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex; /* Use flexbox to center the modal */
  align-items: center; /* Center vertically */
  justify-content: center; /* Center horizontally */
`;

const ModalWrapper = styled.div`
  background-color: white;
  border-radius: 1rem;
  min-width: 200px;
  max-width: 500px; /* Adjusted: Fixed max-width for web */
  width: 90%; /* Default width for adaptability, overridden by max-width */
  text-align: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  position: relative; /* For positioning the close icon */
  z-index: 1000; /* Ensure it's above the background */

  ${media.laptop} {
    max-width: 450px; /* Slightly smaller for laptops */
  }

  ${media.tablet} {
    max-width: 80%; /* Adjusted: Wider for tablets, percentage for responsiveness */
    border-radius: 0.9rem;
  }

  ${media.mobile} {
    max-width: 90%; /* Adjusted: Wider for mobile, percentage for responsiveness */
    border-radius: 0.8rem;
  }

  ${media.mobileSmall} {
    max-width: 95%; /* Adjusted: Even wider for small mobile */
    border-radius: 0.7rem;
  }
`;

// New styled component for consistent modal content padding
const ModalContent = styled.div`
  padding: 2.5rem 2rem;

  ${media.tablet} {
    padding: 2rem 1.5rem;
  }

  ${media.mobile} {
    padding: 1.5rem 1rem;
  }

  ${media.mobileSmall} {
    padding: 1.2rem 0.8rem;
  }
`;

const CloseIcon = styled(X)`
  position: absolute;
  top: 1.2rem;
  right: 1.2rem;
  width: 20px;
  height: 20px;
  cursor: pointer;
  color: #555;
  z-index: 1001; /* Ensure close icon is always on top */

  ${media.mobile} {
    top: 1rem;
    right: 1rem;
    width: 18px;
    height: 18px;
  }

  ${media.mobileSmall} {
    top: 0.8rem;
    right: 0.8rem;
    width: 16px;
    height: 16px;
  }
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a3c8b;
  margin-bottom: 1.25rem;

  ${media.mobile} {
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }

  ${media.mobileSmall} {
    font-size: 1rem;
    margin-bottom: 0.8rem;
  }
`;

const ModalDescription = styled.div`
  font-size: 0.95rem;
  color: #555;
  line-height: 1.5;
  margin-bottom: 1.5rem;

  ${media.mobile} {
    font-size: 0.9rem;
    margin-bottom: 1.2rem;
  }

  ${media.mobileSmall} {
    font-size: 0.85rem;
    margin-bottom: 1rem;
  }
`;

const ModalButton = styled.button`
  padding: 0.75rem 1.25rem;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #005fcc;
  }

  ${media.mobile} {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
    border-radius: 0.4rem;
  }

  ${media.mobileSmall} {
    padding: 0.5rem 0.8rem;
    font-size: 0.85rem;
    border-radius: 0.3rem;
  }
`;

interface CommonModalProps {
  title?: string | null; // Make title optional and allow null
  buttonText?: string; // Make buttonText optional
  onClose?: () => void; // Make onClose optional if you want modals that don't close
  children?: React.ReactNode;
}

const CommonModal = ({ title, buttonText, onClose, children }: CommonModalProps) => {
  return (
    <ModalBackground onClick={onClose}>
      <ModalWrapper onClick={(e) => e.stopPropagation()}>
        {onClose && <CloseIcon onClick={onClose} />}{' '}
        {/* Render CloseIcon only if onClose is provided */}
        {/* If no buttonText, assume custom content mode */}
        {!buttonText ? (
          // Render custom children directly within ModalWrapper's content area
          <ModalContent>
            {title && <ModalTitle>{title}</ModalTitle>} {/* Conditionally render title */}
            {children}
          </ModalContent>
        ) : (
          // Standard modal with title, description, and button
          <ModalContent>
            <ModalTitle>{title}</ModalTitle>
            <ModalDescription>{children}</ModalDescription>
            <ModalButton onClick={onClose}>{buttonText}</ModalButton>
          </ModalContent>
        )}
      </ModalWrapper>
    </ModalBackground>
  );
};

export default CommonModal;

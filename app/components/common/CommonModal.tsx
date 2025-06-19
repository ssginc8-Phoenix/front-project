import styled from 'styled-components';
import { X } from 'lucide-react';

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
`;

const ModalWrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 1000;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 2.5rem 2rem;
  border-radius: 1rem;
  min-width: 200px;
  max-width: 30%;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const CloseIcon = styled(X)`
  position: absolute;
  top: 1.2rem;
  right: 1.2rem;
  width: 20px;
  height: 20px;
  cursor: pointer;
  color: #555;
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a3c8b;
  margin-bottom: 1.25rem;
`;

const ModalDescription = styled.div`
  font-size: 0.95rem;
  color: #555;
  line-height: 1.5;
  margin-bottom: 1.5rem;
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
`;

interface CommonModalProps {
  title: string;
  buttonText: string;
  onClose: () => void;
  children?: React.ReactNode;
}

const CommonModal = ({ title, buttonText, onClose, children }: CommonModalProps) => {
  return (
    <ModalBackground onClick={onClose}>
      <ModalWrapper onClick={(e) => e.stopPropagation()}>
        <CloseIcon onClick={onClose} />
        <ModalTitle>{title}</ModalTitle>

        {/* 조건 분기: 버튼 텍스트가 있으면 설명 모드, 없으면 자유 모드 */}
        {buttonText ? (
          <>
            <ModalDescription>{children}</ModalDescription>
            <ModalButton onClick={onClose}>{buttonText}</ModalButton>
          </>
        ) : (
          children
        )}
      </ModalWrapper>
    </ModalBackground>
  );
};

export default CommonModal;

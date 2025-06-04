import React from 'react';
import styled from 'styled-components';

interface ReviewDeleteSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReviewDeleteSuccessModal({
  isOpen,
  onClose,
}: ReviewDeleteSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Title>리뷰가 삭제되었습니다!</Title>
        <ButtonRow>
          <ConfirmButton onClick={onClose}>확인</ConfirmButton>
        </ButtonRow>
      </ModalContainer>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: #ffffff;
  border-radius: 1rem; /* 둥근 모서리 */
  width: 90%;
  max-width: 28rem; /* 최대 너비 */
  padding: 2rem 1.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #333333;
  margin-bottom: 2rem;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
`;

const ConfirmButton = styled.button`
  padding: 0.5rem 1.25rem;
  background-color: #3b82f6; /* blue-500 */
  color: #ffffff;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  border-radius: 0.5rem; /* rounded-md */
  cursor: pointer;

  &:hover {
    background-color: #2563eb; /* blue-600 */
  }
`;

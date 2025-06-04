// 파일: src/features/reviews/component/modal/ReviewEditSuccessModal.tsx

import React from 'react';
import styled from 'styled-components';

interface ReviewEditSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReviewEditSuccessModal({ isOpen, onClose }: ReviewEditSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Title>수정이 완료되었습니다!</Title>
        <ButtonRow>
          <ConfirmButton onClick={onClose}>확인</ConfirmButton>
        </ButtonRow>
      </ModalContainer>
    </Overlay>
  );
}

// ───────── styled-components ─────────

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3); /* 반투명 검정 배경 */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: #ffffff;
  border-radius: 1rem;
  width: 90%;
  max-width: 28rem;
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

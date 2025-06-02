import React from 'react';
import styled from 'styled-components';

interface ReviewSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
`;

const ModalContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 24rem; /* max-w-sm */
  background-color: #ffffff;
  border-radius: 0.5rem; /* rounded-lg */
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  margin: 0 1rem; /* mx-4 */
  padding: 1.5rem; /* p-6 */
`;

const Title = styled.h2`
  font-size: 1.25rem; /* text-xl */
  font-weight: 600; /* font-semibold */
  margin-bottom: 1rem; /* mb-4 */
  text-align: center;
`;

const ConfirmButton = styled.button`
  margin-top: 0.5rem; /* mt-2 */
  padding: 0.5rem 1.5rem; /* px-6 py-2 */
  background-color: #00499e;
  color: #ffffff;
  font-weight: 500; /* font-medium */
  border: none;
  border-radius: 9999px; /* rounded-full */
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #003974;
  }
`;

export const ReviewSuccessModal: React.FC<ReviewSuccessModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
        <Title>리뷰가 생성되었습니다!</Title>
        <ConfirmButton onClick={onClose}>확인</ConfirmButton>
      </ModalContainer>
    </Overlay>
  );
};

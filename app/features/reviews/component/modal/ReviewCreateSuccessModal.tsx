import React from 'react';
import styled from 'styled-components';
import { Button } from '~/features/reviews/component/common/Button';

interface ReviewCreateSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReviewSuccessModal: React.FC<ReviewCreateSuccessModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Title>리뷰가 생성되었습니다!</Title>

        <ButtonWrapper>
          <Button onClick={onClose}>확인</Button>
        </ButtonWrapper>
      </ModalContainer>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
`;

const ModalContainer = styled.div`
  width: 100%;
  max-width: 24rem;
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

// components/ErrorModal.tsx
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3); // 반투명 배경
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Wrapper = styled.div`
  padding: 2rem;
  text-align: center;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  width: 300px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

const CloseButton = styled.button`
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #b91c1c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

interface Props {
  message: string;
  onClose: () => void;
}

const ErrorModal = ({ message, onClose }: Props) => {
  return (
    <Overlay>
      <Wrapper>
        <p>❗ {message}</p>
        <CloseButton onClick={onClose}>닫기</CloseButton>
      </Wrapper>
    </Overlay>
  );
};

export default ErrorModal;

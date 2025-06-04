// src/features/patient/components/Guardian/GuardianModal.tsx
import styled from 'styled-components';

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContainer = styled.div`
  position: relative;
  background: white;
  padding: 32px 48px;
  border-radius: 20px;
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Title = styled.h3`
  font-size: 1.3rem;
  font-weight: bold;
  text-align: center;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid #ccc;
  padding: 8px;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-bottom: 2px solid #2261bb;
  }
`;

const Button = styled.button`
  background: #bfd6fa;
  color: #1646a0;
  font-weight: bold;
  font-size: 1.1rem;
  padding: 10px 0;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #a7c7f7;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

interface GuardianModalProps {
  open: boolean;
  onClose: () => void;
}

const GuardianModal = ({ open, onClose }: GuardianModalProps) => {
  if (!open) return null;

  return (
    <ModalBackground>
      <ModalContainer>
        <CloseButton onClick={onClose}>×</CloseButton> {/* ← 여기 */}
        <Title>보호자 정보 입력</Title>
        <Input placeholder="이름" />
        <Input placeholder="전화번호" />
        <Input placeholder="e-mail" />
        <Button>확인</Button>
      </ModalContainer>
    </ModalBackground>
  );
};

export default GuardianModal;

// src/features/doctor/components/DoctorCapacityModal.tsx
import React from 'react';
import styled from 'styled-components';
import DoctorCapacitySetter from './DoctorCapacitySetter';
import { X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const DoctorCapacityModal: React.FC<Props> = ({ onClose }) => {
  return (
    <Overlay>
      <ModalBox>
        <Header>
          <Title>진료 인원 설정</Title>
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </Header>
        <DoctorCapacitySetter onSaved={onClose} />
      </ModalBox>
    </Overlay>
  );
};

export default DoctorCapacityModal;

// 스타일 정의
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const ModalBox = styled.div`
  background: white;
  border-radius: 12px;
  width: 250px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
`;

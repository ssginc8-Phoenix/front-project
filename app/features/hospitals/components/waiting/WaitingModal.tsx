import { useState } from 'react';
import styled from 'styled-components';
import { useHospitalWaiting } from '~/features/hospitals/hooks/useHospitalWaiting';

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContainer = styled.div`
  background: white;
  padding: 24px;
  border-radius: 16px;
  width: 320px;
  text-align: center;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 16px;
  font-size: 20px;
  color: #999;
  background: none;
  border: none;
  cursor: pointer;
  &:hover {
    color: #000;
  }
`;

export const HospitalName = styled.div`
  font-weight: bold;
  color: #1e4db7;
  font-size: 14px;
  margin-bottom: 8px;
`;

export const Title = styled.p`
  font-size: 16px;
  font-weight: 600;
`;

export const CurrentStatus = styled.p`
  margin-top: 16px;
  color: #666;
`;

export const Highlight = styled.span`
  color: #1e4db7;
  font-size: 20px;
  font-weight: 700;
`;

export const SaveButton = styled.button`
  margin-top: 24px;
  padding: 8px 24px;
  background-color: #e0ecff;
  color: #1e4db7;
  border: none;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #d1e0ff;
  }

  &:disabled {
    background-color: #f0f0f0;
    color: #aaa;
    cursor: not-allowed;
  }
`;

interface WaitingModalProps {
  hospitalId: number;
  onClose: () => void;
}

const WaitingModal = ({ hospitalId, onClose }: WaitingModalProps) => {
  const { waiting, setWaiting, loading, registerWaiting, modifyWaiting } =
    useHospitalWaiting(hospitalId);

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      if (waiting === 0) {
        await registerWaiting(waiting);
      } else {
        await modifyWaiting(waiting);
      }
      alert('대기 인원이 저장되었습니다.');
      onClose();
    } catch (err) {
      console.error(err);
      alert('저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Overlay>
      <ModalContainer>
        <CloseButton onClick={onClose}>×</CloseButton>
        <HospitalName>바른이비인후과</HospitalName>
        <Title>대기인원 설정을 설정해주세요</Title>
        <CurrentStatus>
          현재 : <Highlight>{waiting}명 대기중</Highlight>
        </CurrentStatus>
        <SaveButton onClick={handleSave} disabled={saving || loading}>
          {saving ? '저장 중...' : '저장'}
        </SaveButton>
      </ModalContainer>
    </Overlay>
  );
};

export default WaitingModal;

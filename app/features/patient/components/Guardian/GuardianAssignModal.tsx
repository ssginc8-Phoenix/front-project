import styled from 'styled-components';

interface GuardianAssignModalProps {
  open: boolean;
  onClose: () => void;
  guardianName: string;
  onAssign: () => void;
}

const Overlay = styled.div`
  display: ${({ open }: { open: boolean }) => (open ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalBox = styled.div`
  background: #fff;
  border-radius: 12px;
  width: 400px;
  padding: 40px 20px;
  text-align: center;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

const GuardianImage = styled.div`
  width: 120px;
  height: 120px;
  margin: 20px auto;
  background: #ffe7d9;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3.5rem;
`;

const GuardianName = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  margin-top: 12px;
`;

const ModalTitle = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 12px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
`;

const AssignButton = styled.button`
  background-color: #437ef7;
  color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: bold;
`;

const CancelButton = styled.button`
  background-color: #ffe7e7;
  color: #d60000;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: bold;
`;

const GuardianAssignModal = ({
  open,
  onClose,
  guardianName,
  onAssign,
}: GuardianAssignModalProps) => {
  return (
    <Overlay open={open}>
      <ModalBox>
        <CloseButton onClick={onClose}>×</CloseButton>
        <ModalTitle>아래의 보호자에게 위임하시겠습니까?</ModalTitle>
        <GuardianImage>👩</GuardianImage> {/* 임시 이미지 */}
        <GuardianName>{guardianName}님</GuardianName>
        <ButtonGroup>
          <AssignButton onClick={onAssign}>위임하기</AssignButton>
          <CancelButton onClick={onClose}>취소</CancelButton>
        </ButtonGroup>
      </ModalBox>
    </Overlay>
  );
};

export default GuardianAssignModal;

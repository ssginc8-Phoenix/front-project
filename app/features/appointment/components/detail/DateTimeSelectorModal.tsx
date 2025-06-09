import styled from 'styled-components';
import Button from '~/components/styled/Button';
import DateTimeSelector from '~/features/appointment/components/add/dateTime/DateTimeSelector';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  width: 90%;
  max-width: 540px;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  gap: 1rem;
`;

interface DateTimeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorId: number;
  onConfirm: () => void;
}

const DateTimeSelectorModal = ({ isOpen, onClose, doctorId, onConfirm }: DateTimeSelectorModalProps) => {
  if (!isOpen) return null;

  return (
    <Overlay>
      <Modal>
        <Title>재예약 날짜/시간 선택</Title>
        <DateTimeSelector doctorId={doctorId} />
        <ButtonGroup>
          <Button $variant="secondary" onClick={onClose}>
            취소
          </Button>
          <Button $variant="primary" onClick={onConfirm}>
            재예약 확정
          </Button>
        </ButtonGroup>
      </Modal>
    </Overlay>
  );
};

export default DateTimeSelectorModal;

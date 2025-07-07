import styled from 'styled-components';
import Button from '~/components/styled/Button';
import DateTimeSelector from '~/features/appointment/components/add/dateTime/DateTimeSelector';
import {
  Modal,
  Title,
  ButtonGroup,
} from '~/features/appointment/components/common/AppointmentModal.styles';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999;
`;

interface DateTimeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorId: number;
  patientId: number;
  onConfirm: () => void;
  appointmentId: number;
}

const DateTimeSelectorModal = ({
  isOpen,
  onClose,
  doctorId,
  patientId,
  onConfirm,
  appointmentId,
}: DateTimeSelectorModalProps) => {
  if (!isOpen) return null;

  return (
    <Overlay>
      <Modal>
        <Title>재예약 날짜/시간 선택</Title>
        <DateTimeSelector doctorId={doctorId} patientId={patientId} />
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

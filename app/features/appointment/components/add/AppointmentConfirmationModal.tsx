import Button from '~/components/styled/Button';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Modal = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 480px;
`;

const Title = styled.h2`
  font-size: 1.2rem;
  font-weight: bold;
  text-align: center;
`;

const DateText = styled.p`
  color: #2d7efc;
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
  margin-top: 0.5rem;
  margin-bottom: 1.5rem;
`;

const InfoBox = styled.div`
  background: #f1f7ff;
  border-radius: 8px;
  padding: 1rem;
  font-size: 0.95rem;
  color: #333;
  line-height: 1.6;
`;

const SectionTitle = styled.div`
  font-weight: bold;
  margin-top: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 2rem;
`;

interface AppointmentConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  dateTime: string;
  hospitalName: string;
  doctorName: string;
  patientName: string;
  residentRegistrationNumber: string;
  appointmentType: string;
  symptoms: string;
  paymentMethod: string;
  question?: string;
}

const AppointmentConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  dateTime,
  hospitalName,
  doctorName,
  patientName,
  residentRegistrationNumber,
  appointmentType,
  symptoms,
  paymentMethod,
  question,
}: AppointmentConfirmationModalProps) => {
  if (!isOpen) return null;

  const maskRrn = (rrn: string) => {
    if (!rrn || rrn.length !== 14) return rrn;

    const front = rrn.slice(0, 6);
    const backFirst = rrn[7]; // 뒷자리 첫번째 숫자

    return `${front}-${backFirst}******`;
  };

  const getPaymentMethodInKorean = (method: string) => {
    switch (method) {
      case 'ONSITE':
        return '현장 수납';
      case 'ONLINE':
        return '앱 내 결제';
      default:
        return method;
    }
  };

  const formatDateTimeWithOutSeconds = (dt: string) => {
    const lastColonIndex = dt.lastIndexOf(':');
    if (lastColonIndex > -1 && dt.substring(lastColonIndex + 1, lastColonIndex + 3) === '00') {
      return dt.slice(0, lastColonIndex);
    }
    return dt;
  };

  return (
    <Overlay>
      <Modal>
        <Title>대면 진료 접수 완료하시겠습니까?</Title>
        <DateText>{formatDateTimeWithOutSeconds(dateTime)}</DateText>

        <InfoBox>
          <SectionTitle>병원 정보</SectionTitle>
          {hospitalName}
          <br />
          {doctorName} 의사
          <SectionTitle>환자 정보</SectionTitle>
          {patientName}
          <br />
          {maskRrn(residentRegistrationNumber)}
          <SectionTitle>진료 항목</SectionTitle>
          {appointmentType === 'SCHEDULED' || appointmentType === 'IMMEDIATE'
            ? '일반 진료'
            : appointmentType}
          <SectionTitle>진료 정보</SectionTitle>
          {symptoms}
          {question && (
            <>
              <SectionTitle>원장님께 하고 싶은 말</SectionTitle>
              {question}
            </>
          )}
          <SectionTitle>수납 방법</SectionTitle>
          {getPaymentMethodInKorean(paymentMethod)}
        </InfoBox>

        <ButtonGroup>
          <Button $variant="secondary" onClick={onClose}>
            취소
          </Button>
          <Button $variant="primary" onClick={onConfirm}>
            예약접수 신청
          </Button>
        </ButtonGroup>
      </Modal>
    </Overlay>
  );
};

export default AppointmentConfirmationModal;

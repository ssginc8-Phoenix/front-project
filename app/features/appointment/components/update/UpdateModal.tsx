import { useAppointmentDetail } from '~/features/appointment/hooks/useAppointmentDetail';
import LoadingIndicator from '~/components/common/LoadingIndicator';
import ErrorMessage from '~/components/common/ErrorMessage';
import Button from '~/components/styled/Button';
import styled from 'styled-components';
import { RefreshButton } from '~/components/styled/RefreshButton';
import { FiRefreshCw } from 'react-icons/fi';
import { useAppointmentActions } from '~/features/appointment/hooks/useAppointmentActions';
import {
  Divider,
  Header,
  HospitalName,
  InfoText,
  Modal,
  Overlay,
  Section,
  SectionTitle,
  SubInfo,
  Title,
  TitleRow,
} from '../common/AppointmentModal.styles';
import { useNavigate } from 'react-router';

interface AppointmentUpdateModalProps {
  appointmentId: number;
  isOpen: boolean;
  onClose: () => void;
}

const ButtonStack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  margin-top: 2rem;
`;

const ButtonRowCenter = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const AppointmentUpdateModal = ({
  appointmentId,
  isOpen,
  onClose,
}: AppointmentUpdateModalProps) => {
  const {
    data: appointment,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useAppointmentDetail(appointmentId);

  const navigate = useNavigate();
  const { cancelAppointment, updateAppointmentStatus } = useAppointmentActions();

  const canConfirm = appointment?.status === 'REQUESTED';
  const canModify = appointment?.status === 'REQUESTED' || appointment?.status === 'CONFIRMED';
  let canRequestPayment =
    appointment?.paymentType === 'ONLINE' && appointment?.status === 'COMPLETED';

  /** 예약 취소 */
  const handleCancel = async () => {
    if (!appointment) return;
    const success = await cancelAppointment(appointment.appointmentId);
    if (success) {
      await refetch();
    }
  };

  /** 예약 승인 */
  const handleConfirm = async () => {
    if (!appointment) return;
    const success = await updateAppointmentStatus(appointment.appointmentId, 'CONFIRMED');
    if (success) {
      await refetch();
    }
  };

  /** 예약 완료 */
  const handleComplete = async () => {
    if (!appointment) return;
    const success = await updateAppointmentStatus(appointment.appointmentId, 'COMPLETED');
    if (success) {
      await refetch();
      if (appointment?.paymentType === 'ONLINE') {
        canRequestPayment = true;
      }
    }
  };

  /** 결제 요청 페이지로 이동 */
  const handlePaymentRequest = () => {
    navigate(`/payments/request?appointmentId=${appointment?.appointmentId}`);
  };

  return (
    <>
      <Overlay>
        <Modal>
          {isLoading && <LoadingIndicator />}
          {error && <ErrorMessage message={error.message} />}

          {appointment && (
            <>
              <Header>
                <TitleRow>
                  <Title>
                    {new Date(appointment.appointmentTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    진료예약
                  </Title>
                  <RefreshButton onClick={() => refetch()} disabled={isRefetching} title="새로고침">
                    <FiRefreshCw size={20} />
                  </RefreshButton>
                </TitleRow>

                <HospitalName> {appointment.hospitalName} </HospitalName>
                <SubInfo>
                  {appointment.doctorName} 원장 <br />
                  접수: {appointment.createdAt}
                </SubInfo>
              </Header>

              <Divider />

              <Section>
                <SectionTitle>병원 정보</SectionTitle>
                <InfoText>{appointment.hospitalName}</InfoText>
                <InfoText>{appointment.doctorName} 원장</InfoText>
              </Section>

              <Section>
                <SectionTitle>환자 정보</SectionTitle>
                <InfoText>{appointment.patientName}</InfoText>
                {/* 주민등록번호 : 민감정보 보여주는 게 맞는가? */}
              </Section>

              <Section>
                <SectionTitle>진료 항목</SectionTitle>
                <InfoText>
                  {appointment.appointmentType === 'SCHEDULED' ||
                  appointment.appointmentType === 'IMMEDIATE'
                    ? '일반 진료'
                    : appointment.appointmentType}
                </InfoText>
              </Section>

              <Section>
                <SectionTitle>진료 정보</SectionTitle>
                <InfoText>{appointment.symptom}</InfoText>
              </Section>

              {appointment.question && (
                <Section>
                  <SectionTitle>원장님께 궁금한 점</SectionTitle>
                  <InfoText>{appointment.question}</InfoText>
                </Section>
              )}

              <Section>
                <SectionTitle>수납 방법</SectionTitle>
                <InfoText>{appointment.paymentType}</InfoText>
              </Section>

              <ButtonStack>
                <ButtonRowCenter>
                  {canModify && (
                    <>
                      <Button $variant="secondary" onClick={handleCancel}>
                        예약 취소
                      </Button>
                      {canConfirm && (
                        <Button $variant="secondary" onClick={handleConfirm}>
                          예약 승인
                        </Button>
                      )}
                      <Button $variant="secondary" onClick={handleComplete}>
                        예약 완료
                      </Button>
                    </>
                  )}
                </ButtonRowCenter>

                <ButtonRowCenter>
                  {canRequestPayment && (
                    <Button $variant="primary" onClick={handlePaymentRequest}>
                      결제 요청
                    </Button>
                  )}
                  <Button $variant="primary" onClick={onClose}>
                    닫기
                  </Button>
                </ButtonRowCenter>
              </ButtonStack>
            </>
          )}
        </Modal>
      </Overlay>
    </>
  );
};

export default AppointmentUpdateModal;

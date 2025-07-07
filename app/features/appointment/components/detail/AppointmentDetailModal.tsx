import { useAppointmentDetail } from '~/features/appointment/hooks/useAppointmentDetail';
import LoadingIndicator from '~/components/common/LoadingIndicator';
import ErrorMessage from '~/components/common/ErrorMessage';
import Button from '~/components/styled/Button';
import { RefreshButton } from '~/components/styled/RefreshButton';
import { FiRefreshCw } from 'react-icons/fi';
import { useAppointmentActions } from '~/features/appointment/hooks/useAppointmentActions';
import { useEffect, useRef } from 'react';
import {
  Overlay,
  Modal,
  Header,
  TitleRow,
  Title,
  HospitalName,
  SubInfo,
  Divider,
  Section,
  SectionTitle,
  InfoText,
  ButtonGroup,
} from '~/features/appointment/components/common/AppointmentModal.styles';
import LoginStore from '~/features/user/stores/LoginStore';

interface AppointmentDetailModalProps {
  appointmentId: number;
  isOpen: boolean;
  onClose: () => void;
  onRefreshList: () => void;
  onRescheduleInitiated: (appointmentId: number, doctorId: number, patientId: number) => void;
}

const AppointmentDetailModal = ({
  appointmentId,
  isOpen,
  onClose,
  onRefreshList,
  onRescheduleInitiated,
}: AppointmentDetailModalProps) => {
  const {
    data: appointment,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useAppointmentDetail(appointmentId);
  const { user } = LoginStore();
  const role = user?.role;

  const { cancelAppointment } = useAppointmentActions();

  const canModify = appointment?.status === 'REQUESTED' || appointment?.status === 'CONFIRMED';

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // 모달 내부를 클릭한 것이 아닌 경우 onClose 호출
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  /** 예약 취소 */
  const handleCancel = async () => {
    if (!appointment) return;
    const success = await cancelAppointment(appointment.appointmentId);
    if (success) {
      onRefreshList();
      onClose();
    }
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

  return (
    <>
      <Overlay>
        <Modal ref={modalRef}>
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
                <InfoText>{getPaymentMethodInKorean(appointment.paymentType)}</InfoText>
              </Section>

              {role == 'GUARDIAN' && canModify && (
                <ButtonGroup>
                  <Button $variant="secondary" onClick={handleCancel}>
                    예약 취소
                  </Button>
                  <Button
                    $variant="primary"
                    onClick={() => {
                      if (appointment) {
                        // 부모 컴포넌트에 재예약 시작을 알리고 필요한 ID 전달
                        onRescheduleInitiated(
                          appointment.appointmentId,
                          appointment.doctorId,
                          appointment.patientId,
                        );
                        onClose(); // AppointmentDetailModal 닫기
                      }
                    }}
                  >
                    재예약
                  </Button>
                </ButtonGroup>
              )}

              <ButtonGroup>
                <Button $variant="primary" onClick={onClose}>
                  닫기
                </Button>
              </ButtonGroup>
            </>
          )}
        </Modal>
      </Overlay>
    </>
  );
};

export default AppointmentDetailModal;

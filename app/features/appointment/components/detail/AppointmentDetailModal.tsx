import { useAppointmentDetail } from '~/features/appointment/hooks/useAppointmentDetail';
import LoadingIndicator from '~/components/common/LoadingIndicator';
import ErrorMessage from '~/components/common/ErrorMessage';
import styled from 'styled-components';
import Button from '~/components/styled/Button';
import { RefreshButton } from '~/components/styled/RefreshButton';
import { FiRefreshCw } from 'react-icons/fi';
import { useAppointmentActions } from '~/features/appointment/hooks/useAppointmentActions';
import { useState } from 'react';
import useAppointmentStore from '~/features/appointment/state/useAppointmentStore';
import dayjs from 'dayjs';
import DateTimeSelectorModal from '~/features/appointment/components/detail/DateTimeSelectorModal';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const Modal = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  width: 90%;
  max-width: 540px;
`;

const Header = styled.div`
  margin-bottom: 1rem;
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: #0066ff;
  margin-bottom: 0.25rem;
`;

const HospitalName = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #000;
  margin-top: 0.5rem;
`;

const SubInfo = styled.div`
  font-size: 0.75rem;
  color: #666;
  margin-top: 0.25rem;
  line-height: 1.4;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e5e7eb; // 연한 회색 선
  margin: 1rem 0;
`;

const Section = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.div`
  font-weight: 600;
  color: #1d4ed8;
  margin-bottom: 0.25rem;
`;

const InfoText = styled.p`
  margin: 0;
  color: #333;
  line-height: 1.5;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

interface AppointmentDetailModalProps {
  appointmentId: number;
  isOpen: boolean;
  onClose: () => void;
  onRefreshList: () => void;
}

const AppointmentDetailModal = ({
  appointmentId,
  isOpen,
  onClose,
  onRefreshList,
}: AppointmentDetailModalProps) => {
  const {
    data: appointment,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useAppointmentDetail(appointmentId);

  const { cancelAppointment, rescheduleAppointment } = useAppointmentActions();

  const [isDateTimeSelectorModalOpen, setDateTimeSelectorModalOpen] = useState(false);
  const { date, time, setDate, setTime } = useAppointmentStore();

  const canModify = appointment?.status === 'REQUESTED' || appointment?.status === 'CONFIRMED';

  /** 예약 취소 */
  const handleCancel = async () => {
    if (!appointment) return;
    const success = await cancelAppointment(appointment.appointmentId);
    if (success) {
      onRefreshList();
    }
  };

  /** 재예약 */
  const handleReschedule = async () => {
    if (!appointment || !date || !time) {
      alert('날짜와 시간을 선택해주세요.');
      return;
    }

    const newDateTime = dayjs(
      `${dayjs(date).format('YYYY-MM-DD')} ${time}`,
      'YYYY-MM-DD HH:mm:ss',
    ).format('YYYY-MM-DDTHH:mm:ss');

    const success = await rescheduleAppointment(appointment.appointmentId, newDateTime);
    if (success) {
      refetch();
      setDateTimeSelectorModalOpen(false);
      onRefreshList();
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

              {canModify && (
                <ButtonGroup>
                  <Button $variant="secondary" onClick={handleCancel}>
                    예약 취소
                  </Button>
                  <Button $variant="primary" onClick={() => setDateTimeSelectorModalOpen(true)}>
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

      {appointment && (
        <DateTimeSelectorModal
          isOpen={isDateTimeSelectorModalOpen}
          onClose={() => setDateTimeSelectorModalOpen(false)}
          doctorId={appointment.doctorId}
          patientId={appointment.patientId}
          onConfirm={handleReschedule}
        />
      )}
    </>
  );
};

export default AppointmentDetailModal;

import { useAppointmentDetail } from '~/features/appointment/hooks/useAppointmentDetail';
import LoadingIndicator from '~/components/common/LoadingIndicator';
import ErrorMessage from '~/components/common/ErrorMessage';
import { RefreshButton } from '~/components/styled/RefreshButton';
import { FiRefreshCw } from 'react-icons/fi';
import Button from '~/components/styled/Button';
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
import ButtonGroup from 'antd/es/button/button-group';

interface DoctorAppointmentDetailModal {
  appointmentId: number;
  isOpen: boolean;
  onClose: () => void;
}

const DoctorAppointmentDetailModal = ({
  appointmentId,
  isOpen,
  onClose,
}: DoctorAppointmentDetailModal) => {
  const {
    data: appointment,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useAppointmentDetail(appointmentId);

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

export default DoctorAppointmentDetailModal;

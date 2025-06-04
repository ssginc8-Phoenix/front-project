import { useAppointmentDetail } from '~/features/appointment/hooks/useAppointmentDetail';
import LoadingIndicator from '~/components/common/LoadingIndicator';
import ErrorMessage from '~/components/common/ErrorMessage';
import styled from 'styled-components';
import Button from '~/components/styled/Button';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

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
}

const AppointmentDetailModal = ({
  appointmentId,
  isOpen,
  onClose,
}: AppointmentDetailModalProps) => {
  const { data: appointment, loading, error } = useAppointmentDetail(appointmentId);

  return (
    <Overlay>
      <Modal>
        {loading && <LoadingIndicator />}
        {error && <ErrorMessage message={error} />}

        {appointment && (
          <>
            <Header>
              <Title>
                {new Date(appointment.appointmentTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
                진료예약
              </Title>
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
              <InfoText>{appointment.appointmentType}</InfoText>
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
  );
};

export default AppointmentDetailModal;

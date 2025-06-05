import type { AppointmentList } from '~/types/appointment';
import styled from 'styled-components';
import { StatusBadge } from '~/components/styled/StatusBadge';
import ReviewCreateModal from '~/features/reviews/component/modal/ReviewCreateModal';
import { useState } from 'react';

const Card = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 180px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HospitalName = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
`;

const InfoText = styled.div`
  font-size: 0.9rem;
  color: #333;
  margin-top: 4px;
`;

const ReviewButton = styled.button`
  margin-top: 12px;
  font-size: 0.85rem;
  color: #2563eb;
  text-decoration: underline;
  background: none;
  border: none;
  cursor: pointer;
  align-self: flex-start;
`;

interface AppointmentCardProps {
  appointment: AppointmentList;
  onClick: () => void;
}

const formatAppointmentTime = (isoString: string) => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  const hours = `${date.getHours()}`.padStart(2, '0');
  const minutes = `${date.getMinutes()}`.padStart(2, '0');
  return `${year}.${month}.${day} ${hours}시 ${minutes}분`;
};

const AppointmentCard = ({ appointment, onClick }: AppointmentCardProps) => {
  const [isReviewOpen, setReviewOpen] = useState(false);

  const statusKorean = (() => {
    switch (appointment.status) {
      case 'REQUESTED':
        return '예약 요청';
      case 'CONFIRMED':
        return '예약 완료';
      case 'COMPLETED':
        return '진료 완료';
      case 'CANCELED':
        return '취소';
      default:
        return appointment.status;
    }
  })();

  const handleReviewSaved = () => {
    setReviewOpen(false);
  };

  return (
    <>
      <Card onClick={onClick}>
        <TopRow>
          <HospitalName> {appointment.hospitalName} </HospitalName>
          <StatusBadge status={appointment.status}> {statusKorean} </StatusBadge>
        </TopRow>
        <InfoText> {appointment.doctorName} </InfoText>
        <InfoText> {formatAppointmentTime(appointment.appointmentTime)} </InfoText>
        <InfoText> {appointment.patientName} </InfoText>

        <ReviewButton
          onClick={(e) => {
            e.stopPropagation();
            setReviewOpen(true);
          }}
        >
          리뷰작성
        </ReviewButton>
      </Card>

      <ReviewCreateModal
        isOpen={isReviewOpen}
        onClose={() => setReviewOpen(false)}
        onSaved={handleReviewSaved}
        hospitalName={appointment.hospitalName}
        doctorName={appointment.doctorName}
        userId={0 /** zustand의 user의 userId 가져오기*/}
        doctorId={appointment.doctorId}
        appointmentId={appointment.appointmentId}
      />
    </>
  );
};

export default AppointmentCard;

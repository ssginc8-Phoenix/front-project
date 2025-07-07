import type { AppointmentList } from '~/types/appointment';
import styled from 'styled-components';
import { StatusBadge } from '~/components/styled/StatusBadge';
import ReviewCreateModal from '~/features/reviews/component/add/ReviewCreateModal';
import { useState } from 'react';
import LoginStore from '~/features/user/stores/LoginStore';
import { useNavigate } from 'react-router';
import { AlertModal } from '~/features/reviews/component/common/AlertModal';

const Card = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 180px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  background-color: white;
  max-width: 380px;
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
  const minutes = `${date.getMinutes()}`.padStart(1, '0');
  return `${year}.${month}.${day} ${hours}시 ${minutes}분`;
};

const AppointmentCard = ({ appointment, onClick }: AppointmentCardProps) => {
  const navigate = useNavigate();
  const [isReviewOpen, setReviewOpen] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false); //성공 모달창

  const { user } = LoginStore();

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
    setShowSuccessAlert(true);
    // 리뷰 작성 완료되면 바로 리뷰관리 페이지로 이동
    setTimeout(() => {
      setShowSuccessAlert(false);
      navigate('/review');
    }, 1500);
  };

  return (
    <>
      <Card onClick={onClick}>
        <TopRow>
          <HospitalName> {appointment.hospitalName} </HospitalName>
          <StatusBadge status={appointment.status}> {statusKorean} </StatusBadge>
        </TopRow>
        <InfoText> {appointment.doctorName} 의사 </InfoText>
        <InfoText> {formatAppointmentTime(appointment.appointmentTime)} </InfoText>
        <InfoText> {appointment.patientName} 환자 </InfoText>

        {appointment.status === 'COMPLETED' && !appointment.hasReview && (
          <ReviewButton
            onClick={(e) => {
              e.stopPropagation();
              setReviewOpen(true);
            }}
          >
            리뷰작성
          </ReviewButton>
        )}
      </Card>

      <ReviewCreateModal
        isOpen={isReviewOpen}
        onClose={() => setReviewOpen(false)}
        onSaved={handleReviewSaved}
        hospitalName={appointment.hospitalName}
        doctorName={appointment.doctorName}
        userId={user!.userId}
        hospitalId={appointment.hospitalId}
        doctorId={appointment.doctorId}
        appointmentId={appointment.appointmentId}
      />

      <AlertModal
        isOpen={showSuccessAlert}
        onClose={() => setShowSuccessAlert(false)}
        message="리뷰 작성이 완료되었습니다!"
      />
    </>
  );
};

export default AppointmentCard;

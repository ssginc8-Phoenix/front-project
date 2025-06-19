import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useHospitalDetail } from '../../../hooks/useHospitalDetail';
import type { HospitalSchedule } from '../../../types/hospitalSchedule';
import { useNavigate } from 'react-router';

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 1rem;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 1100px;
  height: 480px;
  border-radius: 0.75rem;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  overflow-y: auto;
`;

const ModalContent = styled.div`
  max-width: 90vw;
  max-height: 90vh;
  img {
    max-width: 100%;
    max-height: 100%;
    border-radius: 0.75rem;
  }
`;

const Header = styled.div`
  margin: 1.5rem 0;
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HospitalName = styled.h2`
  font-size: 1.8rem;
  font-weight: bold;
`;

const WaitCount = styled.span`
  background-color: #fef3c7;
  color: #b45309;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.9rem;
`;

const Address = styled.p`
  color: #374151;
  margin: 0.5rem 0;
`;

const InfoRow = styled.div`
  margin-top: 0.5rem;
  color: #6b7280;
`;

const NoticeBox = styled.div`
  background-color: #f9fafb;
  padding: 1rem;
  border-left: 4px solid #3b82f6;
  margin-top: 1rem;
  border-radius: 0.5rem;
  white-space: pre-wrap;
  p {
    margin: 0;
    color: #1f2937;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const ActionButton = styled.button`
  padding: 10px 16px;
  border-radius: 8px;
  background-color: #3b82f6;
  color: white;
  font-weight: 500;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #2563eb;
  }
`;
const ServiceTag = styled.span`
  display: inline-block;
  background-color: #3b82f6;
  color: white;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.9rem;
  margin-right: 8px;
  margin-bottom: 8px;
`;

interface HospitalInfoTabProps {
  hospitalId: number;
  selectedTab: 'location' | 'doctors' | 'reviews';
}

const HospitalInfoTab = ({ hospitalId }: HospitalInfoTabProps) => {
  const { data: hospital, loading, error } = useHospitalDetail(hospitalId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const formatTime = (time: string) => time.substring(0, 5);
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  const navigate = useNavigate();

  if (loading) return <p style={{ textAlign: 'center' }}>로딩 중...</p>;
  if (error) return <p style={{ textAlign: 'center', color: 'red' }}>{String(error)}</p>;
  if (!hospital) return <p style={{ textAlign: 'center' }}>병원 정보를 찾을 수 없습니다.</p>;

  const dayOfWeekMap: Record<number, string> = {
    0: 'SUNDAY',
    1: 'MONDAY',
    2: 'TUESDAY',
    3: 'WEDNESDAY',
    4: 'THURSDAY',
    5: 'FRIDAY',
    6: 'SATURDAY',
  };
  const todayKey = dayOfWeekMap[new Date().getDay()];
  const todaySchedule = hospital.schedules?.find((s: HospitalSchedule) => s.dayOfWeek === todayKey);
  const sch = todaySchedule
    ? `${formatTime(todaySchedule.openTime)} ~ ${formatTime(todaySchedule.closeTime)}`
    : '정보 없음';

  return (
    <>
      {isModalOpen && (
        <Overlay onClick={() => setIsModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <img src={hospital.imageUrl} alt="원본 이미지" />
          </ModalContent>
        </Overlay>
      )}

      <Container>
        <ImageWrapper onClick={() => setIsModalOpen(true)}>
          <Image src={hospital.imageUrl} alt={hospital.name} />
        </ImageWrapper>

        <Header>
          <TitleRow>
            <HospitalName>{hospital.name}</HospitalName>
            <WaitCount>대기 {hospital.waiting ?? 0}명</WaitCount>
          </TitleRow>
          <Address>{hospital.address}</Address>
          <InfoRow>
            ☎ {hospital.phone} | 진료시간: {sch}
          </InfoRow>
        </Header>

        {hospital.serviceNames && (
          <div>
            {hospital.serviceNames.map((name, idx) => (
              <ServiceTag key={idx}>{name}</ServiceTag>
            ))}
          </div>
        )}

        {hospital.notice && (
          <NoticeBox>
            <p>📢 {hospital.notice}</p>
          </NoticeBox>
        )}

        <ButtonGroup>
          <ActionButton onClick={() => navigate(`/appointments/request?hospitalId=${hospitalId}`)}>
            🏥 대면 진료 접수
          </ActionButton>
        </ButtonGroup>
      </Container>
    </>
  );
};

export default HospitalInfoTab;

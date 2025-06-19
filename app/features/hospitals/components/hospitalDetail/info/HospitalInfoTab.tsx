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
const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr; /* 좌:우 = 2:1 */
  grid-template-rows: 1fr 1fr; /* 위:아래 = 1:1 */
  grid-template-areas:
    'big thumb1'
    'big thumb2';
  gap: 0.75rem;
  height: 400px; /* 필요에 따라 조정 */
  margin-bottom: 1.5rem;
`;
const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

// 각 썸네일
const GridThumb = styled.div<{ area: 'big' | 'thumb1' | 'thumb2' }>`
  grid-area: ${({ area }) => area};
  position: relative;
  overflow: hidden;
  border-radius: 0.75rem;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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
  const images = hospital.imageUrls ?? [];
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
      {isModalOpen && selectedImage && (
        <Overlay onClick={() => setIsModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="원본 이미지" />
          </ModalContent>
        </Overlay>
      )}

      <Container>
        {/* 전체 뷰용 메인 이미지 */}
        {images && images.length >= 3 && (
          <GalleryGrid>
            {/* 왼쪽 큰 이미지 */}
            <GridThumb
              area="big"
              onClick={() => {
                setSelectedImage(images[0]);
                setIsModalOpen(true);
              }}
            >
              <img src={images[0]} alt={`${hospital.name} 사진 1`} />
            </GridThumb>

            {/* 오른쪽 위 작은 이미지 */}
            <GridThumb
              area="thumb1"
              onClick={() => {
                setSelectedImage(images[1]);
                setIsModalOpen(true);
              }}
            >
              <img src={images[1]} alt={`${hospital.name} 사진 2`} />
            </GridThumb>

            {/* 오른쪽 아래 작은 이미지 */}
            <GridThumb
              area="thumb2"
              onClick={() => {
                setSelectedImage(images[2]);
                setIsModalOpen(true);
              }}
            >
              <img src={images[2]} alt={`${hospital.name} 사진 3`} />
            </GridThumb>
          </GalleryGrid>
        )}

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
            <p>📢 공지사항 </p>
            {hospital.notice}
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

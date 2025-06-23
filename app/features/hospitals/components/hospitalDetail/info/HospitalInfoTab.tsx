import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useHospitalDetail } from '../../../hooks/useHospitalDetail';
import type { HospitalSchedule } from '../../../types/hospitalSchedule';
import { useNavigate } from 'react-router';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useAppointmentStore from '~/features/appointment/state/useAppointmentStore';

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
const SliderContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px; /* 원하시는 높이로 설정 */
  margin-bottom: 1.5rem;
  overflow: hidden;
  border-radius: 0.75rem;
`;

const SlideImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
  display: block;
`;

const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.4);
  border: none;
  color: white;
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(0, 0, 0, 0.6);
  }
`;

const PrevButton = styled(ArrowButton)`
  left: 1rem;
`;
const NextButton = styled(ArrowButton)`
  right: 1rem;
`;
interface HospitalInfoTabProps {
  hospitalId: number;
  selectedTab: 'location' | 'doctors' | 'reviews';
}

const HospitalInfoTab = ({ hospitalId }: HospitalInfoTabProps) => {
  const { data: hospital, loading, error } = useHospitalDetail(hospitalId);
  const { setHospitalId, setHospitalName } = useAppointmentStore();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [current, setCurrent] = useState(0);

  const formatTime = (time: string) => time.substring(0, 5);
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  /**
   * 진료 접수 버튼 클릭 핸들러
   */
  const handleAppointmentClick = () => {
    if (!hospital) return null;
    setHospitalId(hospital.hospitalId);
    setHospitalName(hospital.name);
    navigate(`/appointment`);
  };

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
        {images.length > 0 && (
          <SliderContainer>
            {/* 이전 버튼 */}
            {images.length > 1 && (
              <PrevButton onClick={() => setCurrent((current - 1 + images.length) % images.length)}>
                <ChevronLeft size={24} />
              </PrevButton>
            )}

            {/* 현재 이미지 */}
            <SlideImage
              src={images[current]}
              alt={`병원 사진 ${current + 1}`}
              onClick={() => {
                setSelectedImage(images[current]);
                setIsModalOpen(true);
              }}
            />

            {/* 다음 버튼 */}
            {images.length > 1 && (
              <NextButton onClick={() => setCurrent((current + 1) % images.length)}>
                <ChevronRight size={24} />
              </NextButton>
            )}
          </SliderContainer>
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
          <ActionButton onClick={handleAppointmentClick}>🏥 진료 접수</ActionButton>
        </ButtonGroup>
      </Container>
    </>
  );
};

export default HospitalInfoTab;

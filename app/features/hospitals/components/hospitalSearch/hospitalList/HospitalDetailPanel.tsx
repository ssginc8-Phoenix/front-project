import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useHospitalDetail } from '~/features/hospitals/hooks/useHospitalDetail';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HospitalDetailPanelProps {
  hospitalId: number;
  onClose: () => void;
}

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  padding: 1rem;
  height: 600px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  gap: 0.25rem;
  font-family: 'Pretendard', sans-serif;
  max-height: calc(100vh - 32px);
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
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
    border-radius: 8px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HospitalName = styled.h2`
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0;
`;

const Tag = styled.span`
  background-color: #e5f0ff;
  color: #0051c7;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.9rem;
`;

const SectionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: #555;
  font-weight: 600;
`;

const Text = styled.div`
  white-space: pre-wrap;
  word-break: break-word;
  font-size: 0.95rem;
  color: #555;
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
  cursor: default;
  user-select: none;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  font-weight: bold;
  color: #888;
  cursor: pointer;
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const PrimaryButton = styled.button`
  flex: 1;
  padding: 0.6rem 1.2rem;
  background-color: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background-color: #2563eb;
  }
`;

const SecondaryButton = styled.button`
  flex: 1;
  padding: 0.6rem 1.2rem;
  background-color: #e5e7eb;
  color: #374151;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background-color: #d1d5db;
  }
`;

/* ↓ 여기가 슬라이더 스타일 ↓ */
const SliderContainer = styled.div`
  position: relative;
  width: 100%;
  height: 35vh;
  margin-bottom: 1rem;
  overflow: hidden;
  border-radius: 0.75rem;
`;

const SlideImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover; /* 화면을 꽉 채우며 중앙 크롭 */
  cursor: pointer;
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
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(0, 0, 0, 0.6);
  }
`;

const PrevButton = styled(ArrowButton)`
  left: 0.5rem;
`;
const NextButton = styled(ArrowButton)`
  right: 0.5rem;
`;
/* ↑ 슬라이더 스타일 끝 ↑ */

const HospitalDetailPanel: React.FC<HospitalDetailPanelProps> = ({ hospitalId, onClose }) => {
  const { data: hospital, loading, error } = useHospitalDetail(hospitalId);
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (panelRef.current) panelRef.current.scrollTop = 0;
  }, [hospitalId]);

  if (loading) return <div>로딩 중...</div>;
  if (error || !hospital) return <div>정보를 불러오지 못했습니다.</div>;

  const images = hospital.imageUrls ?? [];

  return (
    <>
      {selectedImage && (
        <Overlay onClick={() => setSelectedImage(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="원본 이미지" />
          </ModalContent>
        </Overlay>
      )}

      <Panel ref={panelRef}>
        {/* 슬라이더 */}
        {images.length > 0 && (
          <SliderContainer>
            {images.length > 1 && (
              <PrevButton onClick={() => setCurrent((current - 1 + images.length) % images.length)}>
                <ChevronLeft size={24} />
              </PrevButton>
            )}
            <SlideImage
              src={images[current]}
              alt={`병원 사진 ${current + 1}`}
              onClick={() => setSelectedImage(images[current])}
            />
            {images.length > 1 && (
              <NextButton onClick={() => setCurrent((current + 1) % images.length)}>
                <ChevronRight size={24} />
              </NextButton>
            )}
          </SliderContainer>
        )}

        {/* 헤더 & 기본 정보 */}
        <Header>
          <HospitalName>{hospital.name}</HospitalName>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Tag>대기 {hospital.waiting ?? 0}명</Tag>
            <CloseButton onClick={onClose}>✕</CloseButton>
          </div>
        </Header>

        <SectionLabel>📍 병원 소개</SectionLabel>
        <Text>{hospital.introduction || '소개 정보 없음'}</Text>

        <SectionLabel>📌 공지사항</SectionLabel>
        <Text>{hospital.notice || '공지사항 없음'}</Text>

        <div>{hospital.serviceNames?.map((svc, i) => <ServiceTag key={i}>{svc}</ServiceTag>)}</div>

        <ActionGroup>
          <PrimaryButton onClick={() => navigate(`/appointments/request?hospitalId=${hospitalId}`)}>
            바로 접수
          </PrimaryButton>
          <SecondaryButton onClick={() => navigate(`/hospital/${hospitalId}`)}>
            상세 보기
          </SecondaryButton>
        </ActionGroup>
      </Panel>
    </>
  );
};

export default HospitalDetailPanel;

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useHospitalDetail } from '~/features/hospitals/hooks/useHospitalDetail';

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
  max-height: calc(100vh - 32px); /* SidePanel 여유 포함 */
  overflow-y: auto; /* 패널 전체를 스크롤 */
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

const DetailButton = styled.button`
  margin-top: 0.5rem;
  padding: 0.6rem 1.2rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background-color: #0056b3;
  }
`;
const ThumbnailsWrapper = styled.div`
  display: grid;
  /* 좌우 2:1 비율, 위아래 2줄 */
  grid-template-columns: 2fr 1fr;
  grid-template-rows: repeat(2, 1fr);
  /* 영역 이름 정의 */
  grid-template-areas:
    'big thumb1'
    'big thumb2';
  gap: 0.5rem;
  height: 35vh; /* 필요에 따라 조절 */
`;
const Thumb = styled.div<{
  area: 'big' | 'thumb1' | 'thumb2';
  large?: boolean;
}>`
  grid-area: ${({ area }) => area};
  position: relative;
  overflow: hidden;
  cursor: pointer;

  /* large면 그리드 영역 100% 높이, 
     아니면 정사각형(aspect-ratio) 유지 */
  ${({ large }) =>
    large
      ? `
    height: 100%;
  `
      : `
    aspect-ratio: 1 / 1;
  `}
  width: 100%;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const MoreOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 2rem;
  font-weight: bold;
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

const HospitalDetailPanel: React.FC<HospitalDetailPanelProps> = ({ hospitalId, onClose }) => {
  const { data: hospital, loading, error } = useHospitalDetail(hospitalId);
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.scrollTop = 0;
    }
  }, [hospitalId]);
  if (loading) return <div>로딩 중...</div>;
  if (error || !hospital) return <div>정보를 불러오지 못했습니다.</div>;
  const images = hospital.imageUrls?.length
    ? hospital.imageUrls
    : ['https://via.placeholder.com/300x160'];
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
        <ThumbnailsWrapper>
          {/* 왼쪽 큰 사진 */}
          {images[0] && (
            <Thumb
              area="big"
              large /* <- 이 한 줄이 중요합니다! */
              onClick={() => setSelectedImage(images[0])}
            >
              <img src={images[0]} alt={`병원 사진 1`} />
            </Thumb>
          )}

          {/* 오른쪽 위 */}
          {images[1] && (
            <Thumb area="thumb1" onClick={() => setSelectedImage(images[1])}>
              <img src={images[1]} alt={`병원 사진 2`} />
            </Thumb>
          )}

          {/* 오른쪽 아래 (+n 오버레이) */}
          {images[2] && (
            <Thumb area="thumb2" onClick={() => setSelectedImage(images[2])}>
              <img src={images[2]} alt={`병원 사진 3`} />
              {images.length > 3 && <MoreOverlay>+{images.length - 3}</MoreOverlay>}
            </Thumb>
          )}
        </ThumbnailsWrapper>
        <Header>
          <HospitalName>{hospital.name}</HospitalName>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Tag>대기 {hospital.waiting ?? 0}명</Tag>
            <CloseButton onClick={onClose}>✕</CloseButton>
          </div>
        </Header>

        <div>
          {hospital.serviceNames?.map((serviceName, idx) => (
            <ServiceTag key={idx}>{serviceName}</ServiceTag>
          ))}
        </div>

        <SectionLabel>📍 병원 소개</SectionLabel>
        <Text>{hospital.introduction ?? '소개 정보 없음'}</Text>

        <SectionLabel>📌 공지사항</SectionLabel>
        <Text>{hospital.notice ?? '공지사항 없음'}</Text>

        <DetailButton onClick={() => navigate(`/hospital/${hospital.hospitalId}`)}>
          병원 상세 보기
        </DetailButton>
      </Panel>
    </>
  );
};

export default HospitalDetailPanel;

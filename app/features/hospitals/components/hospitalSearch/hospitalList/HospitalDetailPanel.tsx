import React, { useState } from 'react';
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
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  gap: 0.75rem;
  font-family: 'Pretendard', sans-serif;
  max-height: 80vh;
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

const Thumbnail = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) return <div>로딩 중...</div>;
  if (error || !hospital) return <div>정보를 불러오지 못했습니다.</div>;

  return (
    <>
      {isModalOpen && (
        <Overlay onClick={() => setIsModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <img src={hospital.imageUrl || ''} alt="원본 이미지" />
          </ModalContent>
        </Overlay>
      )}

      <Panel>
        <Thumbnail
          src={hospital.imageUrl || 'https://via.placeholder.com/300x160'}
          alt="병원 사진"
          onClick={() => setIsModalOpen(true)}
        />

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

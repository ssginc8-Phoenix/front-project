import React from 'react';
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
  height: 160px;
  object-fit: cover;
  border-radius: 8px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  color: #555;
`;

const KeywordButton = styled.button`
  background: #e8f0ff;
  color: #00499e;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  cursor: default;
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
  console.log('[🏥 병원 상세 데이터]', hospital);
  if (loading) return <div>로딩 중...</div>;
  if (error || !hospital) return <div>정보를 불러오지 못했습니다.</div>;

  return (
    <Panel>
      <Thumbnail src={hospital.imageUrl || 'https://via.placeholder.com/300x160'} alt="병원 사진" />

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

      <Row>📍 {hospital.introduction ?? '소개 정보 없음'}</Row>
      <Row>📌 {hospital.notice ?? '공지사항 없음'}</Row>

      <DetailButton onClick={() => navigate(`/hospitals/${hospital.hospitalId}`)}>
        병원 상세 보기
      </DetailButton>
    </Panel>
  );
};

export default HospitalDetailPanel;

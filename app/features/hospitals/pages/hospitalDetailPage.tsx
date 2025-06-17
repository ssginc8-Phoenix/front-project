import styled from 'styled-components';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { useHospitalDetail } from '../hooks/useHospitalDetail';
import HospitalInfoTab from '../components/hospitalDetail/info/HospitalInfoTab';
import HospitalMap from '../components/hospitalDetail/map/HospitalMap';
import HospitalReviews from '../components/hospitalDetail/review/HospitalReviews';
import HospitalDoctor from '../components/hospitalDetail/doctor/HospitalDoctor';
import { useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 1rem;
  min-height: 800px;
  box-sizing: border-box;
`;

const TabBar = styled.div`
  display: flex;
  margin-top: 2rem;
  border-bottom: 1px solid #e5e7eb;
`;
const BackButton = styled.button`
  position: absolute;
  top: 8rem;
  left: 1.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  padding: 0.5rem 1rem;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  font-size: 0.875rem;
  font-weight: 500;
  color: #1d4ed8;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.1s ease;

  &:hover {
    background: #eff6ff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }

  &:active {
    background: #e0e7ff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(0);
  }
`;
const Tab = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean }>`
  flex: 1;
  padding: 12px 0;
  background: none;
  border: none;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  color: ${({ active }) => (active ? '#1d4ed8' : '#6b7280')};
  border-bottom: 3px solid ${({ active }) => (active ? '#1d4ed8' : 'transparent')};

  &:hover {
    color: #2563eb;
  }
`;

const HospitalDetailPage = () => {
  const { hospitalId } = useParams<{ hospitalId: string }>();
  const navigate = useNavigate();
  const hospitalIdNum = hospitalId && !isNaN(Number(hospitalId)) ? Number(hospitalId) : undefined;

  if (!hospitalIdNum) {
    return (
      <p style={{ textAlign: 'center', color: 'red' }}>
        병원 ID가 제공되지 않았거나 잘못되었습니다.
      </p>
    );
  }

  const { loading, error } = useHospitalDetail(hospitalIdNum);

  const [selectedTab, setSelectedTab] = useState<'location' | 'Doctor' | 'reviews'>('location');

  if (loading) {
    return <p style={{ textAlign: 'center' }}>병원 정보를 불러오는 중...</p>;
  }

  if (error) {
    return <p style={{ textAlign: 'center', color: 'red' }}>오류 발생: {error}</p>;
  }

  return (
    <Container>
      <BackButton onClick={() => navigate(-1)}>
        <ChevronLeft size={16} />
        뒤로가기
      </BackButton>
      <HospitalInfoTab hospitalId={hospitalIdNum} selectedTab="location" />

      <TabBar>
        <Tab active={selectedTab === 'location'} onClick={() => setSelectedTab('location')}>
          위치 정보
        </Tab>
        <Tab active={selectedTab === 'Doctor'} onClick={() => setSelectedTab('Doctor')}>
          의사 정보
        </Tab>
        <Tab active={selectedTab === 'reviews'} onClick={() => setSelectedTab('reviews')}>
          리뷰
        </Tab>
      </TabBar>

      {selectedTab === 'location' && <HospitalMap hospitalId={hospitalIdNum} />}
      {selectedTab === 'Doctor' && <HospitalDoctor hospitalId={hospitalIdNum} />}
      {selectedTab === 'reviews' && <HospitalReviews hospitalId={hospitalIdNum} />}
    </Container>
  );
};

export default HospitalDetailPage;

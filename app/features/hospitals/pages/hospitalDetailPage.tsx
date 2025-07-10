import React, { useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

import { useHospitalDetail } from '../hooks/useHospitalDetail';
import HospitalInfoTab from '../components/hospitalDetail/info/HospitalInfoTab';
import HospitalMap from '../components/hospitalDetail/map/HospitalMap';
import HospitalReviews from '../components/hospitalDetail/review/HospitalReviews';
import HospitalDoctor from '../components/hospitalDetail/doctor/HospitalDoctor';

// Breakpoint
const MOBILE_BREAK = '768px';

const Container = styled.div`
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 1rem;
  min-height: 800px;
  box-sizing: border-box;

  @media (max-width: ${MOBILE_BREAK}) {
    margin: 1rem 0; /* 좌우 마진 제거 */
    padding: 1rem 0.5rem; /* 좌우 패딩 절반으로 */
    max-width: none; /* 꽉 채우기 */
  }
`;

const TabBar = styled.div`
  display: flex;
  width: 100%; /* 컨테이너 너비를 꽉 채움 */
  margin-top: 2rem;
  border-bottom: 1px solid #e5e7eb;

  @media (max-width: ${MOBILE_BREAK}) {
    margin-top: 1rem;
  }
`;

const Tab = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean }>`
  flex: 1; /* 동일 너비로 균등 분할 */
  padding: 12px 0;
  background: none;
  border: none;
  text-align: center;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  color: ${({ active }) => (active ? '#1d4ed8' : '#6b7280')};
  border-bottom: 3px solid ${({ active }) => (active ? '#1d4ed8' : 'transparent')};

  &:hover {
    color: #2563eb;
  }

  @media (max-width: ${MOBILE_BREAK}) {
    padding: 8px 0;
    font-size: 0.9rem;
  }
`;

const HospitalDetailPage: React.FC = () => {
  const { hospitalId } = useParams<{ hospitalId: string }>();
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
      <HospitalInfoTab hospitalId={hospitalIdNum} selectedTab="location" />

      <TabBar>
        <Tab active={selectedTab === 'location'} onClick={() => setSelectedTab('location')}>
          상세 정보
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

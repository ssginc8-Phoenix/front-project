import React, { useState } from 'react';
import styled from 'styled-components';
import HospitalChart from '~/features/hospitals/components/hospitalAdmin/chart/HospitalChart';
import ReviewPolarityChart from '~/features/hospitals/components/hospitalAdmin/chart/ReviewPolarityChart';
import MonthlyStatsChart from '~/features/hospitals/components/hospitalAdmin/chart/MonthlyStatsChart';
import { useMyHospitalId } from '~/features/hospitals/hooks/useMyHospitalId';
import { Card } from '~/features/hospitals/components/hospitalAdmin/ui/card';
import { useMediaQuery } from '~/features/hospitals/hooks/useMediaQuery';
import { media } from '~/features/hospitals/components/common/breakpoints';

const PageWrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  max-width: 1000px;
  padding: 0 1rem;
  display: flex;
  min-height: 100vh;

  ${media('mobile')`
    padding: 0.5rem 0.1rem;
  `}
`;

const MainSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #00499e;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;

  ${media('mobile')`
    font-size: 1.5rem;
    margin-bottom: 1rem;
  `}
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
`;

const FullWidthCard = styled(Card)`
  grid-column: span 2;
  width: 100%;
`;

const TabBar = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  margin-bottom: 1rem;
`;

const TabButton = styled.button<{ active: boolean }>`
  width: 100%;
  padding: 0.75rem 0; /* 좌우 패딩 없애고 상하만 줘도 OK */
  font-size: 1rem;
  font-weight: 600;
  background: ${({ active }) => (active ? '#4e73df' : 'transparent')};
  color: ${({ active }) => (active ? '#fff' : '#4e73df')};
  border: none;
  border-bottom: ${({ active }) => (active ? '4px solid #224abe' : '4px solid transparent')};
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;

  &:hover {
    background: #4e73df;
    color: #fff;
  }
`;

const HospitalAdminChartPage: React.FC = () => {
  const { hospitalId, loading } = useMyHospitalId();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [selectedTab, setSelectedTab] = useState<'weekly' | 'review' | 'monthly'>('weekly');

  if (loading) return <p>로딩 중입니다...</p>;
  if (!hospitalId) return <p>병원 정보를 불러올 수 없습니다.</p>;

  return (
    <PageWrapper>
      <MainSection>
        <Title>📊 병원 통계 차트</Title>

        {isMobile ? (
          <>
            <TabBar>
              <TabButton active={selectedTab === 'weekly'} onClick={() => setSelectedTab('weekly')}>
                주간 건수
              </TabButton>
              <TabButton active={selectedTab === 'review'} onClick={() => setSelectedTab('review')}>
                리뷰 통계
              </TabButton>
              <TabButton
                active={selectedTab === 'monthly'}
                onClick={() => setSelectedTab('monthly')}
              >
                월별 통계
              </TabButton>
            </TabBar>

            {selectedTab === 'weekly' && (
              <Card>
                <HospitalChart />
              </Card>
            )}
            {selectedTab === 'review' && (
              <Card>
                <ReviewPolarityChart hospitalId={hospitalId} />
              </Card>
            )}
            {selectedTab === 'monthly' && (
              <Card>
                <MonthlyStatsChart />
              </Card>
            )}
          </>
        ) : (
          <ChartGrid>
            <FullWidthCard>
              <HospitalChart />
            </FullWidthCard>
            <Card>
              <ReviewPolarityChart hospitalId={hospitalId} />
            </Card>
            <Card>
              <MonthlyStatsChart />
            </Card>
          </ChartGrid>
        )}
      </MainSection>
    </PageWrapper>
  );
};

export default HospitalAdminChartPage;

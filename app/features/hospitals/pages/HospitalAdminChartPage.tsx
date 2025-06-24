import styled from 'styled-components';
import HospitalChart from '~/features/hospitals/components/hospitalAdmin/chart/HospitalChart';
import ReviewPolarityChart from '~/features/hospitals/components/hospitalAdmin/chart/ReviewPolarityChart';
import UserRatioChart from '~/features/hospitals/components/hospitalAdmin/chart/UserRatioChart';
import { useMyHospitalId } from '~/features/hospitals/hooks/useMyHospitalId';
import { Card } from '~/features/hospitals/components/hospitalAdmin/ui/card';
import Sidebar from '~/common/Sidebar';
import MonthlyStatsChart from '~/features/hospitals/components/hospitalAdmin/chart/MonthlyStatsChart';

const PageWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px; // <-- 통일
  display: flex;
  gap: 48px;
  min-height: 100vh;
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
  margin-bottom: 2rem; // <-- 여백 맞춤
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
`;

const FullWidthCard = styled(Card)`
  grid-column: span 2;
`;

const HospitalAdminChartPage = () => {
  const { hospitalId, loading } = useMyHospitalId();

  if (loading) return <p>로딩 중입니다...</p>;
  if (!hospitalId) return <p>병원 정보를 불러올 수 없습니다.</p>;

  return (
    <PageWrapper>
      <Sidebar />

      <MainSection>
        <Title>📊 병원 통계 차트</Title>
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
      </MainSection>
    </PageWrapper>
  );
};

export default HospitalAdminChartPage;

import styled from 'styled-components';
import { useNavigate } from 'react-router';
import HospitalSidebarMenu from '~/features/hospitals/components/hospitalAdmin/HospitalSidebarMenu';
import { hospitalSidebarItems } from '~/features/hospitals/components/constants/hospitalSidebarItems';
import HospitalChart from '~/features/hospitals/components/hospitalAdmin/chart/HospitalChart';
import ReviewPolarityChart from '~/features/hospitals/components/hospitalAdmin/chart/ReviewPolarityChart';
import UserRatioChart from '~/features/hospitals/components/hospitalAdmin/chart/UserRatioChart';
import { useMyHospitalId } from '~/features/hospitals/hooks/useMyHospitalId';
import useLoginStore from '~/features/user/stores/LoginStore';
import { Card } from '~/features/hospitals/components/hospitalAdmin/ui/card';
import { useQuery } from '@tanstack/react-query';
import { getMyHospital } from '~/features/hospitals/api/hospitalAPI';

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

const SidebarBox = styled.div`
  width: 200px;
  height: 550px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 32px 0 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

const ProfileEmoji = styled.div`
  font-size: 4rem;
  margin-bottom: 0.5rem;
`;

const ProfileName = styled.div`
  font-weight: bold;
  font-size: 1.3rem;
`;

const ProfileRole = styled.div`
  color: #777;
  font-size: 1rem;
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
  const navigate = useNavigate();
  const { hospitalId, loading } = useMyHospitalId();
  const { user } = useLoginStore();

  const handleSidebarChange = (key: string) => {
    const targetPath = `/hospital/${key}`;
    if (window.location.pathname === targetPath) {
      navigate(0);
    } else {
      navigate(targetPath);
    }
  };

  if (loading) return <p>로딩 중입니다...</p>;
  if (!hospitalId) return <p>병원 정보를 불러올 수 없습니다.</p>;

  return (
    <PageWrapper>
      <SidebarBox>
        <ProfileSection>
          <ProfileEmoji>
            {user?.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt="의사 프로필"
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              '🏥️'
            )}
          </ProfileEmoji>

          <ProfileName>{user?.name ?? '이름 로딩 중'} 님</ProfileName>
          <ProfileRole>병원관리자</ProfileRole>
        </ProfileSection>
        <HospitalSidebarMenu
          items={hospitalSidebarItems}
          activeKey="chart"
          onChange={handleSidebarChange}
        />
      </SidebarBox>

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
            <UserRatioChart />
          </Card>
        </ChartGrid>
      </MainSection>
    </PageWrapper>
  );
};

export default HospitalAdminChartPage;

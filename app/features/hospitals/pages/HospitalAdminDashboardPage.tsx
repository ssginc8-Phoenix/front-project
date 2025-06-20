import styled from 'styled-components';
import { useNavigate } from 'react-router';
import HospitalSidebarMenu from '~/features/hospitals/components/hospitalAdmin/HospitalSidebarMenu';
import { hospitalSidebarItems } from '~/features/hospitals/components/constants/hospitalSidebarItems';
import HospitalUpdateForm from '~/features/hospitals/components/hospitalAdmin/info/HospitalUpdateForm';
import useLoginStore from '~/features/user/stores/LoginStore';

// ------------------- 스타일 정의 -------------------
const PageWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  display: flex;
  gap: 48px;
  min-height: 100vh;
`;

const MainSection = styled.div`
  flex: 1;
  min-width: 0;
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
const SidebarBox = styled.div`
  width: 200px;
  height: 600px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 32px 0 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
`;

// ------------------- 컴포넌트 -------------------
const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useLoginStore();

  const handleSidebarChange = (key: string) => {
    const targetPath = `/hospital/${key}`;
    if (window.location.pathname === targetPath) {
      navigate(0); // 새로고침
    } else {
      navigate(targetPath);
    }
  };

  return (
    <>
      <PageWrapper>
        {/* 사이드바 */}
        <SidebarBox>
          <ProfileSection>
            <ProfileEmoji>
              {user?.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt="병원관리자 프로필"
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
            activeKey="info"
            onChange={handleSidebarChange}
          />
        </SidebarBox>

        {/* 메인 콘텐츠 */}
        <MainSection>
          <Title>🏥 병원 대시보드</Title>
          <HospitalUpdateForm />
          {/* <ReviewSection /> */}
          {/* <WaitModal /> */}
        </MainSection>
      </PageWrapper>
    </>
  );
};

export default AdminDashboard;

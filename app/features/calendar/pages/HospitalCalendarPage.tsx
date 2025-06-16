import styled from 'styled-components';
import HospitalCalendar from '~/features/calendar/components/HospitalCalendar';
import useLoginStore from '~/features/user/stores/LoginStore';
import HospitalSidebarMenu from '~/features/hospitals/components/hospitalAdmin/HospitalSidebarMenu';
import { hospitalSidebarItems } from '~/features/hospitals/components/constants/hospitalSidebarItems';
import { useNavigate } from 'react-router';

const PageWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f0f4f8;
  font-family: 'Segoe UI', sans-serif;
`;

const SidebarBox = styled.div`
  width: 260px;
  background: white;
  border-right: 1px solid #e0e0e0;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 0 20px 20px 0;
  box-shadow: 4px 0 12px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
`;

const ContentWrapper = styled.div`
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2.5rem;
`;

const ProfileEmoji = styled.div`
  font-size: 3.5rem;
  margin-bottom: 0.75rem;
`;

const ProfileName = styled.div`
  font-weight: 700;
  font-size: 1.2rem;
  color: #222;
`;

const ProfileRole = styled.div`
  color: #888;
  font-size: 0.95rem;
`;

const HospitalCalendarPage = () => {
  const { user } = useLoginStore();
  const navigate = useNavigate();

  const handleSidebarChange = (key: string) => {
    const targetPath = `/hospitals/${key}`;
    if (window.location.pathname === targetPath) {
      navigate(0); // 새로고침
    } else {
      navigate(targetPath);
    }
  };

  return (
    <PageWrapper>
      <SidebarBox>
        <ProfileSection>
          <ProfileEmoji>🏥</ProfileEmoji>
          <ProfileName>{user?.name ?? '이름 로딩 중'} 님</ProfileName>
          <ProfileRole>병원 관리자</ProfileRole>
        </ProfileSection>
        <HospitalSidebarMenu
          items={hospitalSidebarItems}
          activeKey="calendar"
          onChange={handleSidebarChange}
        />
      </SidebarBox>

      <ContentWrapper>
        <HospitalCalendar />
      </ContentWrapper>
    </PageWrapper>
  );
};

export default HospitalCalendarPage;

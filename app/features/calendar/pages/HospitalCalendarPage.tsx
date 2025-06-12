import styled from 'styled-components';
import HospitalCalendar from '~/features/calendar/components/HospitalCalendar';
import useLoginStore from '~/features/user/stores/LoginStore';
import HospitalSidebarMenu from '~/features/hospitals/components/hospitalAdmin/HospitalSidebarMenu';
import { hospitalSidebarItems } from '~/features/hospitals/components/constants/hospitalSidebarItems';
import { useNavigate } from 'react-router';

const PageWrapper = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f5f7fb;
`;

const SidebarBox = styled.div`
  width: 260px;
  background: #fff;
  border-right: 1px solid #ddd;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
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

const ContentWrapper = styled.div`
  flex: 1;
  padding: 2rem;
  overflow: hidden;
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

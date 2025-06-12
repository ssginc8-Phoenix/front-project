import styled from 'styled-components';
import useLoginStore from '~/features/user/stores/LoginStore';
import GuardianCalendar from '~/features/calendar/components/GuardianCalendar';
import SidebarMenu from '~/features/guardian/components/SidebarMenu';
import { guardianSidebarItems } from '~/features/guardian/constants/sidebarItems';
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

const GuardianCalendarPage = () => {
  const { user } = useLoginStore();
  const navigate = useNavigate();

  const handleSidebarChange = (key: string) => {
    navigate(`/guardians/${key}`);
  };

  return (
    <PageWrapper>
      <SidebarBox>
        <ProfileSection>
          <ProfileEmoji>🧑‍💼</ProfileEmoji> {/* 🔥 보호자 이모지 변경 */}
          <ProfileName>{user?.name ?? '이름 로딩 중'} 님</ProfileName>
          <ProfileRole>보호자</ProfileRole>
        </ProfileSection>

        <SidebarMenu
          items={guardianSidebarItems}
          activeKey={'calendar'}
          onChange={handleSidebarChange}
        />
      </SidebarBox>

      <ContentWrapper>
        <GuardianCalendar />
      </ContentWrapper>
    </PageWrapper>
  );
};

export default GuardianCalendarPage;

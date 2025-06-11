import styled from 'styled-components';
import DoctorCalendar from '~/features/calendar/components/DoctorCalendar';
import useLoginStore from '~/features/user/stores/LoginStore';

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
  overflow-y: auto;
`;

const DoctorCalendarPage = () => {
  const { user } = useLoginStore();

  return (
    <PageWrapper>
      <SidebarBox>
        <ProfileSection>
          <ProfileEmoji>🧑‍⚕️</ProfileEmoji>
          <ProfileName>{user?.name ?? '이름 로딩 중'} 님</ProfileName>
          <ProfileRole>의사</ProfileRole>
        </ProfileSection>
      </SidebarBox>

      <ContentWrapper>
        <DoctorCalendar />
      </ContentWrapper>
    </PageWrapper>
  );
};

export default DoctorCalendarPage;

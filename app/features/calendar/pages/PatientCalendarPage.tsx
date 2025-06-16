import styled from 'styled-components';
import PatientCalendar from '~/features/calendar/components/PatientCalendar';
import SidebarMenu from '~/features/patient/components/SidebarMenu';
import { patientSidebarItems } from '~/features/patient/constants/sidebarItems';
import useLoginStore from '~/features/user/stores/LoginStore';
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

const PatientCalendarPage = () => {
  const { user } = useLoginStore();
  const navigate = useNavigate();

  const handleSidebarChange = (key: string) => {
    navigate(`/patients/${key}`);
  };

  return (
    <PageWrapper>
      <SidebarBox>
        <ProfileSection>
          <ProfileEmoji>👵</ProfileEmoji>
          <ProfileName>{user?.name ?? '이름 로딩 중'} 님</ProfileName>
          <ProfileRole>환자</ProfileRole>
        </ProfileSection>

        <SidebarMenu
          items={patientSidebarItems}
          activeKey={'calendar'}
          onChange={handleSidebarChange}
        />
      </SidebarBox>

      <ContentWrapper>
        <PatientCalendar />
      </ContentWrapper>
    </PageWrapper>
  );
};

export default PatientCalendarPage;

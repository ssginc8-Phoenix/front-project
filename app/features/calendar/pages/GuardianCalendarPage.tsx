import styled from 'styled-components';
import useLoginStore from '~/features/user/stores/LoginStore';
import GuardianCalendar from '~/features/calendar/components/GuardianCalendar';
import SidebarMenu from '~/features/guardian/components/SidebarMenu';
import { useNavigate } from 'react-router';
import { guardianSidebarItems } from '~/constants/sidebarItems';

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
const ProfileImage = styled.img`
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 8px;
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
          <ProfileImage
            src={
              user?.profileImageUrl ??
              'https://docto-project.s3.ap-southeast-2.amazonaws.com/user/user.png'
            }
            alt="프로필 사진"
          />
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

import styled from 'styled-components';
import DoctorCalendar from '~/features/calendar/components/DoctorCalendar';
import useLoginStore from '~/features/user/stores/LoginStore';
import { doctorSidebarItems } from '~/features/doctor/components/constants/doctorSidebarItems';
import DoctorSidebarMenu from '~/features/doctor/ui/DoctorSidebarMenu';
import React from 'react';
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
  overflow-y: auto;
`;

const DoctorCalendarPage = () => {
  const { user } = useLoginStore();
  const navigate = useNavigate();
  const handleSidebarChange = (key: string) => {
    const targetPath = `/doctor/${key}`;
    if (window.location.pathname === targetPath) {
      navigate(0);
    } else {
      navigate(targetPath);
    }
  };
  return (
    <PageWrapper>
      <SidebarBox>
        <ProfileSection>
          <ProfileEmoji>🧑‍⚕️</ProfileEmoji>
          <ProfileName>{user?.name ?? '이름 로딩 중'} 님</ProfileName>
          <ProfileRole>의사</ProfileRole>
        </ProfileSection>
        <DoctorSidebarMenu
          items={doctorSidebarItems}
          activeKey="schedule"
          onChange={handleSidebarChange}
        />
      </SidebarBox>

      <ContentWrapper>
        <DoctorCalendar />
      </ContentWrapper>
    </PageWrapper>
  );
};

export default DoctorCalendarPage;

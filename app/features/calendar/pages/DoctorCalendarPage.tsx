import styled from 'styled-components';
import DoctorCalendar from '~/features/calendar/components/DoctorCalendar';
import Sidebar from '~/common/Sidebar';

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

const ContentWrapper = styled.div`
  flex: 1;
  padding: 2rem;
  overflow: hidden;
`;

const DoctorCalendarPage = () => {
  return (
    <PageWrapper>
      <SidebarBox>
        <Sidebar />
      </SidebarBox>

      <ContentWrapper>
        <DoctorCalendar />
      </ContentWrapper>
    </PageWrapper>
  );
};

export default DoctorCalendarPage;

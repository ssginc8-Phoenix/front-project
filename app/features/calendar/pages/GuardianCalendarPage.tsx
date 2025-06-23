import styled from 'styled-components';
import GuardianCalendar from '~/features/calendar/components/GuardianCalendar';
import Sidebar from '~/common/Sidebar';

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

const GuardianCalendarPage = () => {
  return (
    <PageWrapper>
      <SidebarBox>
        <Sidebar />
      </SidebarBox>

      <ContentWrapper>
        <GuardianCalendar />
      </ContentWrapper>
    </PageWrapper>
  );
};

export default GuardianCalendarPage;

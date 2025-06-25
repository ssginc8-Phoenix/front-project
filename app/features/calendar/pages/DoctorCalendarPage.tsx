import styled from 'styled-components';
import DoctorCalendar from '~/features/calendar/components/DoctorCalendar';
import Sidebar from '~/common/Sidebar';

const PageWrapper = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f5f7fb;
`;

const ContentWrapper = styled.div`
  flex: 1;
  padding: 2rem;
  overflow: hidden;
`;

const DoctorCalendarPage = () => {
  return (
    <PageWrapper>
      <Sidebar />

      <ContentWrapper>
        <DoctorCalendar />
      </ContentWrapper>
    </PageWrapper>
  );
};

export default DoctorCalendarPage;

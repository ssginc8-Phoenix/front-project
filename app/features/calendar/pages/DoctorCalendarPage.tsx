import styled from 'styled-components';
import DoctorCalendar from '~/features/calendar/components/DoctorCalendar';

const ContentWrapper = styled.div`
  flex: 1;
  padding: 2rem;
  overflow: hidden;
`;

const DoctorCalendarPage = () => {
  return (
    <>
      <ContentWrapper>
        <DoctorCalendar />
      </ContentWrapper>
    </>
  );
};

export default DoctorCalendarPage;

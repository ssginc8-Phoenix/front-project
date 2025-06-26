import styled from 'styled-components';
import HospitalCalendar from '~/features/calendar/components/HospitalCalendar';

const ContentWrapper = styled.div`
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
`;

const HospitalCalendarPage = () => {
  return (
    <>
      <ContentWrapper>
        <HospitalCalendar />
      </ContentWrapper>
    </>
  );
};

export default HospitalCalendarPage;

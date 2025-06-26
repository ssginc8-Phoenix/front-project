import styled from 'styled-components';
import PatientCalendar from '~/features/calendar/components/PatientCalendar';

const ContentWrapper = styled.div`
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
`;

const PatientCalendarPage = () => {
  return (
    <>
      <ContentWrapper>
        <PatientCalendar />
      </ContentWrapper>
    </>
  );
};

export default PatientCalendarPage;

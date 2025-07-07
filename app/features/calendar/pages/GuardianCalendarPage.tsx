import styled from 'styled-components';
import GuardianCalendar from '~/features/calendar/components/GuardianCalendar';

const ContentWrapper = styled.div`
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
`;

const GuardianCalendarPage = () => {
  return (
    <>
      <ContentWrapper>
        <GuardianCalendar />
      </ContentWrapper>
    </>
  );
};

export default GuardianCalendarPage;

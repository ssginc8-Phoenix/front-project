import styled from 'styled-components';
import HospitalCalendar from '~/features/calendar/components/HospitalCalendar';

// --- 반응형 디자인을 위한 공통 사이즈 및 미디어 쿼리 정의 ---
const sizes = {
  laptopL: '1600px',
  laptop: '1024px',
  tablet: '768px',
  mobile: '480px',
  mobileSmall: '360px', // Target for 360x740
};

const media = {
  laptopL: `@media (max-width: ${sizes.laptopL})`,
  laptop: `@media (max-width: ${sizes.laptop})`,
  tablet: `@media (max-width: ${sizes.tablet})`,
  mobile: `@media (max-width: ${sizes.mobile})`,
  mobileSmall: `@media (max-width: ${sizes.mobileSmall})`,
};

const ContentWrapper = styled.div`
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;

  ${media.tablet} {
    padding: 1.5rem; /* 태블릿 패딩 조정 */
  }

  ${media.mobile} {
    padding: 1rem; /* 모바일 패딩 조정 */
  }

  ${media.mobileSmall} {
    padding: 0.75rem; /* 360px 기준 패딩 조정 */
  }
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

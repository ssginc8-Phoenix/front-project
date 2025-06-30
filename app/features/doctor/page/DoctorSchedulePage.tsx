import styled from 'styled-components';
import { Title } from '~/components/styled/MyPage.styles';
import DoctorScheduleForm from '~/features/doctor/components/doctorinfo/schedule/DoctorScheduleForm';

// ------------------- 스타일 정의 -------------------
const PageWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  display: flex;
  gap: 48px;
  min-height: 100vh;
  box-sizing: border-box; /* ← 추가 */

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 24px;
    padding: 10px 5px;
  }
`;

const MainSection = styled.div`
  flex: 1;
  min-width: 0;
`;

// ------------------- 컴포넌트 -------------------
const DoctorSchedulePage = () => {
  return (
    <PageWrapper>
      {/* 사이드바 */}

      {/* 메인 콘텐츠 */}
      <MainSection>
        <Title>스케줄 관리</Title>
        <DoctorScheduleForm />
      </MainSection>
    </PageWrapper>
  );
};

export default DoctorSchedulePage;

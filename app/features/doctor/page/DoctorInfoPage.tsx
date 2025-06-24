import styled from 'styled-components';
import DoctorInfoForm from '~/features/doctor/components/doctorinfo/info/DoctorInfoForm';
import Sidebar from '~/common/Sidebar';

// ------------------- 스타일 정의 -------------------
const PageWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  display: flex;
  gap: 48px;
  min-height: 100vh;
`;

const MainSection = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.h2`
  font-size: 2.2rem;
  font-weight: 700;
  color: #00499e;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

// ------------------- 컴포넌트 -------------------
const DoctorInfoPage = () => {
  return (
    <PageWrapper>
      {/* 사이드바 */}
      <Sidebar />

      {/* 메인 콘텐츠 */}
      <MainSection>
        <Title>👨‍⚕️ 의사 정보 관리</Title>
        <DoctorInfoForm />
      </MainSection>
    </PageWrapper>
  );
};

export default DoctorInfoPage;

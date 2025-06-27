import styled from 'styled-components';

import HospitalUpdateForm from '~/features/hospitals/components/hospitalAdmin/info/HospitalUpdateForm';

import Sidebar from '~/common/Sidebar';
import { media } from '~/features/hospitals/components/common/breakpoints';

// ------------------- 스타일 정의 -------------------
const PageWrapper = styled.div`
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0.5rem;
  display: flex;
  gap: 48px;
  min-height: 100vh;
  ${media('mobile')`
      flex-direction: column;
    padding: 0;          /* 모바일에서 완전 제로 패딩 */
    gap: 1px;
    
  `}
`;

const MainSection = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #00499e;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem; // <-- 여백 맞춤
  ${media('mobile')`
      flex-direction: column;
    padding: 0;          /* 모바일에서 완전 제로 패딩 */
    gap: 1px;
    
  `}
`;

// ------------------- 컴포넌트 -------------------
const AdminDashboard = () => {
  return (
    <>
      <PageWrapper>
        {/* 메인 콘텐츠 */}
        <MainSection>
          <Title>🏥 병원 대시보드</Title>
          <HospitalUpdateForm />
        </MainSection>
      </PageWrapper>
    </>
  );
};

export default AdminDashboard;

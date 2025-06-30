import styled from 'styled-components';

import HospitalUpdateForm from '~/features/hospitals/components/hospitalAdmin/info/HospitalUpdateForm';

import { media } from '~/features/hospitals/components/common/breakpoints';
import { Title } from '~/components/styled/MyPage.styles';

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
const Emoji = styled.span`
  display: none;

  /* mobile 뷰에만 보이게 */
  ${media('mobile')`
    display: inline;
  `}
`;

// ------------------- 컴포넌트 -------------------
const AdminDashboard = () => {
  return (
    <>
      <PageWrapper>
        {/* 메인 콘텐츠 */}
        <MainSection>
          <Title>
            <Emoji>🏥️</Emoji> 병원 정보 관리
          </Title>
          <HospitalUpdateForm />
        </MainSection>
      </PageWrapper>
    </>
  );
};

export default AdminDashboard;

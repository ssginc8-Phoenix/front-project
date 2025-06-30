import styled from 'styled-components';
import DoctorInfoForm from '~/features/doctor/components/doctorinfo/info/DoctorInfoForm';
import { Title } from '~/components/styled/MyPage.styles';
import { media } from '~/features/hospitals/components/common/breakpoints';

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
const Emoji = styled.span`
  display: none;

  /* mobile 뷰에만 보이게 */
  ${media('mobile')`
    display: inline;
  `}
`;
const MainSection = styled.div`
  flex: 1;
  min-width: 0;
`;

// ------------------- 컴포넌트 -------------------
const DoctorInfoPage = () => {
  return (
    <PageWrapper>
      {/* 메인 콘텐츠 */}
      <MainSection>
        <Title>
          <Emoji>👨‍⚕️</Emoji> 의사 정보 관리
        </Title>
        <DoctorInfoForm />
      </MainSection>
    </PageWrapper>
  );
};

export default DoctorInfoPage;

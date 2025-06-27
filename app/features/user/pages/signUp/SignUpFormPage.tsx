import styled from 'styled-components';
import { useEffect, useState } from 'react';
// import Header from '~/layout/Header'; // 주석 처리된 부분은 그대로 유지합니다.
import { getProviderId } from '~/features/user/api/UserAPI';
import SocialSignupForm from '~/features/user/components/signUp/SocialSignupForm';
import UserSignupForm from '~/features/user/components/signUp/UserSignupForm';

// --- 반응형 디자인을 위한 공통 사이즈 및 미디어 쿼리 정의 ---
const sizes = {
  laptopL: '1600px', // 대형 랩톱/데스크탑
  laptop: '1024px', // 일반 랩톱
  tablet: '768px', // 태블릿
  mobile: '480px', // 큰 모바일 (가로 모드 등)
  mobileSmall: '360px', // 가장 작은 모바일 화면 (360px)
};

const media = {
  laptopL: `@media (max-width: ${sizes.laptopL})`,
  laptop: `@media (max-width: ${sizes.laptop})`,
  tablet: `@media (max-width: ${sizes.tablet})`,
  mobile: `@media (max-width: ${sizes.mobile})`,
  mobileSmall: `@media (max-width: ${sizes.mobileSmall})`,
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2rem; /* 기본 데스크탑 상단 패딩 */
  margin-bottom: 5rem; /* 기본 데스크탑 하단 여백 */
  min-height: calc(100vh - 2rem); /* 뷰포트 높이에서 상단 패딩만큼 빼서 최소 높이 설정 */

  ${media.tablet} {
    padding-top: 1.5rem;
    margin-bottom: 4rem;
    min-height: calc(100vh - 1.5rem);
  }

  ${media.mobile} {
    padding-top: 1rem;
    margin-bottom: 3rem;
    min-height: calc(100vh - 1rem);
  }

  ${media.mobileSmall} {
    padding-top: 0.5rem; /* 모바일 360px 기준 최소 상단 패딩 */
    margin-bottom: 2rem; /* 모바일 360px 기준 최소 하단 여백 */
    min-height: calc(100vh - 0.5rem);
  }
`;

const SignUpFormPage = () => {
  const [providerId, setProviderId] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    const fetchProviderId = async () => {
      try {
        const id = await getProviderId();
        setProviderId(id);
      } catch (error) {
        console.error('providerId 조회 실패:', error);
        setProviderId(undefined);
      }
    };

    fetchProviderId();
  }, []);

  return (
    <>
      {/* <Header /> -> 주석 처리된 상태로 유지 */}
      <Wrapper>
        {providerId === undefined ? (
          <UserSignupForm />
        ) : (
          <SocialSignupForm providerId={providerId} />
        )}
      </Wrapper>
    </>
  );
};

export default SignUpFormPage;

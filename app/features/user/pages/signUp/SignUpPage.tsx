import styled from 'styled-components';
import RoleCard from '../../components/signUp/RoleCard';
import { useNavigate } from 'react-router-dom';
// Header 컴포넌트는 전역 레이아웃에서 관리될 것으로 보이므로 여기서는 제외했습니다.
// import Header from '~/layout/Header'; // 주석 처리된 부분은 그대로 유지합니다.

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

// --- Wrapper 컴포넌트: 페이지 전체 컨테이너 ---
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  /* 헤더 높이를 고려하여 상단 패딩을 설정합니다. (약 60~80px 정도로 예상) */
  padding-top: 100px; /* 기본 데스크탑 상단 패딩 */
  margin-bottom: 15rem; /* 기본 데스크탑 하단 여백 */
  width: 100%; /* 부모의 전체 너비를 사용하도록 설정 */
  box-sizing: border-box; /* 패딩이 너비에 포함되도록 설정 */
  padding-left: 1rem; /* 좌우 기본 패딩 */
  padding-right: 1rem; /* 좌우 기본 패딩 */

  ${media.tablet} {
    padding-top: 80px; /* 태블릿에서는 상단 패딩을 약간 줄임 */
    margin-bottom: 10rem; /* 하단 여백 줄임 */
  }

  ${media.mobile} {
    padding-top: 60px; /* 모바일에서는 상단 패딩을 더 줄임 */
    margin-bottom: 8rem; /* 하단 여백 더 줄임 */
    padding-left: 0.8rem;
    padding-right: 0.8rem;
  }

  ${media.mobileSmall} {
    padding-top: 50px; /* 아주 작은 모바일에서는 최소 상단 패딩 */
    margin-bottom: 5rem; /* 하단 여백 최소화 */
    padding-left: 0.5rem; /* 360px 너비에 맞게 패딩 조절 */
    padding-right: 0.5rem; /* 360px 너비에 맞게 패딩 조절 */
  }
`;

const Logo = styled.img`
  /* 기존 height를 유지하거나 조정 */
  height: 40px; /* 기본 데스크탑에서 보여주고 싶은 로고의 '높이'를 설정합니다. */
  margin-bottom: 1.5rem;
  max-width: 200px; /* 로고가 너무 커지지 않도록 최대 너비를 제한합니다. */
  width: 100%; /* 부모 너비에 따라 유동적으로 조절하되, */
  height: auto; /* 비율 유지를 위해 높이를 자동으로 설정합니다. */

  /* --- 추가된 부분 --- */
  object-fit: contain; /* 이미지가 요소에 꽉 차게 조절되지만, 비율을 유지하며 잘리지 않도록 합니다. */
  object-position: center; /* 이미지가 컨테이너 내에서 가운데 정렬되도록 합니다. */
  /* ------------------- */

  ${media.tablet} {
    height: 35px;
    max-width: 180px;
    margin-bottom: 1.2rem;
  }

  ${media.mobile} {
    height: 30px;
    max-width: 150px;
    margin-bottom: 1rem;
  }

  ${media.mobileSmall} {
    height: 25px;
    max-width: 120px;
    margin-bottom: 0.8rem;
  }
`;

// --- Title 컴포넌트: 환영 메시지 ---
const Title = styled.h2`
  font-size: 1.25rem; /* 기본 데스크탑 폰트 크기 */
  margin-bottom: 2rem;
  font-weight: 500;
  text-align: center; /* 텍스트 가운데 정렬 */
  word-break: keep-all; /* 단어가 잘리지 않고 유지되도록 */
  max-width: 800px; /* 너무 넓게 퍼지지 않도록 최대 너비 설정 */
  line-height: 1.4; /* 줄 간격 조정 */

  ${media.tablet} {
    font-size: 1.1rem;
    margin-bottom: 1.8rem;
    max-width: 90%; /* 태블릿에서 최대 너비 조정 */
  }

  ${media.mobile} {
    font-size: 1rem;
    margin-bottom: 1.5rem;
    max-width: 95%; /* 모바일에서 최대 너비 조정 */
  }

  ${media.mobileSmall} {
    font-size: 0.9rem; /* 360px 너비에 맞춰 폰트 크기 줄임 */
    margin-bottom: 1.2rem;
    padding: 0 0.5rem; /* 아주 작은 화면에서는 좌우 패딩 추가 */
  }
`;

// --- CardGroup 컴포넌트: 역할 카드들을 묶는 컨테이너 ---
const CardGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem; /* 카드 사이의 간격 */
  margin-top: 1.5rem;
  width: 100%; /* 부모의 전체 너비를 사용하도록 설정 */
  flex-wrap: wrap; /* 카드들이 한 줄에 다 들어가지 않으면 다음 줄로 넘어가도록 설정 */
  max-width: 900px; /* 카드 그룹의 최대 너비 설정 (카드 3개 + 간격) */

  ${media.tablet} {
    gap: 1.5rem; /* 태블릿에서 간격 줄임 */
    max-width: 700px; /* 태블릿에서 최대 너비 줄임 */
  }

  ${media.mobile} {
    flex-direction: column; /* 모바일에서는 카드들을 세로로 쌓도록 변경 */
    gap: 1rem; /* 세로 간격 줄임 */
    align-items: center; /* 세로 정렬 시 카드들을 가운데로 */
    max-width: 300px; /* 모바일에서 카드 그룹의 최대 너비 설정 (카드 1개 너비, RoleCard 내부 조절 필요) */
  }

  ${media.mobileSmall} {
    gap: 0.8rem; /* 아주 작은 모바일에서 간격 더 줄임 */
    max-width: 260px; /* 360px 너비에 맞춰 카드 그룹 최대 너비 조정 */
  }
`;

const SignUpPage = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* <Header /> -> 주석 처리된 상태로 유지 */}
      <Wrapper>
        <Logo src="/logo.png" alt="Docto 로고" />
        <Title>함께하는 진료! DocTo는 여러분을 환영합니다</Title>

        <CardGroup>
          <RoleCard
            imageSrc="emoji_1.png"
            label="환자"
            onClick={() => navigate('/signup/form?role=' + 'PATIENT')}
          />
          <RoleCard
            imageSrc="emoji_2.png"
            label="보호자"
            onClick={() => navigate('/signup/form?role=' + 'GUARDIAN')}
          />
          <RoleCard
            imageSrc="emoji_3.png"
            label="병원 관리자"
            onClick={() => navigate('/signup/form?role=' + 'HOSPITAL_ADMIN')}
          />
        </CardGroup>
      </Wrapper>
    </>
  );
};

export default SignUpPage;

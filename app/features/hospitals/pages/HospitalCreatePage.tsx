import styled from 'styled-components';
import HospitalCreateForm from '~/features/hospitals/components/hospitalAdmin/info/HospitalCreateForm';

// --- 반응형 디자인을 위한 공통 사이즈 및 미디어 쿼리 정의 ---
const sizes = {
  laptopL: '1600px',
  laptop: '1024px',
  tablet: '768px',
  mobile: '480px',
  mobileSmall: '360px', // 가장 작은 모바일 화면 (360px)
};

const media = {
  laptopL: `@media (max-width: ${sizes.laptopL})`,
  laptop: `@media (max-width: ${sizes.laptop})`,
  tablet: `@media (max-width: ${sizes.tablet})`,
  mobile: `@media (max-width: ${sizes.mobile})`,
  mobileSmall: `@media (max-width: ${sizes.mobileSmall})`,
};

const Title = styled.h2`
  font-size: 2rem; /* 기본 데스크탑 폰트 크기 */
  font-weight: 700;
  color: #00499e;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 2rem; /* 페이지 상단 여백 추가 */
  margin-bottom: 2rem; /* 기본 데스크탑 마진 */

  ${media.tablet} {
    font-size: 1.8rem;
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
  }

  ${media.mobile} {
    font-size: 1.6rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
    padding: 0 1rem; /* 모바일에서 좌우 패딩 추가 */
    text-align: center; /* 텍스트 가운데 정렬 보장 */
  }

  ${media.mobileSmall} {
    font-size: 1.4rem; /* 모바일 360px 기준 폰트 크기 */
    margin-top: 0.8rem;
    margin-bottom: 0.8rem;
    gap: 0.3rem; /* 아이콘과 텍스트 사이 간격 줄임 */
  }
`;

const HospitalCreatePage = () => {
  return (
    <>
      <Title>🏥 병원 등록</Title>
      <HospitalCreateForm />
    </>
  );
};

export default HospitalCreatePage;

import styled from 'styled-components';
import { Outlet } from 'react-router';
import Header from '~/layout/Header';
import Footer from '~/layout/Footer';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f8f9fa; /* 전체 배경색을 약간 밝게 설정하여 컨텐츠와 구분 */
`;

const ContentWrapper = styled.main`
  flex: 1;
  padding: 2rem 1rem; /* 좌우 패딩을 조금 줄이거나, 나중에 max-width와 함께 조정 */
  max-width: 1600px; /* 최대 너비 설정: 화면이 아무리 커져도 컨텐츠가 너무 넓어지지 않게 함 */
  width: 100%;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

const MainLayout = () => {
  return (
    <LayoutContainer>
      <Header />
      <ContentWrapper>
        <Outlet />
      </ContentWrapper>
      <Footer />
    </LayoutContainer>
  );
};

export default MainLayout;

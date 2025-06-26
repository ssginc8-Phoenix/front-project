import { Outlet } from 'react-router';
import Header from '~/layout/Header';
import Footer from '~/layout/Footer';
import styled from 'styled-components';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const ContentWrapper = styled.main`
  flex: 1;
  padding: 1rem 0rem; /* 좌우 패딩을 조금 줄이거나, 나중에 max-width와 함께 조정 */
  max-width: none; /* 최대 너비 설정: 화면이 아무리 커져도 컨텐츠가 너무 넓어지지 않게 함 */
  width: 99%;
  margin: 0;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

const MapLayout = () => {
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

export default MapLayout;

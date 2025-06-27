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
  padding: 1rem 0rem;
  max-width: none;
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

// Footer를 감싸고 모바일에서는 숨기기 위한 Wrapper
const FooterWrapper = styled.div`
  /* 기본적으로 보여주기 */
  display: block;

  /* 모바일 이하 화면에서는 숨김 */
  @media (max-width: 768px) {
    display: none;
  }
`;

const MapLayout = () => {
  return (
    <LayoutContainer>
      <Header />
      <ContentWrapper>
        <Outlet />
      </ContentWrapper>

      {/* Footer를 Wrapper로 감싸서 모바일에서 숨김 처리 */}
      <FooterWrapper>
        <Footer />
      </FooterWrapper>
    </LayoutContainer>
  );
};

export default MapLayout;

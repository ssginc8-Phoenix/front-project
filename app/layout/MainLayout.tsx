import styled from 'styled-components';
import { Outlet } from 'react-router';
import Header from '~/layout/Header';
import Footer from '~/layout/Footer';
import GlobalStyle from '~/components/styled/GlobalStyle';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  @media (max-width: 480px) {
    margin: 0;
    padding: 0;
  }
`;

const ContentWrapper = styled.main`
  flex: 1;
  padding: 2rem 1rem;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (max-width: 480px) {
    margin: 0;
    //padding: 1.5rem 0.5rem;
    padding: 0;
  }
`;

const MainLayout = () => {
  return (
    <>
      <GlobalStyle />
      <LayoutContainer>
        <Header />
        <ContentWrapper>
          <Outlet />
        </ContentWrapper>
        <Footer />
      </LayoutContainer>
    </>
  );
};

export default MainLayout;

import styled from 'styled-components';
import { Outlet } from 'react-router';
import Header from '~/layout/Header';
import MyPageFooter from '~/layout/MyPageFooter';
import Sidebar from '~/common/Sidebar';
import GlobalStyle from '~/components/styled/GlobalStyle';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContentWrapper = styled.div`
  flex: 1;
  display: flex;
  overflow-y: auto;
  padding: 2rem 1rem;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  gap: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

const BackGroundColor = styled.div`
  background-color: #f0f4f8;
  border-radius: 1rem;
  display: flex;
  flex: 1;
`;

const SidebarContainer = styled.div`
  display: flex;

  @media (max-width: 768px) {
    display: none;
  }
`;

const ContentArea = styled.main`
  flex-grow: 1;
  padding: 0;
`;

const MyPageLayout = () => {
  return (
    <>
      <GlobalStyle />
      <LayoutContainer>
        <Header />

        <MainContentWrapper>
          <BackGroundColor>
            <SidebarContainer>
              <Sidebar />
            </SidebarContainer>
            <ContentArea>
              <Outlet />
            </ContentArea>
          </BackGroundColor>
        </MainContentWrapper>

        <MyPageFooter />
      </LayoutContainer>
    </>
  );
};

export default MyPageLayout;

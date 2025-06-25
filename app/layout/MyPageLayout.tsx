import styled from 'styled-components';
import { Outlet } from 'react-router';
import Header from '~/layout/Header';
import MyPageFooter from '~/layout/MyPageFooter';
import Sidebar from '~/common/Sidebar';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContentWrapper = styled.div`
  flex: 1;
  padding: 2rem 1rem;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;

  display: flex;
  gap: 2rem;
`;

const ContentArea = styled.main`
  flex-grow: 1;
  overflow-y: auto;
`;

const MyPageLayout = () => {
  return (
    <LayoutContainer>
      <Header />

      <MainContentWrapper>
        <Sidebar />
        <ContentArea>
          <Outlet />
        </ContentArea>
      </MainContentWrapper>

      <MyPageFooter />
    </LayoutContainer>
  );
};

export default MyPageLayout;

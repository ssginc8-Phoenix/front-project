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

const BackGroundColor = styled.div`
  background-color: #f0f4f8;
  border-radius: 1rem;

  flex: 1;
  display: flex;
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
        <BackGroundColor>
          <Sidebar />
          <ContentArea>
            <Outlet />
          </ContentArea>
        </BackGroundColor>
      </MainContentWrapper>

      <MyPageFooter />
    </LayoutContainer>
  );
};

export default MyPageLayout;

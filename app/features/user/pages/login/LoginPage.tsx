import styled from 'styled-components';
import Header from '~/layout/Header';
import LoginForm from '~/features/user/components/login/LoginForm';
import SocialLoginButtons from '~/features/user/components/login/SocialLoginButtons';
import Divider from '~/features/user/components/login/Divider';
import LoginHelperLinks from '~/features/user/components/login/LoginHelperLinks';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 100px;
`;

const LoginPage = () => {
  return (
    <>
      <Header />
      <Wrapper>
        <LoginForm />
        <LoginHelperLinks />
        <Divider />
        <SocialLoginButtons />
      </Wrapper>
    </>
  );
};

export default LoginPage;

import styled from 'styled-components';
import Header from '~/layout/Header';
import LoginForm from '~/features/user/components/LoginForm';
import SocialLoginButtons from '~/features/user/components/SocialLoginButtons';
import Divider from '~/features/user/components/Divider';

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
        <Divider />
        <SocialLoginButtons />
      </Wrapper>
    </>
  );
};

export default LoginPage;

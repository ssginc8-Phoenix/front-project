import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { sendVerifyCode, confirmVerifyCode } from '~/features/user/api/UserAPI';
import PasswordResetVerifyForm from '~/features/user/components/loginHelper/PasswordResetVerifyForm';
import Header from '~/layout/Header';

const Wrapper = styled.div`
  max-width: 500px;
  margin: 80px auto;
  padding: 2rem;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const Description = styled.p`
  text-align: center;
  margin-bottom: 2rem;
  color: #555;
`;

const PasswordResetVerifyPage = () => {
  const navigate = useNavigate();

  const handleSendCode = async (email: string) => {
    await sendVerifyCode({ email });
  };

  const handleVerifyCode = async (email: string, code: string) => {
    try {
      await confirmVerifyCode({ email, code });
      return true;
    } catch {
      return false;
    }
  };

  const handleSuccess = (email: string) => {
    navigate(`/reset-password/set?email=${encodeURIComponent(email)}`);
  };

  return (
    <>
      <Header />
      <Wrapper>
        <Title>비밀번호찾기</Title>
        <Description>비밀번호를 찾기 위해 이메일을 입력해주세요.</Description>
        <PasswordResetVerifyForm
          onSendCode={handleSendCode}
          onVerifyCode={handleVerifyCode}
          onSuccess={(email) => handleSuccess(email)}
        />
      </Wrapper>
    </>
  );
};

export default PasswordResetVerifyPage;

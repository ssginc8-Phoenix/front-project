import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { sendVerifyCode, confirmVerifyCode } from '~/features/user/api/UserAPI';
import PasswordResetVerifyForm from '~/features/user/components/loginHelper/PasswordResetVerifyForm';

const Wrapper = styled.div`
  max-width: 500px;
  margin: 10rem auto;
  padding: 2rem;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    width: calc(100% - 2rem);
    margin: 5rem 1rem;
    padding: 1.5rem;
  }

  @media (max-width: 360px) {
    width: calc(100% - 2rem);
    margin: 3rem 1rem;
    padding: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1.5rem;

  @media (max-width: 360px) {
    font-size: 1.3rem;
    margin-bottom: 1rem;
  }
`;

const Description = styled.p`
  text-align: center;
  margin-bottom: 2rem;
  color: #555;

  @media (max-width: 360px) {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }
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
    } catch (error) {
      return false;
    }
  };

  const handleSuccess = (email: string) => {
    navigate(`/reset-password/set?email=${encodeURIComponent(email)}`);
  };

  return (
    <>
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

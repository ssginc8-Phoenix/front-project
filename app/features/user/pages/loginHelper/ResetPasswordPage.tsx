import styled from 'styled-components';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import PasswordResetForm from '~/features/user/components/loginHelper/PasswordResetForm';
import { resetPassword } from '~/features/user/api/UserAPI';
import CommonModal from '~/components/common/CommonModal';
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

const Notice = styled.div`
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  color: #333;
  line-height: 1.4;
`;

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get('email') || '';
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const validatePassword = (password: string): string => {
    if (password.length < 8 || password.length > 15) {
      return '비밀번호는 8~15자 사이여야 합니다.';
    }
    let typeCount = 0;
    if (/[A-Z]/.test(password)) typeCount++;
    if (/[a-z]/.test(password)) typeCount++;
    if (/[0-9]/.test(password)) typeCount++;
    if (/[!@#$%^&*()_+\-={}|\[\]:";'<>?,./`~]/.test(password)) typeCount++;

    if (typeCount < 2) {
      return '영문 대/소문자, 숫자, 특수문자 중 2가지 이상을 포함해야 합니다.';
    }

    const badSequences = [
      'abcdefghijklmnopqrstuvwxyz',
      'qwertyuiop',
      'asdfghjkl',
      'zxcvbnm',
      '0123456789',
    ];
    const lowerPassword = password.toLowerCase();
    for (const seq of badSequences) {
      for (let i = 0; i < seq.length - 3; i++) {
        if (lowerPassword.includes(seq.substring(i, i + 4))) {
          return '연속된 키보드 문자열은 사용할 수 없습니다.';
        }
      }
    }

    return '';
  };

  const handleReset = async (password: string) => {
    const validationMsg = validatePassword(password);
    if (validationMsg) {
      setValidationError(validationMsg);
      return;
    }

    setValidationError('');

    try {
      await resetPassword({ email, password });
      setIsModalOpen(true);
    } catch (err: any) {
      setError(err.response?.data?.message || '비밀번호 변경에 실패했습니다.');
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    navigate('/login');
  };

  return (
    <>
      <Header />
      <Wrapper>
        <Title>비밀번호 재설정</Title>
        <Notice>
          - 8~15자 이내로 입력해주세요.
          <br />- 영문 대/소문자, 숫자, 특수문자 2가지 이상을 포함해주세요.
        </Notice>
        <PasswordResetForm
          onSubmit={handleReset}
          error={error}
          setError={setError}
          validatePassword={validatePassword}
        />
      </Wrapper>

      {isModalOpen && (
        <CommonModal
          title="비밀번호 변경 완료"
          buttonText="로그인 페이지로 이동"
          onClose={handleModalClose}
        >
          비밀번호가 성공적으로 변경되었습니다.
        </CommonModal>
      )}
    </>
  );
};

export default ResetPasswordPage;

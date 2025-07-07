import styled from 'styled-components';
import React, { useState } from 'react';
import useLoginStore from '~/features/user/stores/LoginStore';
import ErrorModal from '~/components/common/ErrorModal';
import { useNavigate } from 'react-router';
// useSearchParams는 이 파일에서 직접 사용되지 않으므로 제거했습니다.
// import { useSearchParams } from 'react-router-dom';

// 공통 sizes 및 media 객체 정의 (이 코드는 실제 파일에는 맨 위에 위치합니다)
const sizes = {
  laptopL: '1600px',
  laptop: '1024px',
  tablet: '768px',
  mobile: '480px',
  mobileSmall: '360px',
};

const media = {
  laptopL: `@media (max-width: ${sizes.laptopL})`,
  laptop: `@media (max-width: ${sizes.laptop})`,
  tablet: `@media (max-width: ${sizes.tablet})`,
  mobile: `@media (max-width: ${sizes.mobile})`,
  mobileSmall: `@media (max-width: ${sizes.mobileSmall})`,
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 16px; /* 이 패딩은 폼 자체의 내부 패딩이 아니라, 폼을 감싸는 컨테이너의 패딩으로 보입니다. */
  width: 100%; /* 부모 컨테이너에 맞춰 너비 조정 */
  box-sizing: border-box; /* 패딩이 너비에 포함되도록 설정 */
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 60px;

  ${media.tablet} {
    font-size: 1.15rem;
    margin-bottom: 50px;
  }

  ${media.mobile} {
    font-size: 1rem;
    margin-bottom: 40px;
  }
`;

const Form = styled.form`
  width: 400px; /* 기본 데스크톱 너비 */
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;

  ${media.tablet} {
    width: 80%; /* 태블릿에서는 화면의 80% 너비 */
    max-width: 400px; /* 최대 너비는 400px 유지 */
  }

  ${media.mobile} {
    width: 90%; /* 모바일에서는 화면의 90% 너비 */
    max-width: 350px; /* 더 작은 최대 너비 */
  }

  ${media.mobileSmall} {
    width: calc(
      100% - 32px
    ); /* 좌우 16px씩 총 32px 패딩을 제외한 너비 (부모 컨테이너의 패딩 고려) */
    max-width: 320px; /* 아주 작은 모바일 최대 너비 */
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  font-size: 1rem;
  border: none;
  border-bottom: 1px solid #eee;
  box-sizing: border-box; /* 패딩이 너비에 포함되도록 설정 */

  &:focus {
    outline: none;
    background-color: #f9f9f9;
  }

  &::placeholder {
    color: #aaa;
  }

  ${media.tablet} {
    padding: 12px 14px;
    font-size: 0.95rem;
  }

  ${media.mobile} {
    padding: 10px 12px;
    font-size: 0.9rem;
  }
`;

const Button = styled.button`
  padding: 14px 16px;
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  box-sizing: border-box; /* 패딩이 너비에 포함되도록 설정 */

  &:hover {
    background-color: #005fcc;
  }

  ${media.tablet} {
    padding: 12px 14px;
    font-size: 0.95rem;
  }

  ${media.mobile} {
    padding: 10px 12px;
    font-size: 0.9rem;
  }
`;

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const { login } = useLoginStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login({ email: email, password: pw });
      navigate('/');
    } catch (err) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <Container>
      <Title>로그인</Title>
      <Form onSubmit={handleLogin}>
        <Input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="비밀번호"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />
        <Button type="submit">이메일로 로그인</Button>
      </Form>

      {error && <ErrorModal message={error} onClose={() => setError('')} />}
    </Container>
  );
};

export default LoginForm;

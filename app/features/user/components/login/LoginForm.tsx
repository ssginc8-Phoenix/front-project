import styled from 'styled-components';
import React, { useState } from 'react';
import useLoginStore from '~/features/user/stores/LoginStore';
import ErrorModal from '~/components/common/ErrorModal';
import { useNavigate } from 'react-router';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 16px;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 60px;
`;

const Form = styled.form`
  width: 400px;
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  font-size: 1rem;
  border: none;
  border-bottom: 1px solid #eee;

  &:focus {
    outline: none;
    background-color: #f9f9f9;
  }

  &::placeholder {
    color: #aaa;
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

  &:hover {
    background-color: #005fcc;
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

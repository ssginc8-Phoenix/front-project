import styled from 'styled-components';
import RoleCard from '../../components/signUp/RoleCard';
import { useNavigate } from 'react-router-dom';
import Header from '~/layout/Header';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 100px;
`;

const Logo = styled.img`
  height: 40px;
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  font-weight: 500;
`;

const CardGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1.5rem;
`;

const SignUpPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <Wrapper>
        <Logo src="/logo.png" alt="Docto 로고" />
        <Title>함께하는 진료! DocTo는 여러분을 환영합니다</Title>

        <CardGroup>
          <RoleCard
            imageSrc="emoji_1.png"
            label="환자"
            onClick={() => navigate('/signup/form?role=' + 'PATIENT')}
          />
          <RoleCard
            imageSrc="emoji_2.png"
            label="보호자"
            onClick={() => navigate('/signup/form?role=' + 'GUARDIAN')}
          />
          <RoleCard
            imageSrc="emoji_3.png"
            label="병원 관리자"
            onClick={() => navigate('/signup/form?role=' + 'HOSPITAL_ADMIN')}
          />
        </CardGroup>
      </Wrapper>
    </>
  );
};

export default SignUpPage;

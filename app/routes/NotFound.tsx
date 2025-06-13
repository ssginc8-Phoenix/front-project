import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f3f4f6;
  padding: 0 1rem;
`;

const Title = styled.h1`
  font-size: 6rem;
  font-weight: bold;
  color: #2563eb;
`;

const SubTitle = styled.h2`
  margin-top: 1rem;
  font-size: 1.75rem;
  font-weight: 600;
  color: #1f2937;
`;

const Description = styled.p`
  margin-top: 0.5rem;
  text-align: center;
  color: #6b7280;
  line-height: 1.5;
`;

const HomeLink = styled(Link)`
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #2563eb;
  color: white;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #1e40af;
  }
`;

export default function NotFound() {
  return (
    <Container>
      <Title>404</Title>
      <SubTitle>페이지를 찾을 수 없습니다</SubTitle>
      <Description>
        요청하신 페이지가 존재하지 않거나 <br /> 이동 또는 삭제되었을 수 있어요.
      </Description>
      <HomeLink to="/">홈으로 돌아가기</HomeLink>
    </Container>
  );
}

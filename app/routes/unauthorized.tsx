import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f3f4f6; // 연한 회색 배경
  padding: 0 1rem;
`;

const Title = styled.h1`
  font-size: 6rem;
  font-weight: bold;
  color: #dc3545; // 에러를 나타내는 빨간색 계열
`;

const SubTitle = styled.h2`
  margin-top: 1rem;
  font-size: 1.75rem;
  font-weight: 600;
  color: #1f2937; // 어두운 글씨색
`;

const Description = styled.p`
  margin-top: 0.5rem;
  text-align: center;
  color: #6b7280; // 회색 글씨색
  line-height: 1.5;
`;

const HomeLink = styled(Link)`
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #2563eb; // 파란색 버튼
  color: white;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #1e40af; // 호버 시 더 진한 파란색
  }
`;

export default function Unauthorized() {
  return (
    <Container>
      <Title>접근 제한</Title>
      <SubTitle>이 페이지에 대한 권한이 없습니다</SubTitle>
      <Description>
        요청하신 페이지에 접근할 수 있는 권한이 없거나 <br />
        로그인이 필요할 수 있습니다.
      </Description>
      <HomeLink to="/">홈으로 돌아가기</HomeLink>
    </Container>
  );
}

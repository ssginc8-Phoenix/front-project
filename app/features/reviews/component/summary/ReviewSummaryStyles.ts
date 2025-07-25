import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 2rem 0;
`;

export const Card = styled.div`
  width: 100%;
  max-width: 680px;
  padding: 2rem;
  background-color: #fefefe;
  border-radius: 20px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  @media (max-width: 480px) {
    padding: 1.2rem;
    max-width: 130vw;
    border-radius: 14px;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

export const Icon = styled.div`
  font-size: 1.5rem;
  margin-right: 0.8rem;
  line-height: 1;

  animation: bounce 1.2s infinite ease-in-out;

  @keyframes bounce {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.3);
    }
  }
`;

export const TitleBox = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
`;

export const SubTitle = styled.span`
  font-size: 0.9rem;
  color: #888;
  margin-top: 0.3rem;
`;

export const SummaryText = styled.p`
  font-size: 1rem;
  line-height: 1.7;
  white-space: pre-line;
  color: #333;
`;

export const Footer = styled.div`
  margin-top: 1.8rem;
  font-size: 0.875rem;
  color: #999;
`;

export const Skeleton = styled.div<{ w?: string; h?: string }>`
  background-color: #e0e0e0;
  width: ${({ w }) => w || '100%'};
  height: ${({ h }) => h || '1rem'};
  border-radius: 6px;
  margin-bottom: 0.8rem;
  animation: blink 1.5s infinite ease-in-out;

  @keyframes blink {
    0% {
      opacity: 0.4;
    }
    50% {
      opacity: 0.7;
    }
    100% {
      opacity: 0.4;
    }
  }
`;

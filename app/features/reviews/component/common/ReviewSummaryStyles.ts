import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 2rem 0;
`;

export const Card = styled.div`
  width: 100%;
  max-width: 600px;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

export const SummaryText = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  white-space: pre-line;
`;

export const Footer = styled.div`
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: #666;
`;

export const Skeleton = styled.div<{ w?: string; h?: string }>`
  background-color: #ddd;
  width: ${({ w }) => w || '100%'};
  height: ${({ h }) => h || '1rem'};
  border-radius: 8px;
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

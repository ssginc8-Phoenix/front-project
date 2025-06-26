// card.tsx
import styled from 'styled-components';

export const Card = styled.div<{ isSelected?: boolean }>`
  flex: calc(50% - 0.5rem);
  min-width: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  border-radius: 1rem;
  border: 1px solid ${({ isSelected = false }) => (isSelected ? '#3b82f6' : '#e5e7eb')};
  background-color: ${({ isSelected = false }) => (isSelected ? '#dbeafe' : '#ffffff')};
  box-sizing: border-box;

  @media (max-width: 768px) {
    flex: 1 1 100%;
  }
`;

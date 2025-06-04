import styled from 'styled-components';

export const RefreshButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: rotate(90deg);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

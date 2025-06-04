import styled from 'styled-components';

interface ButtonProps {
  disabled?: boolean;
}

export const Button = styled.button<ButtonProps>`
  padding: 0.5rem 1.5rem; /* px-6 py-2 */
  color: #ffffff;
  font-weight: 500; /* font-medium */
  border-radius: 9999px; /* rounded-full */
  background-color: ${({ disabled }) => (disabled ? '#94a3b8' : '#00499e')};
  border: none;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ disabled }) => (disabled ? '#94a3b8' : '#003974')};
  }
`;

import styled, { css } from 'styled-components';

const StyledButton = styled.button<ButtonProps>`
  font-size: 0.875rem;
  padding: 0.5rem 1.25rem;
  border-radius: 9999px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  ${({ $variant = 'primary' }) =>
    $variant === 'primary'
      ? css`
          background-color: #3b82f6;
          color: white;
          border: none;

          &:hover {
            background-color: #2563eb;
          }

          &:disabled {
            background-color: #93c5fd;
            cursor: not-allowed;
          }
        `
      : css`
          background-color: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;

          &:hover {
            background-color: #e5e7eb;
          }

          &:disabled {
            background-color: #f9fafb;
            cursor: not-allowed;
          }
        `}
`;

interface ButtonProps {
  $variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const Button = ({ $variant = 'primary', children, ...props }: ButtonProps) => {
  return (
    <StyledButton $variant={$variant} {...props}>
      {children}
    </StyledButton>
  );
};

export default Button;

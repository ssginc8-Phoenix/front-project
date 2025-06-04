import styled from 'styled-components';

export const StatusBadge = styled.span<{ status: string }>`
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 8px;

  ${({ status }) => {
    switch (status) {
      case 'REQUESTED':
        return `
          background-color: #f3f4f6;
          color: #4b5563;
        `;
      case 'CONFIRMED':
        return `
          background-color: #fef3c7;
          color: #b45309;
        `;
      case 'COMPLETED':
        return `
          background-color: #dbeafe;
          color: #1d4ed8;
        `;
      case 'CANCELED':
        return `
          background-color: #fee2e2;
          color: #b91c1c;
        `;
      default:
        return `
          background-color: #e5e7eb;
          color: #374151;
        `;
    }
  }}
`;

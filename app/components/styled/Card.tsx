import styled from 'styled-components';

export const Card = styled.div<{ isSelected: boolean }>`
  flex: calc(50% - 0.5rem);
  min-width: 280px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: 1rem;
  border: 1px solid ${({ isSelected }) => (isSelected ? '#3b82f6' : '#e5e7eb')};
  background-color: ${({ isSelected }) => (isSelected ? '#dbeafe' : '#ffffff')};
  box-sizing: border-box;

  @media (max-width: 768px) {
    flex: 1 1 100%; /* 모바일에선 1개씩 */
  }
`;

export const InfoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const Avatar = styled.img`
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
`;

export const NameText = styled.div`
  font-weight: 600;
`;

export const RrsText = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

export const SpecializationText = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
`;

export const IconBox = styled.div`
  font-size: 1.5rem;
`;

export const TextBox = styled.div``;

export const Label = styled.div`
  font-weight: 600;
`;

export const SelectButton = styled.button<{ isSelected: boolean }>`
  font-size: 0.875rem;
  padding: 0.25rem 1rem;
  border-radius: 9999px;
  background-color: ${({ isSelected }) => (isSelected ? '#3b82f6' : '#ffffff')};
  color: ${({ isSelected }) => (isSelected ? '#ffffff' : '#374151')};
  border: ${({ isSelected }) => (isSelected ? 'none' : '1px solid #d1d5db')};
  cursor: ${({ isSelected }) => (isSelected ? 'default' : 'pointer')};

  &:hover {
    background-color: ${({ isSelected }) => (isSelected ? '#3b82f6' : '#f3f4f6')};
  }
`;

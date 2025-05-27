import styled from 'styled-components';

const CardWrapper = styled.div<{ isSelected: boolean }>`
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
    flex: 1 1 100%;
  }
`;

const InfoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const IconBox = styled.div`
  font-size: 1.5rem;
`;

const TextBox = styled.div``;

const Label = styled.div`
  font-weight: 600;
`;

const SelectButton = styled.button<{ isSelected: boolean }>`
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

interface PaymentMethodCardProps {
  label: string;
  icon?: React.ReactNode;
  isSelected: boolean;
  onSelect: () => void;
}

const PaymentMethodCard = ({ label, icon, isSelected, onSelect }: PaymentMethodCardProps) => {
  return (
    <CardWrapper isSelected={isSelected}>
      <InfoWrapper>
        <IconBox>{icon}</IconBox>
        <TextBox>
          <Label>{label}</Label>
        </TextBox>
      </InfoWrapper>
      <SelectButton isSelected={isSelected} disabled={isSelected} onClick={onSelect}>
        {isSelected ? '선택됨' : '선택'}
      </SelectButton>
    </CardWrapper>
  );
};

export default PaymentMethodCard;

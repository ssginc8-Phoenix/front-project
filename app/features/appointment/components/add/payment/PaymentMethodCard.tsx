import { Card, IconBox, InfoWrapper, Label, SelectButton, TextBox } from '~/components/styled/Card';

interface PaymentMethodCardProps {
  label: string;
  icon?: React.ReactNode;
  isSelected: boolean;
  onSelect: () => void;
}

const PaymentMethodCard = ({ label, icon, isSelected, onSelect }: PaymentMethodCardProps) => {
  return (
    <Card isSelected={isSelected}>
      <InfoWrapper>
        <IconBox>{icon}</IconBox>
        <TextBox>
          <Label>{label}</Label>
        </TextBox>
      </InfoWrapper>
      <SelectButton isSelected={isSelected} disabled={isSelected} onClick={onSelect}>
        {isSelected ? '선택됨' : '선택'}
      </SelectButton>
    </Card>
  );
};

export default PaymentMethodCard;

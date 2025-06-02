import {
  Avatar,
  Card,
  InfoWrapper,
  NameText,
  RrsText,
  SelectButton,
} from '~/components/styled/Card';

interface PatientCardProps {
  name: string;
  residentRegistrationNumber: string;
  imageUrl: string;
  isSelected: boolean;
  onSelect: () => void;
}

const PatientCard = ({
  name,
  residentRegistrationNumber,
  imageUrl,
  isSelected,
  onSelect,
}: PatientCardProps) => {
  return (
    <Card isSelected={isSelected}>
      <InfoWrapper>
        <Avatar
          src={imageUrl || '/img.png'}
          alt={name}
          onError={(e) => (e.currentTarget.src = '/img.png')}
        />

        <div>
          <NameText>{name}</NameText>
          <RrsText>{residentRegistrationNumber}</RrsText>
        </div>
      </InfoWrapper>
      <SelectButton isSelected={isSelected} disabled={isSelected} onClick={onSelect}>
        {isSelected ? '선택됨' : '선택'}
      </SelectButton>
    </Card>
  );
};

export default PatientCard;

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
  const maskRrn = (rrn: string) => {
    if (!rrn || rrn.length !== 14) return rrn;

    const front = rrn.slice(0, 6);
    const backFirst = rrn[7]; // 뒷자리 첫번째 숫자

    return `${front}-${backFirst}******`;
  };

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
          <RrsText>{maskRrn(residentRegistrationNumber)}</RrsText>
        </div>
      </InfoWrapper>
      <SelectButton isSelected={isSelected} onClick={onSelect}>
        {isSelected ? '선택됨' : '선택'}
      </SelectButton>
    </Card>
  );
};

export default PatientCard;

import {
  Avatar,
  Card,
  InfoWrapper,
  NameText,
  SelectButton,
  SpecializationText,
} from '~/components/styled/Card';

interface DoctorCardProps {
  username: string;
  specialization: string;
  imageUrl: string;
  isSelected: boolean;
  onSelect: () => void;
}

const DoctorCard = ({
  username,
  specialization,
  imageUrl,
  isSelected,
  onSelect,
}: DoctorCardProps) => {
  return (
    <Card isSelected={isSelected}>
      <InfoWrapper>
        <Avatar
          src={imageUrl || '/img.png'}
          alt={username}
          onError={(e) => (e.currentTarget.src = '/img.png')}
        />

        <div>
          <NameText>{username}</NameText>
          <SpecializationText>{specialization}</SpecializationText>
        </div>
      </InfoWrapper>
      <SelectButton isSelected={isSelected} disabled={isSelected} onClick={onSelect}>
        {isSelected ? '선택됨' : '선택'}
      </SelectButton>
    </Card>
  );
};

export default DoctorCard;

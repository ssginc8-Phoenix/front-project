import styled from 'styled-components';

interface PatientCardProps {
  name: string;
  birth: string;
  imageUrl: string;
  isSelected: boolean;
  onSelect: () => void;
}

// 🔸 styled-components 정의
const CardWrapper = styled.div<{ isSelected: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: 1rem;
  border: 1px solid ${({ isSelected }) => (isSelected ? '#3b82f6' : '#e5e7eb')};
  background-color: ${({ isSelected }) => (isSelected ? '#dbeafe' : '#ffffff')};
`;

const InfoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Avatar = styled.img`
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
`;

const NameText = styled.div`
  font-weight: 600;
`;

const BirthText = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
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

const PatientCard = ({ name, birth, imageUrl, isSelected, onSelect }: PatientCardProps) => {
  return (
    <CardWrapper isSelected={isSelected}>
      <InfoWrapper>
        <Avatar
          src={imageUrl || '/img.png'}
          alt={name}
          onError={(e) => (e.currentTarget.src = '/img.png')}
        />

        <div>
          <NameText>{name}</NameText>
          <BirthText>{birth}</BirthText>
        </div>
      </InfoWrapper>
      <SelectButton isSelected={isSelected} disabled={isSelected} onClick={onSelect}>
        {isSelected ? '선택됨' : '선택'}
      </SelectButton>
    </CardWrapper>
  );
};

export default PatientCard;

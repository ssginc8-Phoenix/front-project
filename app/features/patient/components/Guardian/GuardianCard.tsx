import styled from 'styled-components';

const Card = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background-color: #fff;
  cursor: pointer; /* 📌 카드에 커서 추가 */
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); /* 살짝 hover 효과 */
  }
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Avatar = styled.div`
  width: 56px;
  height: 56px;
  background-color: #e0ebff;
  border-radius: 9999px;
`;

const Texts = styled.div`
  display: flex;
  flex-direction: column;
`;

const Name = styled.div`
  font-weight: 600;
`;

const EditIcon = styled.button`
  border: none;
  background: none;
  color: #9ca3af;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    color: #4b5563;
  }
`;

interface Props {
  name: string;
  onClick?: () => void; // 📌 카드 클릭 핸들러 추가
  onEdit?: () => void; // 📌 수정 버튼 핸들러
}

const GuardianCard = ({ name, onClick, onEdit }: Props) => {
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 📌 카드 클릭 이벤트 막기
    onEdit?.();
  };

  return (
    <Card onClick={onClick}>
      <Info>
        <Avatar />
        <Texts>
          <Name>{name}</Name>
        </Texts>
      </Info>
      <EditIcon onClick={handleEditClick}>✏️</EditIcon>
    </Card>
  );
};

export default GuardianCard;

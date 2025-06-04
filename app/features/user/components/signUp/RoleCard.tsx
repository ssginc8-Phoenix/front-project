import styled from 'styled-components';

const Card = styled.div`
  width: 160px;
  padding: 1rem;
  text-align: center;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  img {
    width: 100px;
    height: 100px;
    margin-bottom: 0.75rem;
  }

  p {
    font-size: 0.95rem;
    font-weight: 500;
  }
`;

interface RoleCardProps {
  imageSrc: string;
  label: string;
  onClick: () => void;
}

const RoleCard = ({ imageSrc, label, onClick }: RoleCardProps) => (
  <Card onClick={onClick}>
    <img src={imageSrc} alt={label} />
    <p>{label}</p>
  </Card>
);

export default RoleCard;

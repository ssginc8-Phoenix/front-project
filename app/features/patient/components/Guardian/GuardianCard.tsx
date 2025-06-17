import styled from 'styled-components';
import React from 'react';

const Card = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background-color: #fff;
  cursor: pointer;
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
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

const DeleteBtn = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: transparent;
  border: none;
  font-size: 1.2rem;
  color: #999;
  cursor: pointer;
  &:hover {
    color: #ff4646;
  }
`;

interface Props {
  name: string;
  onClick?: () => void;
  onDelete: () => void;
}

const GuardianCard: React.FC<Props> = ({ name, onClick, onDelete }) => (
  <Card onClick={onClick}>
    <Info>
      <Avatar />
      <Texts>
        <Name>{name}</Name>
      </Texts>
    </Info>
    <DeleteBtn
      onClick={(e) => {
        e.stopPropagation();
        onDelete();
      }}
      aria-label="삭제"
    >
      ×
    </DeleteBtn>
  </Card>
);

export default GuardianCard;

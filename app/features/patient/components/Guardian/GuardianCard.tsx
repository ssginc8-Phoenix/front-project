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

// AvatarWrapper: 이미지가 있는 경우 <img>를, 없는 경우 fallback 원 형태
const AvatarWrapper = styled.div<{ size?: number }>`
  flex-shrink: 0;
  width: ${({ size }) => size ?? 56}px;
  height: ${({ size }) => size ?? 56}px;
  border-radius: 9999px;
  overflow: hidden;
  background-color: #e0ebff;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
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
  profileImageUrl?: string;
  onClick?: () => void;
  onDelete: () => void;
}

const GuardianCard: React.FC<Props> = ({ name, profileImageUrl, onClick, onDelete }) => (
  <Card onClick={onClick}>
    <Info>
      <AvatarWrapper>
        {profileImageUrl ? <img src={profileImageUrl} alt={`${name} 프로필`} /> : null}
      </AvatarWrapper>
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

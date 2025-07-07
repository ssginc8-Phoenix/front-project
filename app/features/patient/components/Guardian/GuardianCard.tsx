import styled from 'styled-components';
import React, { ReactNode } from 'react';

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

// JSX 형태로 넘겨줄 때 사용할, 기본 프로필 이미지 styled-component
export const ProfileImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
`;

interface Props {
  name: string;
  /**
   * <ProfileImage /> JSX 혹은 null 을 직접 넘겨주세요.
   */
  avatar?: ReactNode;
  onClick?: () => void;
  onDelete: () => void;
}

const GuardianCard: React.FC<Props> = ({ name, avatar, onClick, onDelete }) => (
  <Card onClick={onClick}>
    <Info>
      <AvatarWrapper size={56}>{avatar /* 넘어온 JSX(또는 null) 를 그대로 렌더링 */}</AvatarWrapper>
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

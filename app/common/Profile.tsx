import { useEffect, useState } from 'react';
import styled from 'styled-components';

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const UserImage = styled.img`
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  object-fit: cover;
`;

const UserNameToggle = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const Profile = () => {
  const [imageUrl, setImageUrl] = useState('/img.png');
  const [name, setName] = useState('홍길동');

  useEffect(() => {
    /* 토큰 꺼내서 userId 꺼낸 다음, 이미지 불러오는 기능 추가
     * setImageUrl(`이미지 부르는 방법`);
     */
  }, []);

  return (
    <UserProfile>
      <UserImage src={imageUrl} alt="userImg" />
      <UserNameToggle>{name} ▾</UserNameToggle>
    </UserProfile>
  );
};

export default Profile;

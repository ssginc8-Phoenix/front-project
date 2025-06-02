import styled from 'styled-components';
import type { ProfileProps } from '~/types/user';

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

const Profile = ({ name, imageUrl }: ProfileProps) => {
  return (
    <UserProfile>
      <UserImage src={imageUrl} alt="userImg" />
      <UserNameToggle>{name} ▾</UserNameToggle>
    </UserProfile>
  );
};

export default Profile;

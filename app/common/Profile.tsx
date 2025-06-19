import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import type { ProfileProps } from '~/types/user';
import useLoginStore from '~/features/user/stores/LoginStore';
import { useNavigate } from 'react-router';

const UserProfile = styled.div`
  position: relative;
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
  font-weight: 500;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 3rem;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 120px;
  z-index: 100;
  padding: 0.5rem 0;
`;

const DropdownItem = styled.button`
  width: 100%;
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  text-align: left;
  font-size: 0.95rem;
  cursor: pointer;
  color: #333;

  &:hover {
    background-color: #f1f1f1;
  }
`;

const Profile = ({ name, imageUrl }: ProfileProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { logout } = useLoginStore();
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleMyPage = () => {
    navigate('/mypage');
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <UserProfile ref={dropdownRef}>
      <UserImage src={imageUrl} alt="userImg" />
      <UserNameToggle onClick={handleToggle}>{name} ▾</UserNameToggle>

      {isOpen && (
        <Dropdown>
          <DropdownItem onClick={handleMyPage}>마이페이지</DropdownItem>
          <DropdownItem onClick={handleLogout}>로그아웃</DropdownItem>
        </Dropdown>
      )}
    </UserProfile>
  );
};

export default Profile;

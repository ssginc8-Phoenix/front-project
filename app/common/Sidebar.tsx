// src/common/Sidebar.tsx

import React from 'react';
import styled from 'styled-components';
import useLoginStore from '~/features/user/stores/LoginStore';
import { useNavigate } from 'react-router';
import SidebarMenu from '~/common/SidebarMenu';
import {
  doctorSidebarItems,
  guardianSidebarItems,
  hospitalSidebarItems,
  patientSidebarItems,
} from '~/constants/sidebarItems';

const SidebarBox = styled.div`
  width: 260px;
  background: white;
  border-right: 1px solid #e0e0e0;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 0 20px 20px 0;
  box-shadow: 4px 0 12px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100%;
    height: 100%;
    border-right: none;
    border-radius: 0;
    box-shadow: none;
    padding: 1.5rem 1rem;
    box-sizing: border-box;
  }
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  width: 100%;
  overflow-x: hidden;
  max-width: 100%;
`;

const ProfileImage = styled.img<{ $hasUser: boolean }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 8px;
  border: 4px solid ${(p) => (p.$hasUser ? '#007bff' : '#e0e0e0')};
  max-width: 100%;
`;

const ProfileName = styled.div`
  font-weight: bold;
  font-size: 1.3rem;
  color: #333;
  text-align: center;
  word-break: break-word;
  max-width: 100%;
`;

const ProfileRole = styled.div`
  color: #777;
  font-size: 1rem;
  text-align: center;
  word-break: break-word;
  max-width: 100%;
`;

const AuthButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding-bottom: 2rem;
  border-bottom: 1px solid #dee2e6;
  margin-bottom: 1.5rem;
  flex-shrink: 0;
  overflow-x: hidden;
  max-width: 100%;

  @media (min-width: 768px) {
    display: none;
  }
`;

const AuthButton = styled.button`
  all: unset;
  cursor: pointer;
  width: 70%;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
  transition: all 0.2s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &.login {
    background-color: #007bff;
    color: #fff;
    border: 1px solid #007bff;
    &:hover {
      background-color: #0069d9;
      border-color: #0062cc;
    }
    &:active {
      background-color: #005cbf;
      border-color: #0056b3;
    }
  }

  &.signup {
    background-color: #fff;
    color: #007bff;
    border: 1px solid #007bff;
    &:hover {
      background-color: #eaf5ff;
    }
    &:active {
      background-color: #d8edff;
    }
  }
`;

/**
 * onClose: 사이드바 닫기
 * onCsClick: 닫기 애니 후 채팅 모달 열기
 */
interface SidebarProps {
  onClose?: () => void;
  onCsClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose, onCsClick }) => {
  const { user } = useLoginStore();
  const navigate = useNavigate();

  const handleSidebarChange = (key: string) => {
    if (key === 'cs') {
      // 1) 사이드바 닫기 트리거
      onClose?.();
      // 2) 모달 열기 요청
      onCsClick?.();
      return;
    }
    const routes: Record<string, string> = {
      guardian: '/mypage/guardian',
      patient: '/mypage/patient',
      appointment: '/mypage/appointments',
      appointmentDashboard: '/appointments',
      calendar: '/mypage/calendar',
      review: '/mypage/review',
      qna: '/mypage/qna',
      info: '/mypage/info',
      schedule: '/mypage/schedule',
      chart: '/mypage/chart',
    };
    const path = routes[key];
    if (path) navigate(path);
    else console.warn(`키 "${key}" 라우트 없음`);
  };

  const sidebarItems = (() => {
    switch (user?.role) {
      case 'GUARDIAN':
        return guardianSidebarItems;
      case 'DOCTOR':
        return doctorSidebarItems;
      case 'HOSPITAL_ADMIN':
        return hospitalSidebarItems;
      default:
        return patientSidebarItems;
    }
  })();

  const handleLogin = () => navigate('/login');
  const handleSignup = () => navigate('/signup');

  return (
    <SidebarBox>
      <ProfileSection>
        <ProfileImage
          src={user?.profileImageUrl ?? 'https://docto-project.../user.png'}
          alt="프로필"
          $hasUser={!!user}
        />
        {user ? (
          <>
            <ProfileName>{user.name}님</ProfileName>
            <ProfileRole>
              {{
                GUARDIAN: '보호자',
                DOCTOR: '의사',
                HOSPITAL_ADMIN: '병원 관리자',
                PATIENT: '환자',
                SYSTEM_ADMIN: '시스템 관리자',
              }[user.role] || '게스트'}
            </ProfileRole>
          </>
        ) : (
          <AuthButtonGroup>
            <ProfileName>로그인 해주세요</ProfileName>
            <AuthButton className="login" onClick={handleLogin}>
              로그인
            </AuthButton>
            <AuthButton className="signup" onClick={handleSignup}>
              회원가입
            </AuthButton>
          </AuthButtonGroup>
        )}
      </ProfileSection>

      {user && <SidebarMenu items={sidebarItems} onChange={handleSidebarChange} />}
    </SidebarBox>
  );
};

export default Sidebar;

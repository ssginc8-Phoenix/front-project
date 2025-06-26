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

const sizes = {
  tablet: '768px',
};

const media = {
  tablet: `@media (max-width: ${sizes.tablet})`,
  desktop: `@media (min-width: ${sizes.tablet})`,
};

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
  border: 4px solid ${(props) => (props.$hasUser ? '#007bff' : '#e0e0e0')};
  max-width: 100%;
  height: auto;
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

  /* Hide on desktop, show on mobile/tablet */
  ${media.desktop} {
    display: none;
  }
`;

const AuthButton = styled.button`
  all: unset;
  cursor: pointer;
  width: 90%;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
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
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
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
      border-color: #007bff;
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }
    &:active {
      background-color: #d8edff;
      border-color: #0062cc;
    }
  }
`;

const Sidebar = () => {
  const { user } = useLoginStore();
  const navigate = useNavigate();

  const getRoleInKorean = (role: string | undefined) => {
    switch (role) {
      case 'GUARDIAN':
        return '보호자';
      case 'DOCTOR':
        return '의사';
      case 'HOSPITAL_ADMIN':
        return '병원 관리자';
      case 'PATIENT':
        return '환자';
      default:
        return '게스트';
    }
  };

  const getSidebarItemsByRole = (role: string | undefined) => {
    switch (role) {
      case 'GUARDIAN':
        return guardianSidebarItems;
      case 'DOCTOR':
        return doctorSidebarItems;
      case 'HOSPITAL_ADMIN':
        return hospitalSidebarItems;
      case 'PATIENT':
      default:
        return patientSidebarItems;
    }
  };

  const sidebarItems = getSidebarItemsByRole(user?.role);

  const itemRoutes: { [key: string]: string } = {
    guardian: '/mypage/guardian',
    patient: '/mypage/patient',
    appointment: '/mypage/appointments',
    calendar: '/mypage/calendar',
    review: '/mypage/review',
    qna: '/mypage/qna',
    info: '/mypage/info',
    schedule: '/mypage/schedule',
    chart: '/mypage/chart',
    cs: '/mypage/cs',
  };

  const handleSidebarChange = (key: string) => {
    const path = itemRoutes[key];
    if (path) {
      navigate(path);
    } else {
      console.warn(`사이드바 아이템 키 "${key}"에 대한 라우트가 정의되지 않았습니다.`);
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  return (
    <SidebarBox>
      <ProfileSection>
        <ProfileImage
          src={
            user?.profileImageUrl ??
            'https://docto-project.s3.ap-southeast-2.amazonaws.com/user/user.png'
          }
          alt="프로필 사진"
          $hasUser={!!user}
        />
        {user ? (
          <>
            <ProfileName>{user.name}님</ProfileName>
            <ProfileRole>{getRoleInKorean(user.role)}</ProfileRole>
          </>
        ) : (
          <AuthButtonGroup>
            <ProfileName>로그인 해주세요</ProfileName>
            <AuthButton className="login" onClick={handleLoginClick}>
              로그인
            </AuthButton>
            <AuthButton className="signup" onClick={handleSignupClick}>
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

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

// ---
// Media Queries (기준점 정의)
// ---
const sizes = {
  tablet: '768px', // 모바일/태블릿과 데스크톱을 구분하는 기준점
};

const media = {
  tablet: `@media (max-width: ${sizes.tablet})`, // 모바일/태블릿용 미디어 쿼리
};

// ---
// Styled Components (이 부분은 이전과 동일하게 유지됩니다)
// ---

const SidebarBox = styled.div`
  width: 100%; /* 변경: 부모 컨테이너의 너비에 맞춥니다. */
  height: 100%; /* 변경: 부모 컨테이너의 높이에 맞춥니다. */
  background: white;
  border-right: 1px solid #e0e0e0; /* 데스크톱 스타일 유지 */
  padding: 2rem 1rem; /* rem 단위로 변환하는 것을 고려해볼 수 있습니다. (예: 2rem 1rem) */
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 0 20px 20px 0; /* 데스크톱 스타일 유지 */
  box-shadow: 4px 0 12px rgba(0, 0, 0, 0.05); /* 데스크톱 스타일 유지 */
  flex-shrink: 0;

  /* 데스크톱 환경에서 사이드바가 뷰포트에 고정되어 스크롤 가능하도록 설정 */
  position: sticky; /* 데스크톱에서 스티키 포지션 유지 */
  top: 0;
  overflow-y: auto; /* 내용이 길어지면 스크롤 가능 */
  overflow-x: hidden; /* 가로 스크롤 방지 */
  -webkit-overflow-scrolling: touch; /* iOS에서 부드러운 스크롤 */
  box-sizing: border-box; /* 패딩이 너비에 포함되도록 */

  ${media.tablet} {
    /* 모바일 환경에서 적용될 스타일 */
    width: 100%; /* 변경: MobileSidebarMenu의 SidebarContainer 너비에 꽉 맞춥니다. */
    height: 100%; /* 변경: MobileSidebarMenu의 SidebarContainer 높이에 꽉 맞춥니다. */
    border-right: 0; /* 모바일에서는 테두리 제거 */
    border-radius: 0; /* 모바일에서는 둥근 모서리 제거 */
    box-shadow: none; /* 모바일에서는 그림자 제거 */
    position: relative; /* 모바일에서 고정 해제 */
    top: auto;
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
`;

const AuthButton = styled.button`
  all: unset;
  cursor: pointer;
  width: 60%;
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

const LogoutButton = styled.button`
  all: unset;
  cursor: pointer;
  width: 60%;
  padding: 1rem 1.5rem;
  margin-top: auto;
  background-color: #fcebeb;
  color: #dc3545;
  border: 1px solid #dc3545;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  flex-shrink: 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:hover {
    background-color: #dc3545;
    color: #fff;
    border-color: #dc3545;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    background-color: #c82333;
    border-color: #bd2130;
  }

  @media (min-width: ${sizes.tablet}) {
    display: none;
  }
`;

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { user, logout } = useLoginStore();
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

  // user 정보가 있을 때만 사이드바 아이템을 가져옵니다.
  const sidebarItems = user ? getSidebarItemsByRole(user.role) : [];

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
      onClose?.();
    } else {
      console.warn(`사이드바 아이템 키 "${key}"에 대한 라우트가 정의되지 않았습니다.`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    onClose?.();
  };

  const handleLoginClick = () => {
    navigate('/login');
    onClose?.();
  };

  const handleSignupClick = () => {
    navigate('/signup');
    onClose?.();
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

      {/* 변경: user 정보가 있을 때만 SidebarMenu를 렌더링합니다. */}
      {user && <SidebarMenu items={sidebarItems} onChange={handleSidebarChange} />}

      {user && <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>}
    </SidebarBox>
  );
};

export default Sidebar;

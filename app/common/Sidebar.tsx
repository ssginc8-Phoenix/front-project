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
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

const ProfileImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 8px;
`;

const ProfileName = styled.div`
  font-weight: bold;
  font-size: 1.3rem;
  color: #333;
`;

const ProfileRole = styled.div`
  color: #777;
  font-size: 1rem;
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

  // 사용자의 역할에 따라 사이드바 아이템 목록 결정
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

  // 사용자의 역할에 따라 다른 사이드바 아이템 목록을 선택
  const sidebarItems = getSidebarItemsByRole(user?.role);

  // 각 사이드바 아이템 키에 대한 라우트 정의
  const itemRoutes: { [key: string]: string } = {
    guardian: '/mypage/guardian',
    patient: '/mypage/patient',
    appointment: '/mypage/appointments', // 예약 조회 및 관리 페이지
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

  return (
    <SidebarBox>
      <ProfileSection>
        <ProfileImage
          src={
            user?.profileImageUrl ??
            'https://docto-project.s3.ap-southeast-2.amazonaws.com/user/user.png'
          }
          alt="프로필 사진"
        />
        <ProfileName>{user?.name ?? '이름 로딩 중'}님</ProfileName>
        <ProfileRole>{getRoleInKorean(user?.role)}</ProfileRole>
      </ProfileSection>

      <SidebarMenu items={sidebarItems} onChange={handleSidebarChange} />
    </SidebarBox>
  );
};

export default Sidebar;

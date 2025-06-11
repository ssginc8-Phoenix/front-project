import styled from 'styled-components';
import { useNavigate } from 'react-router';
import HospitalSidebarMenu from '~/features/hospitals/components/hospitalAdmin/HospitalSidebarMenu';
import { doctorSidebarItems } from '~/features/doctor/components/constants/doctorSidebarItems';
import DoctorInfoForm from '~/features/doctor/components/doctorinfo/info/DoctorInfoForm';

// ------------------- 스타일 정의 -------------------
const PageWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  display: flex;
  gap: 48px;
  background-color: #f8f9fa;
  min-height: 100vh;
`;

const MainSection = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.h2`
  font-size: 2.2rem;
  font-weight: 700;
  color: #00499e;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

const SidebarBox = styled.div`
  width: 200px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 32px 0 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: flex-start;
`;

// ------------------- 컴포넌트 -------------------
const DoctorInfoPage = () => {
  const navigate = useNavigate();

  const handleSidebarChange = (key: string) => {
    const targetPath = `/doctors/${key}`;
    if (window.location.pathname === targetPath) {
      navigate(0); // 새로고침
    } else {
      navigate(targetPath);
    }
  };

  return (
    <PageWrapper>
      {/* 사이드바 */}
      <SidebarBox>
        <HospitalSidebarMenu
          items={doctorSidebarItems}
          activeKey="doctor"
          onChange={handleSidebarChange}
        />
      </SidebarBox>

      {/* 메인 콘텐츠 */}
      <MainSection>
        <Title>👨‍⚕️ 의사 정보 관리</Title>
        <DoctorInfoForm />
      </MainSection>
    </PageWrapper>
  );
};

export default DoctorInfoPage;

import styled from 'styled-components';
import { useNavigate } from 'react-router';
import { doctorSidebarItems } from '~/features/doctor/components/constants/doctorSidebarItems';
import DoctorInfoForm from '~/features/doctor/components/doctorinfo/info/DoctorInfoForm';
import { hospitalSidebarItems } from '~/features/hospitals/components/constants/hospitalSidebarItems';
import HospitalSidebarMenu from '~/features/hospitals/components/hospitalAdmin/HospitalSidebarMenu';
import DoctorSidebarMenu from '~/features/doctor/ui/DoctorSidebarMenu';
import useLoginStore from '~/features/user/stores/LoginStore';
import { getMyDoctorInfo } from '~/features/doctor/api/doctorAPI';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// ------------------- 스타일 정의 -------------------
const PageWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  display: flex;
  gap: 48px;
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
const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
`;

const ProfileEmoji = styled.div`
  font-size: 4rem;
  margin-bottom: 8px;
`;

const ProfileName = styled.div`
  font-weight: bold;
  font-size: 1.3rem;
`;
const ProfileRole = styled.div`
  color: #777;
  font-size: 1rem;
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
  const { user } = useLoginStore();
  const { data } = useQuery({
    queryKey: ['doctorInfo'],
    queryFn: getMyDoctorInfo,
  });
  const handleSidebarChange = (key: string) => {
    const targetPath = `/doctor/${key}`;
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
        <ProfileSection>
          <ProfileEmoji>
            {data?.imageUrl ? (
              <img
                src={data.imageUrl}
                alt="의사 프로필"
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              '👨‍⚕️' // 기본 이모지
            )}
          </ProfileEmoji>

          <ProfileName>{user?.name ?? '이름 로딩 중'} 님</ProfileName>
          <ProfileRole>의사</ProfileRole>
        </ProfileSection>
        <DoctorSidebarMenu
          items={doctorSidebarItems}
          activeKey="info"
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

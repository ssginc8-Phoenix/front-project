import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { PasswordModal } from '~/features/patient/components/PasswordModal';
import useLoginStore from '~/features/user/stores/LoginStore';

// --- 대시보드 아이템
const dashboardItems = [
  { label: '보호자 관리', icon: '🧑‍🤝‍🧑', key: 'guardian' },
  { label: '캘린더 관리', icon: '🗓️', key: 'calendar' },
  { label: '정보 관리', icon: '⚙️', key: 'info' },
  { label: 'Q&A', icon: '💬', key: 'qna' },
  { label: '리뷰 관리', icon: '✏️', key: 'review' },
  { label: '예약 관리', icon: '📋', key: 'reservation' },
];

// --- 스타일 정의
const Main = styled.main`
  max-width: 900px;
  margin: 0 auto;
  padding: 80px 0 60px 0;
  background: #fff;
  min-height: 90vh;
`;

const ProfileRow = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-bottom: 42px;
`;

const ProfileEmoji = styled.span`
  font-size: 5rem;
  display: flex;
  align-items: center;
  background: #f8f8fa;
  border-radius: 50%;
  padding: 18px;
  box-shadow: 0 4px 20px 0 rgba(34, 97, 187, 0.1);
`;

const ProfileInfoCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const ProfileName = styled.div`
  font-size: 2.1rem;
  font-weight: bold;
  margin-bottom: 8px;
  color: #222;
`;

const Divider = styled.hr`
  border: none;
  border-top: 2px solid #ededed;
  margin: 0 0 50px 0;
`;

const DashboardSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60px;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 38px 48px;
  width: 100%;
  max-width: 660px;
`;

const DashboardButton = styled.button`
  background: #fafbfc;
  border: none;
  border-radius: 30px;
  padding: 38px 0 24px 0;
  box-shadow: 0 4px 20px 0 rgba(34, 97, 187, 0.09);
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.13rem;
  font-weight: 500;
  color: #222;
  cursor: pointer;
  transition:
    background 0.16s,
    box-shadow 0.16s;
  outline: none;
  min-width: 155px;

  &:hover {
    background: #f1f6ff;
    box-shadow: 0 4px 28px 0 rgba(34, 97, 187, 0.18);
  }

  & span {
    font-size: 2.7rem;
    margin-bottom: 12px;
  }
`;

// --- 컴포넌트
export const PatientMyPage = () => {
  const navigate = useNavigate();
  const { user, fetchMyInfo } = useLoginStore();
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    fetchMyInfo();
  }, [fetchMyInfo]);

  const handleDashboardClick = (key: string) => {
    if (key === 'info') {
      setShowPasswordModal(true); // 🔥 비밀번호 확인 모달 열기
    } else {
      navigate(`/patients/${key}`);
    }
  };

  const handlePasswordSuccess = () => {
    setShowPasswordModal(false); // 🔥 모달 닫고
    navigate('/patients/info'); // 🔥 정보관리 페이지로 이동
  };

  return (
    <>
      <Main>
        <ProfileRow>
          <ProfileEmoji role="img" aria-label="profile">
            👵
          </ProfileEmoji>
          <ProfileInfoCol>
            <ProfileName>{user?.name ?? '이름 로딩 중'} 님</ProfileName>
          </ProfileInfoCol>
        </ProfileRow>

        <Divider />

        <DashboardSection>
          <DashboardGrid>
            {dashboardItems.map((item) => (
              <DashboardButton key={item.key} onClick={() => handleDashboardClick(item.key)}>
                <span>{item.icon}</span>
                {item.label}
              </DashboardButton>
            ))}
          </DashboardGrid>
        </DashboardSection>

        {/* 비밀번호 확인 모달 */}
        <PasswordModal
          open={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
          onSuccess={handlePasswordSuccess}
        />
      </Main>
    </>
  );
};

export default PatientMyPage;

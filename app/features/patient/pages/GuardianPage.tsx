import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import GuardianCard from '~/features/patient/components/Guardian/GuardianCard';
import SidebarMenu from '~/features/patient/components/SidebarMenu';
import { patientSidebarItems } from '~/features/patient/constants/sidebarItems';
import { getGuardians, type Guardian, inviteGuardian } from '~/features/patient/api/guardianAPI';
import { getUserInfo } from '~/features/patient/api/userAPI';
import useLoginStore from '~/features/user/stores/LoginStore';
import Header from '~/layout/Header';
import ReusableModal from '~/features/patient/components/ReusableModal';
import { getPatientInfo } from '~/features/patient/api/patientAPI';
import type { User } from '~/types/user';

// --- 스타일 정의 ---
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

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const AddCard = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  border-radius: 12px;
  border: 2px dashed #00499e;
  font-size: 3rem;
  color: #00499e;
  background: #fff;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  &:hover {
    background: #e9f0ff;
  }
`;

const SidebarBox = styled.div`
  width: 280px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 32px 0 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
`;

const ProfileEmoji = styled.div`
  font-size: 5rem;
  margin-bottom: 8px;
`;

const ProfileName = styled.div`
  font-weight: 700;
  font-size: 1.5rem;
  color: #333;
`;

const ProfileRole = styled.div`
  color: #666;
  font-size: 1rem;
`;

const ProfileImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 8px;
`;

// --- 메인 컴포넌트 ---
const GuardianPage = () => {
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [userinfo, setUserinfo] = useState<User | null>(null);
  const [patientInfo, setPatientInfo] = useState<{ patientId: number; name: string } | null>(null);
  const [selectedGuardian, setSelectedGuardian] = useState<string | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showGuardianModal, setShowGuardianModal] = useState(false);
  const [newGuardianEmail, setNewGuardianEmail] = useState('');
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [showInviteCodeModal, setShowInviteCodeModal] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false); // ✅ 초대 완료 모달

  const { user, fetchMyInfo } = useLoginStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchMyInfo();
        const userRes = await getUserInfo();
        setUserinfo(userRes);

        const patientRes = await getPatientInfo();
        setPatientInfo({
          patientId: patientRes.patientId,
          name: userRes.name,
        });

        const guardianData = await getGuardians(patientRes.patientId);
        setGuardians(guardianData);
      } catch (error) {
        console.error('유저/환자 정보 가져오기 실패', error);
      }
    };

    fetchData();
  }, []);

  const handleSidebarChange = (key: string) => {
    navigate(`/patients/${key}`);
  };

  const openGuardianModal = () => {
    setShowGuardianModal(true);
  };

  const closeGuardianModal = () => {
    setShowGuardianModal(false);
    setNewGuardianEmail('');
  };

  const handleInviteGuardian = async () => {
    if (!newGuardianEmail) return;
    try {
      if (!patientInfo?.patientId) return;
      const res = await inviteGuardian(patientInfo.patientId, newGuardianEmail);
      setInviteCode(res.inviteCode);

      closeGuardianModal();
      setShowSuccessModal(true); // ✅ 초대 완료 모달 먼저 열기

      const guardianData = await getGuardians(patientInfo.patientId);
      setGuardians(guardianData);
    } catch (error) {
      console.error('보호자 초대 실패', error);
      alert('보호자 초대에 실패했습니다.');
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setShowInviteCodeModal(true); // ✅ 성공 모달 닫고 초대코드 모달 열기
  };

  return (
    <>
      <PageWrapper>
        <SidebarBox>
          <ProfileSection>
            {userinfo?.profileImageUrl ? (
              <ProfileImage src={userinfo.profileImageUrl} alt="프로필 이미지" />
            ) : (
              <ProfileImage
                src="https://docto-project.s3.ap-southeast-2.amazonaws.com/user/user.png"
                alt="기본 프로필"
              />
            )}
            <ProfileName>{user?.name ?? '이름 로딩 중'} 님</ProfileName>
            <ProfileRole>환자</ProfileRole>
          </ProfileSection>

          <SidebarMenu
            items={patientSidebarItems}
            activeKey="guardian"
            onChange={handleSidebarChange}
          />
        </SidebarBox>

        <MainSection>
          <Title>🧑‍🤝‍🧑 보호자 관리</Title>
          <ListWrapper>
            {guardians.map((guardian) => (
              <GuardianCard
                key={guardian.name}
                name={guardian.name}
                onEdit={() => console.log(`${guardian.name} 수정 (추후)`)}
                onClick={() => console.log(`${guardian.name} 클릭 (추후)`)}
              />
            ))}
            <AddCard onClick={openGuardianModal}>＋</AddCard>
          </ListWrapper>
        </MainSection>

        {/* 보호자 초대 모달 */}
        <ReusableModal open={showGuardianModal} onClose={closeGuardianModal}>
          <div style={{ padding: 20 }}>
            <h2 style={{ marginBottom: 20 }}>보호자 초대</h2>
            <input
              type="email"
              value={newGuardianEmail}
              onChange={(e) => setNewGuardianEmail(e.target.value)}
              placeholder="보호자 이메일 입력"
              style={{
                width: '100%',
                padding: 12,
                marginBottom: 20,
                fontSize: '1.05rem',
                borderRadius: 8,
                border: '1.5px solid #ddd',
              }}
            />
            <button
              onClick={handleInviteGuardian}
              style={{
                width: '100%',
                padding: 12,
                backgroundColor: '#00499e',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: '1.05rem',
                cursor: 'pointer',
              }}
            >
              초대하기
            </button>
          </div>
        </ReusableModal>

        {/* ✅ 초대 성공 모달 */}
        <ReusableModal open={showSuccessModal} onClose={handleSuccessModalClose}>
          <div style={{ padding: 20, textAlign: 'center' }}>
            <h2 style={{ marginBottom: 20 }}>초대코드가 발송되었습니다! 📧</h2>
            <p style={{ marginBottom: 20 }}>보호자 이메일로 초대코드가 전송되었습니다.</p>
            <button
              onClick={handleSuccessModalClose}
              style={{
                width: '100%',
                padding: 12,
                backgroundColor: '#00499e',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: '1.05rem',
                cursor: 'pointer',
              }}
            >
              확인
            </button>
          </div>
        </ReusableModal>

        {/* ✅ 초대코드 보여주는 모달 */}
        <ReusableModal open={showInviteCodeModal} onClose={() => setShowInviteCodeModal(false)}>
          <div style={{ padding: 20 }}>
            <h2 style={{ marginBottom: 20 }}>초대코드가 생성되었습니다 🎉</h2>
            {inviteCode && (
              <div
                style={{
                  backgroundColor: '#f0f0f0',
                  padding: '1rem',
                  borderRadius: '8px',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginBottom: '20px',
                  wordBreak: 'break-word',
                }}
              >
                {inviteCode}
              </div>
            )}
            <button
              onClick={() => setShowInviteCodeModal(false)}
              style={{
                width: '100%',
                padding: 12,
                backgroundColor: '#00499e',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: '1.05rem',
                cursor: 'pointer',
              }}
            >
              확인
            </button>
          </div>
        </ReusableModal>
      </PageWrapper>
    </>
  );
};

export default GuardianPage;

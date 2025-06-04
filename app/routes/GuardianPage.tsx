import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import GuardianCard from '~/features/patient/components/Guardian/GuardianCard';
import SidebarMenu from '~/features/patient/components/SidebarMenu';
import { patientSidebarItems } from '~/features/patient/constants/sidebarItems';
import { getGuardians, type Guardian, inviteGuardian } from '~/features/patient/api/guardianAPI';
import useLoginStore from '~/features/user/stores/LoginStore';
import Header from '~/layout/Header';
import ReusableModal from '~/features/patient/components/ReusableModal';

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

// --- 더미 환자 데이터 (나중에 API 연결 가능) ---
// const dummyPatient = {
//   name: '김순자',
//   emoji: '👵',
//   role: '환자',
// };

// --- 메인 컴포넌트 ---
const GuardianPage = () => {
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [selectedGuardian, setSelectedGuardian] = useState<string | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showGuardianModal, setShowGuardianModal] = useState(false);
  const [newGuardianEmail, setNewGuardianEmail] = useState(''); // 🔥 추가
  const { user, fetchMyInfo } = useLoginStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchMyInfo();
        const guardianData = await getGuardians();
        const mappedGuardians = guardianData.map((item: Guardian) => ({
          name: item.name,
        }));
        setGuardians(mappedGuardians);
      } catch (error) {
        console.error('데이터 불러오기 실패', error);
      }
    };

    fetchData();
  }, []);

  const handleSidebarChange = (key: string) => {
    navigate(`/patients/${key}`);
  };

  const handleGuardianClick = (guardianName: string) => {
    setSelectedGuardian(guardianName);
    setShowAssignModal(true);
  };

  const handleAssign = () => {
    alert(`${selectedGuardian}에게 위임되었습니다.`);
    setShowAssignModal(false);
  };

  const openGuardianModal = () => {
    setShowGuardianModal(true);
  };

  const closeGuardianModal = () => {
    setShowGuardianModal(false);
    setNewGuardianEmail(''); // 모달 닫을 때 초기화
  };

  const handleEditGuardian = (guardianName: string) => {
    alert(`${guardianName} 수정 모달 열기 (추후 구현)`);
  };

  // 🔥 보호자 초대 (Guardian 초대 API 호출)
  const handleInviteGuardian = async () => {
    if (!newGuardianEmail) return;
    try {
      // patientId 임시: 1 (너 DB 확인해서 현재 환자 ID로 바꿔줘야 해)
      const patientId = 1;
      await inviteGuardian(patientId, newGuardianEmail);
      alert('보호자 초대 성공!');
      closeGuardianModal();

      // 초대 후 목록 새로고침
      const guardianData = await getGuardians();
      const mappedGuardians = guardianData.map((item: Guardian) => ({
        name: item.name,
      }));
      setGuardians(mappedGuardians);
    } catch (error) {
      console.error('보호자 초대 실패', error);
      alert('보호자 초대에 실패했습니다.');
    }
  };

  return (
    <>
      <Header />
      <PageWrapper>
        <SidebarBox>
          <ProfileSection>
            <ProfileEmoji>👵</ProfileEmoji>
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
            {guardians.slice(0, 2).map((guardian) => (
              <GuardianCard
                key={guardian.name}
                name={guardian.name}
                onEdit={() => handleEditGuardian(guardian.name)}
                onClick={() => handleGuardianClick(guardian.name)}
              />
            ))}
            <AddCard onClick={openGuardianModal}>＋</AddCard>
          </ListWrapper>
        </MainSection>

        {/* --- 보호자 초대 모달 --- */}
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
      </PageWrapper>
    </>
  );
};

export default GuardianPage;

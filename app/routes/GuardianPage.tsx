import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import GuardianCard from '~/features/patient/components/Guardian/GuardianCard';
import SidebarMenu from '~/features/patient/components/SidebarMenu';
import { patientSidebarItems } from '~/features/patient/constants/sidebarItems';
import GuardianModal from '~/features/patient/components/GuardianModal';
import GuardianAssignModal from '~/features/patient/components/Guardian/GuardianAssignModal';
import { getGuardians, type Guardian } from '~/features/patient/api/guardianAPI';
import { getAllUsers } from '~/features/patient/api/userAPI';

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
  const [patient, setPatient] = useState<{
    name: string;
    emoji: string;
    role: string;
  } | null>(null); // ✅ 유저 정보 저장

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, guardianData] = await Promise.all([getAllUsers(), getGuardians()]);

        if (userData.length > 0) {
          const user = userData[0]; // 첫 번째 유저
          setPatient({
            name: user.name,
            emoji: '👵', // 이모지는 기본값
            role: '환자',
          });
        }

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
  };

  const closeAssignModal = () => {
    setShowAssignModal(false);
  };

  const handleEditGuardian = (guardianName: string) => {
    alert(`${guardianName} 수정 모달 열기 (추후 구현)`);
  };

  return (
    <PageWrapper>
      <SidebarBox>
        <ProfileSection>
          <ProfileEmoji>{patient?.emoji}</ProfileEmoji>
          <ProfileName>{patient?.name} 님</ProfileName>
          <ProfileRole>{patient?.role}</ProfileRole>
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

      <GuardianModal open={showGuardianModal} onClose={closeGuardianModal} />
      <GuardianAssignModal
        open={showAssignModal}
        onClose={closeAssignModal}
        guardianName={selectedGuardian ?? ''}
        onAssign={handleAssign}
      />
    </PageWrapper>
  );
};

export default GuardianPage;

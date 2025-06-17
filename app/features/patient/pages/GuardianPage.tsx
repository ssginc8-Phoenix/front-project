import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import GuardianCard from '~/features/patient/components/Guardian/GuardianCard';
import SidebarMenu from '~/features/patient/components/SidebarMenu';
import { patientSidebarItems } from '~/features/patient/constants/sidebarItems';
import {
  getGuardians,
  deletePatientGuardian,
  type Guardian,
} from '~/features/patient/api/patientAPI';
import { inviteGuardian } from '~/features/guardian/api/guardianAPI';
import { getUserInfo } from '~/features/patient/api/userAPI';
import { getPatientInfo } from '~/features/patient/api/patientAPI';
import useLoginStore from '~/features/user/stores/LoginStore';
import ReusableModal from '~/features/patient/components/ReusableModal';

const PageWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  display: flex;
  gap: 48px;
  background: #f8f9fa;
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
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 32px 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
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

const GuardianPage: React.FC = () => {
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [userinfo, setUserinfo] = useState<{ name: string } | null>(null);
  const [patientInfo, setPatientInfo] = useState<{ patientId: number } | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newGuardianEmail, setNewGuardianEmail] = useState('');
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);

  const { fetchMyInfo } = useLoginStore();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      await fetchMyInfo();
      const u = await getUserInfo();
      setUserinfo(u);

      const p = await getPatientInfo();
      setPatientInfo(p);
      setGuardians(await getGuardians(p.patientId));

      const list = await getGuardians(p.patientId);
      setGuardians(list);
    })();
  }, [fetchMyInfo]);

  const handleSidebarChange = (key: string) => navigate(`/patients/${key}`);

  const handleDelete = async (g: Guardian) => {
    if (!confirm(`${g.name} 보호자를 정말 삭제하시겠습니까?`)) return;
    await deletePatientGuardian(g.patientGuardianId);
    setGuardians((gs) => gs.filter((x) => x.patientGuardianId !== g.patientGuardianId));
  };

  const openInvite = () => setShowInviteModal(true);
  const closeInvite = () => {
    setShowInviteModal(false);
    setNewGuardianEmail('');
  };

  const handleInvite = async () => {
    if (!newGuardianEmail || !patientInfo) return;
    const res = await inviteGuardian(patientInfo.patientId, newGuardianEmail);
    setInviteCode(res.inviteCode);
    closeInvite();
    setShowSuccessModal(true);
    const updated = await getGuardians(patientInfo.patientId);
    setGuardians(updated);
  };

  const closeSuccess = () => {
    setShowSuccessModal(false);
    setShowCodeModal(true);
  };

  return (
    <PageWrapper>
      <SidebarBox>
        <ProfileSection>
          <ProfileEmoji>👵</ProfileEmoji>
          <ProfileName>{userinfo?.name ?? '로딩 중'} 님</ProfileName>
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
          {guardians.map((g) => (
            <GuardianCard
              key={g.patientGuardianId}
              name={g.name}
              onDelete={() => handleDelete(g)}
            />
          ))}
          <AddCard onClick={openInvite}>＋</AddCard>
        </ListWrapper>
      </MainSection>

      {/* 초대 모달 */}
      <ReusableModal open={showInviteModal} onClose={closeInvite}>
        <div style={{ padding: 20 }}>
          <h2>보호자 초대</h2>
          <input
            type="email"
            value={newGuardianEmail}
            onChange={(e) => setNewGuardianEmail(e.target.value)}
            placeholder="보호자 이메일 입력"
            style={{
              width: '100%',
              padding: 12,
              marginBottom: 20,
              borderRadius: 8,
              border: '1px solid #ddd',
            }}
          />
          <button
            onClick={handleInvite}
            style={{
              width: '100%',
              padding: 12,
              backgroundColor: '#00499e',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
            }}
          >
            초대하기
          </button>
        </div>
      </ReusableModal>

      {/* 성공 모달 */}
      <ReusableModal open={showSuccessModal} onClose={closeSuccess}>
        <div style={{ padding: 20, textAlign: 'center' }}>
          <h2>초대코드가 발송되었습니다! 📧</h2>
          <p style={{ marginBottom: 20 }}>보호자 이메일로 초대코드가 전송되었습니다.</p>
          <button
            onClick={closeSuccess}
            style={{
              marginTop: 20,
              padding: 12,
              backgroundColor: '#00499e',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
            }}
          >
            확인
          </button>
        </div>
      </ReusableModal>

      {/* 코드 모달 */}
      <ReusableModal open={showCodeModal} onClose={() => setShowCodeModal(false)}>
        <div style={{ padding: 20 }}>
          <h2>초대코드가 생성되었습니다 🎉</h2>
          <div
            style={{
              background: '#f0f0f0',
              padding: '1rem',
              borderRadius: 8,
              fontWeight: 'bold',
              wordBreak: 'break-word',
              marginBottom: 20,
            }}
          >
            {inviteCode}
          </div>
          <button
            onClick={() => setShowCodeModal(false)}
            style={{
              width: '100%',
              padding: 12,
              backgroundColor: '#00499e',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
            }}
          >
            확인
          </button>
        </div>
      </ReusableModal>
    </PageWrapper>
  );
};

export default GuardianPage;

import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import GuardianCard from '~/features/patient/components/Guardian/GuardianCard';
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
import Sidebar from '~/common/Sidebar';

/**
 * 환자 마이페이지
 */

const PageWrapper = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainSection = styled.div`
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  min-width: 0;
  margin-left: 48px; /* 사이드바와의 간격 유지 */
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

const GuardianManagementPage: React.FC = () => {
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [userinfo, setUserinfo] = useState<{ name: string; profileImageUrl?: string } | null>(null);
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

      if (p?.patientId) {
        const list = await getGuardians(p.patientId);
        setGuardians(list);
      }
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
    if (patientInfo?.patientId) {
      const updated = await getGuardians(patientInfo.patientId);
      setGuardians(updated);
    }
  };

  const closeSuccess = () => {
    setShowSuccessModal(false);
    setShowCodeModal(true);
  };

  return (
    <PageWrapper>
      <Sidebar />

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

export default GuardianManagementPage;

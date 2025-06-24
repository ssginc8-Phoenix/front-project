import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import GuardianCard, { ProfileImage } from '~/features/patient/components/Guardian/GuardianCard';
import {
  getGuardians,
  deletePatientGuardian,
  type Guardian,
} from '~/features/patient/api/patientAPI';
import {
  inviteGuardian,
  getPendingGuardianInvites,
  type PendingInvite,
} from '~/features/guardian/api/guardianAPI';
import { getPatientInfo } from '~/features/patient/api/patientAPI';
import useLoginStore from '~/features/user/stores/LoginStore';
import ReusableModal from '~/features/patient/components/ReusableModal';
import Sidebar from '~/common/Sidebar';
import type { User } from '~/types/user';

const PageWrapper = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainSection = styled.div`
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  margin-left: 48px;
`;

const Title = styled.h2`
  font-size: 2.2rem;
  font-weight: 700;
  color: #00499e;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  margin: 1rem 0 0.5rem;
  color: #333;
`;

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const PendingCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  color: #333;
  font-size: 1rem;
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ResendButton = styled.button`
  padding: 0.4rem 0.8rem;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  &:hover {
    background: #1d4ed8;
  }
`;

const CancelButton = styled.button`
  padding: 0.4rem 0.8rem;
  background: #ef4444;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  &:hover {
    background: #dc2626;
  }
`;

const AddCard = styled.button`
  margin-top: 1rem;
  height: 100px;
  border: 2px dashed #00499e;
  border-radius: 12px;
  background: #fff;
  color: #00499e;
  font-size: 3rem;
  cursor: pointer;
  &:hover {
    background: #e9f0ff;
  }
`;

// 기본 아바타 URL
const DEFAULT_AVATAR = 'https://docto-project.s3.ap-southeast-2.amazonaws.com/user/user.png';

const GuardianManagementPage: React.FC = () => {
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [patientInfo, setPatientInfo] = useState<{ patientId: number } | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newGuardianEmail, setNewGuardianEmail] = useState('');
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [showCodeModal, setShowCodeModal] = useState(false);

  const { fetchMyInfo } = useLoginStore();
  const navigate = useNavigate();

  const reloadAll = async (patientId: number) => {
    const [acc, pend] = await Promise.all([
      getGuardians(patientId),
      getPendingGuardianInvites(patientId),
    ]);
    setGuardians(acc);
    setPendingInvites(pend);
  };

  useEffect(() => {
    (async () => {
      await fetchMyInfo();
      const p = await getPatientInfo();
      setPatientInfo(p);
      if (p?.patientId) {
        await reloadAll(p.patientId);
      }
    })();
  }, [fetchMyInfo]);

  const handleDelete = async (g: Guardian) => {
    if (!confirm(`${g.name} 보호자를 정말 삭제하시겠습니까?`)) return;
    await deletePatientGuardian(g.patientGuardianId);
    if (patientInfo) await reloadAll(patientInfo.patientId);
  };

  const handleCancelInvite = async (inv: PendingInvite) => {
    if (!confirm(`초대를 취소하시겠습니까? (${inv.name})`)) return;
    await deletePatientGuardian(inv.mappingId);
    if (patientInfo) await reloadAll(patientInfo.patientId);
  };

  const handleResendInvite = async (inv: PendingInvite) => {
    if (!patientInfo) return;
    const res = await inviteGuardian(patientInfo.patientId, inv.email);
    setInviteCode(res.inviteCode);
    setShowCodeModal(true);
    await reloadAll(patientInfo.patientId);
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
    setShowCodeModal(true);
    await reloadAll(patientInfo.patientId);
  };

  return (
    <PageWrapper>
      <Sidebar onChange={(key) => navigate(`/patients/${key}`)} />

      <MainSection>
        <Title>🧑‍🤝‍🧑 보호자 관리</Title>

        {/* 1. 초대중 */}
        <SectionTitle>초대중</SectionTitle>
        <ListWrapper>
          {pendingInvites.map((inv) => (
            <PendingCard key={inv.mappingId}>
              <span>
                {inv.name} <em>(초대중)</em>
              </span>
              <ActionGroup>
                <ResendButton onClick={() => handleResendInvite(inv)}>재초대</ResendButton>
                <CancelButton onClick={() => handleCancelInvite(inv)}>취소</CancelButton>
              </ActionGroup>
            </PendingCard>
          ))}
        </ListWrapper>

        {/* 2. 등록된 보호자 */}
        <SectionTitle>등록된 보호자</SectionTitle>
        <ListWrapper>
          {guardians.map((g) => (
            <GuardianCard
              key={g.patientGuardianId}
              name={g.name}
              avatar={
                <ProfileImage src={g.profileImageUrl ?? DEFAULT_AVATAR} alt={`${g.name} 프로필`} />
              }
              onDelete={() => handleDelete(g)}
            />
          ))}
        </ListWrapper>

        {/* 3. 새 초대 */}
        <AddCard onClick={openInvite}>＋</AddCard>
      </MainSection>

      {/* 보호자 초대 모달 */}
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

      {/* 초대코드 표시 모달 */}
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

import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
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
import { showConfirmAlert, showErrorAlert, showSuccessAlert } from '~/components/common/alert';

// Media queries for responsive design
const media = {
  laptop: `@media (max-width: 1024px)`,
  tablet: `@media (max-width: 768px)`,
  mobile: `@media (max-width: 480px)`,
  mobileSmall: `@media (max-width: 360px)`,
};

const MainSection = styled.div`
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  margin-left: 48px;

  ${media.laptop} {
    margin-left: 0; // Remove left margin on smaller laptops
  }

  ${media.tablet} {
    padding: 1.5rem;
  }

  ${media.mobile} {
    padding: 1rem;
  }
`;

const Title = styled.h2`
  font-size: 2.2rem;
  font-weight: 700;
  color: #00499e;
  margin-bottom: 1.5rem;

  ${media.tablet} {
    font-size: 1.8rem;
    margin-bottom: 1.2rem;
  }

  ${media.mobile} {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  margin: 1rem 0 0.5rem;
  color: #333;

  ${media.tablet} {
    font-size: 1.1rem;
    margin: 0.8rem 0 0.4rem;
  }

  ${media.mobile} {
    font-size: 1rem;
    margin: 0.6rem 0 0.3rem;
  }
`;

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  ${media.mobile} {
    gap: 0.5rem;
  }
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
  flex-wrap: wrap; // Allow wrapping on small screens

  ${media.tablet} {
    padding: 0.8rem;
    font-size: 0.95rem;
  }

  ${media.mobile} {
    flex-direction: column;
    align-items: flex-start;
    padding: 0.7rem;
    font-size: 0.9rem;
    gap: 0.5rem;
  }
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 0.5rem;

  ${media.mobile} {
    width: 100%;
    justify-content: flex-end;
    gap: 0.4rem;
  }
`;

const BaseButton = styled.button`
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background-color 0.2s ease;

  ${media.tablet} {
    padding: 0.35rem 0.7rem;
    font-size: 0.8rem;
  }

  ${media.mobile} {
    padding: 0.3rem 0.6rem;
    font-size: 0.75rem;
    border-radius: 5px;
  }
`;

const ResendButton = styled(BaseButton)`
  background: #2563eb;
  color: #fff;
  &:hover {
    background: #1d4ed8;
  }
`;

const CancelButton = styled(BaseButton)`
  background: #ef4444;
  color: #fff;
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
  transition: background-color 0.2s ease;

  &:hover {
    background: #e9f0ff;
  }

  ${media.tablet} {
    height: 90px;
    font-size: 2.5rem;
  }

  ${media.mobile} {
    height: 80px;
    font-size: 2rem;
    margin-top: 0.8rem;
  }
`;

const ModalContentWrapper = styled.div`
  padding: 10px 0; // Adjust padding inside modal content
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border-radius: 8px;
  border: 1px solid #ddd;
  box-sizing: border-box; // Include padding in element's total width

  ${media.mobile} {
    padding: 10px;
    margin-bottom: 15px;
    font-size: 0.9rem;
  }
`;

const ModalActionButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #00499e;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #003a7d;
  }

  ${media.mobile} {
    padding: 10px;
    font-size: 0.95rem;
  }
`;

const InviteCodeDisplay = styled.div`
  background: #f0f0f0;
  padding: 1rem;
  border-radius: 8px;
  font-weight: bold;
  word-break: break-word;
  margin-bottom: 20px;
  font-size: 1.1rem;
  color: #333;

  ${media.mobile} {
    padding: 0.8rem;
    font-size: 1rem;
    margin-bottom: 15px;
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

  const reloadAll = async (patientId: number) => {
    try {
      const [acc, pend] = await Promise.all([
        getGuardians(patientId),
        getPendingGuardianInvites(patientId),
      ]);
      setGuardians(acc);
      setPendingInvites(pend);
    } catch (error) {
      console.error('Failed to reload guardian data:', error);
      showErrorAlert('데이터 로딩 실패', '보호자 정보를 불러오는 데 실패했습니다.');
    }
  };

  useEffect(() => {
    (async () => {
      try {
        await fetchMyInfo();
        const p = await getPatientInfo();
        setPatientInfo(p);
        if (p?.patientId) {
          await reloadAll(p.patientId);
        }
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
        showErrorAlert(
          '초기 데이터 로딩 실패',
          '페이지를 표시하는 데 필요한 초기 정보를 불러오는 데 실패했습니다.',
        );
      }
    })();
  }, [fetchMyInfo]);

  const handleDelete = async (g: Guardian) => {
    const result = await showConfirmAlert(
      '보호자 삭제',
      `${g.name} 보호자를 정말 삭제하시겠습니까?`,
      'question',
    );
    if (!result.isConfirmed) return;

    try {
      await deletePatientGuardian(g.patientGuardianId);
      if (patientInfo) await reloadAll(patientInfo.patientId);
      showSuccessAlert('삭제 완료', `${g.name} 보호자가 성공적으로 삭제되었습니다.`);
    } catch (error) {
      console.error('Failed to delete guardian:', error);
      showErrorAlert('삭제 실패', '보호자 삭제에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  const handleCancelInvite = async (inv: PendingInvite) => {
    const result = await showConfirmAlert(
      '초대 취소',
      `초대를 취소하시겠습니까? (${inv.name})`,
      'question',
    );
    if (!result.isConfirmed) return;

    try {
      await deletePatientGuardian(inv.mappingId); // Assuming this API can cancel an invite
      if (patientInfo) await reloadAll(patientInfo.patientId);
      showSuccessAlert('초대 취소 완료', `${inv.name} 님의 초대가 성공적으로 취소되었습니다.`);
    } catch (error) {
      console.error('Failed to cancel invite:', error);
      showErrorAlert('초대 취소 실패', '초대 취소에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  const handleResendInvite = async (inv: PendingInvite) => {
    if (!patientInfo) {
      showErrorAlert('오류', '환자 정보가 없어 초대를 다시 보낼 수 없습니다.');
      return;
    }

    try {
      const res = await inviteGuardian(patientInfo.patientId, inv.email);
      setInviteCode(res.inviteCode);
      setShowCodeModal(true);
      await reloadAll(patientInfo.patientId);
      showSuccessAlert('재초대 완료', `${inv.name} 님에게 초대를 다시 보냈습니다.`);
    } catch (error) {
      console.error('Failed to resend invite:', error);
      showErrorAlert('초대 재전송 실패', '초대 재전송에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  const openInvite = () => setShowInviteModal(true);
  const closeInvite = () => {
    setShowInviteModal(false);
    setNewGuardianEmail('');
  };

  const handleInvite = async () => {
    if (!newGuardianEmail.trim()) {
      showErrorAlert('입력 오류', '이메일을 입력해주세요.');
      return;
    }
    if (!patientInfo) {
      showErrorAlert('오류', '환자 정보가 없어 초대를 보낼 수 없습니다.');
      return;
    }

    try {
      const res = await inviteGuardian(patientInfo.patientId, newGuardianEmail);
      setInviteCode(res.inviteCode);
      closeInvite();
      setShowCodeModal(true);
      await reloadAll(patientInfo.patientId);
      showSuccessAlert('초대 성공', '보호자 초대가 성공적으로 전송되었습니다.');
    } catch (error: any) {
      console.error('Failed to send invite:', error);
      const errorMessage = error.response?.data?.message || '초대 전송에 실패했습니다.';
      showErrorAlert('초대 실패', errorMessage);
    }
  };

  return (
    <>
      <MainSection>
        <Title>🧑‍🤝‍🧑 보호자 관리</Title>
        <SectionTitle>초대중</SectionTitle>
        <ListWrapper>
          {pendingInvites.length > 0 ? (
            pendingInvites.map((inv) => (
              <PendingCard key={inv.mappingId}>
                <span>
                  {inv.name} <em>(초대중)</em>
                </span>
                <ActionGroup>
                  <ResendButton onClick={() => handleResendInvite(inv)}>재초대</ResendButton>
                  <CancelButton onClick={() => handleCancelInvite(inv)}>취소</CancelButton>
                </ActionGroup>
              </PendingCard>
            ))
          ) : (
            <p style={{ color: '#666', fontSize: '0.9rem' }}>현재 초대중인 보호자가 없습니다.</p>
          )}
        </ListWrapper>
        <SectionTitle>등록된 보호자</SectionTitle>
        <ListWrapper>
          {guardians.length > 0 ? (
            guardians.map((g) => (
              <GuardianCard
                key={g.patientGuardianId}
                name={g.name}
                avatar={
                  <ProfileImage
                    src={g.profileImageUrl ?? DEFAULT_AVATAR}
                    alt={`${g.name} 프로필`}
                  />
                }
                onDelete={() => handleDelete(g)}
              />
            ))
          ) : (
            <p style={{ color: '#666', fontSize: '0.9rem' }}>등록된 보호자가 없습니다.</p>
          )}
        </ListWrapper>
        <AddCard onClick={openInvite}>＋</AddCard>
      </MainSection>

      {/* 보호자 초대 모달 */}
      <ReusableModal open={showInviteModal} onClose={closeInvite}>
        <ModalContentWrapper>
          <h2>보호자 초대</h2>
          <ModalInput
            type="email"
            value={newGuardianEmail}
            onChange={(e) => setNewGuardianEmail(e.target.value)}
            placeholder="보호자 이메일 입력"
          />
          <ModalActionButton onClick={handleInvite}>초대하기</ModalActionButton>
        </ModalContentWrapper>
      </ReusableModal>

      {/* 초대코드 표시 모달 */}
      <ReusableModal open={showCodeModal} onClose={() => setShowCodeModal(false)}>
        <ModalContentWrapper>
          <h2>초대코드가 생성되었습니다 🎉</h2>
          <InviteCodeDisplay>{inviteCode}</InviteCodeDisplay>
          <ModalActionButton onClick={() => setShowCodeModal(false)}>확인</ModalActionButton>
        </ModalContentWrapper>
      </ReusableModal>
    </>
  );
};

export default GuardianManagementPage;

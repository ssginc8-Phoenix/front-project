import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import SidebarMenu from '~/features/patient/components/SidebarMenu';
import { guardianSidebarItems } from '~/features/guardian/constants/sidebarItems';
import useLoginStore from '~/features/user/stores/LoginStore';
import {
  acceptGuardianInvite,
  getGuardianPatients,
  deleteGuardianPatient,
  type PatientSummary,
} from '~/features/guardian/api/guardianAPI';
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
  position: relative;
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 2.2rem;
  font-weight: 700;
  color: #00499e;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InviteButton = styled.button`
  background: #00499e;
  color: #fff;
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 500;
`;

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Card = styled.div`
  position: relative; /* 삭제 버튼 위치용 */
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: none;
  font-size: 1.2rem;
  color: #999;
  cursor: pointer;
  &:hover {
    color: #ff4646;
  }
`;

const PatientName = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
`;

const PatientInfo = styled.div`
  font-size: 1rem;
  color: #555;
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

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  font-size: 1.05rem;
  border-radius: 8px;
  border: 1.5px solid #ddd;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #00499e;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.05rem;
  cursor: pointer;
`;

const ProfileImage = styled.img`
  width: 5rem;
  height: 5rem;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 8px;
`;

// --- 컴포넌트 ---
export const GuardianPatientPage = () => {
  const [patients, setPatients] = useState<PatientSummary[]>([]);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);

  const { user, fetchMyInfo } = useLoginStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchMyInfo();
        const list = await getGuardianPatients();
        setPatients(list);
      } catch (error) {
        console.error('환자 목록 가져오기 실패', error);
      }
    };
    fetchData();
  }, [fetchMyInfo]);

  const handleSidebarChange = (key: string) => {
    navigate(`/guardians/${key}`);
  };

  const maskRRN = (rrn: string) =>
    rrn ? rrn.substring(0, 6) + '-' + rrn.substring(7, 8) + '******' : '';

  const handleInviteAccept = async () => {
    if (!inviteCode) {
      alert('초대 코드를 입력하세요!');
      return;
    }
    try {
      await acceptGuardianInvite(inviteCode);
      alert('보호자 수락 성공!');
      setInviteModalOpen(false);
      setInviteCode('');
      const updated = await getGuardianPatients();
      setPatients(updated);
    } catch (error) {
      console.error('초대 수락 실패', error);
      alert('초대 코드가 잘못되었습니다.');
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedPatientId == null) return;
    try {
      // 1) 백엔드에서 soft‑delete
      await deleteGuardianPatient(selectedPatientId);

      // 2) 로컬 상태에서 해당 환자만 필터링
      setPatients((prev) => prev.filter((p) => p.patientId !== selectedPatientId));

      // (선택) 전체 다시 불러오고 싶다면:
      // const updated = await getGuardianPatients();
      // setPatients(updated);
    } catch (error) {
      console.error('삭제 실패', error);
      alert('삭제에 실패했습니다.');
    } finally {
      setDeleteModalOpen(false);
      setSelectedPatientId(null);
    }
  };

  return (
    <>
      <PageWrapper>
        <SidebarBox>
          <ProfileSection>
            <ProfileImage
              src={
                user?.profileImageUrl ??
                'https://docto-project.s3.ap-southeast-2.amazonaws.com/user/user.png'
              }
              alt="프로필 사진"
            />
            <ProfileName>{user?.name ?? '이름 로딩 중'} 님</ProfileName>
            <ProfileRole>보호자</ProfileRole>
          </ProfileSection>

          <SidebarMenu
            items={guardianSidebarItems}
            activeKey="patients"
            onChange={handleSidebarChange}
          />
        </SidebarBox>

        <MainSection>
          <TitleWrapper>
            <Title>🧑‍💼️ 환자 관리</Title>
            <InviteButton onClick={() => setInviteModalOpen(true)}>초대 코드 입력</InviteButton>
          </TitleWrapper>

          <ListWrapper>
            {patients.map((patient) => (
              <Card key={patient.patientId}>
                <DeleteButton
                  onClick={() => {
                    setSelectedPatientId(patient.patientId);
                    setDeleteModalOpen(true);
                  }}
                >
                  ×
                </DeleteButton>
                <div>
                  <PatientName>{patient.name}</PatientName>
                  <PatientInfo>{maskRRN(patient.residentRegistrationNumber)}</PatientInfo>
                </div>
              </Card>
            ))}
          </ListWrapper>
        </MainSection>

        {/* 초대코드 입력 모달 */}
        <ReusableModal open={inviteModalOpen} onClose={() => setInviteModalOpen(false)}>
          <div style={{ padding: 20 }}>
            <h2 style={{ marginBottom: 20 }}>초대 코드 입력</h2>
            <Input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="초대 코드를 입력하세요"
            />
            <SubmitButton onClick={handleInviteAccept}>수락하기</SubmitButton>
          </div>
        </ReusableModal>

        {/* 삭제 확인 모달 */}
        <ReusableModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          hideCloseButton
        >
          <div style={{ fontSize: '1.13rem', fontWeight: 600, marginBottom: 24 }}>
            정말 이 환자 연결을 해제하시겠습니까?
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 18 }}>
            <button onClick={() => setDeleteModalOpen(false)}>취소</button>
            <button onClick={handleConfirmDelete}>삭제하기</button>
          </div>
        </ReusableModal>
      </PageWrapper>
    </>
  );
};

export default GuardianPatientPage;

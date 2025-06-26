import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import useLoginStore from '~/features/user/stores/LoginStore';
import {
  acceptGuardianInvite,
  getGuardianPatients,
  deleteGuardianPatient,
  type PatientSummary,
} from '~/features/guardian/api/guardianAPI';
import ReusableModal from '~/features/patient/components/ReusableModal';
import Sidebar from '~/common/Sidebar'; // ReusableModal 경로 통일

const MainSection = styled.div`
  flex: 1; /* CalendarPage의 ContentWrapper와 동일 */
  padding: 2rem; /* CalendarPage의 ContentWrapper와 동일 */
  display: flex;
  flex-direction: column;
  min-width: 0;
  margin-left: 48px; /* CalendarPage의 ContentWrapper와 동일한 간격 */
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
  &:hover {
    background: #003a7a; /* 호버 색상 추가 */
  }
`;

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Card = styled.div`
  position: relative;
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
  &:hover {
    background: #003a7a; /* 호버 색상 추가 */
  }
`;

// --- 컴포넌트 ---
export const PatientManagementPage = () => {
  const [patients, setPatients] = useState<PatientSummary[]>([]);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);

  const { fetchMyInfo } = useLoginStore();

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
      await deleteGuardianPatient(selectedPatientId);
      setPatients((prev) => prev.filter((p) => p.patientId !== selectedPatientId));
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
          <button
            onClick={() => setDeleteModalOpen(false)}
            style={{
              background: '#f3f3f3',
              borderRadius: 16,
              border: 'none',
              padding: '10px 24px',
              color: '#555',
              fontWeight: 500,
              fontSize: '1.05rem',
              cursor: 'pointer',
              transition: 'background 0.16s',
              '&:hover': { background: '#e0e0e0' },
            }}
          >
            취소
          </button>
          <button
            onClick={handleConfirmDelete}
            style={{
              background: '#ff4646',
              borderRadius: 16,
              border: 'none',
              padding: '10px 24px',
              color: '#fff',
              fontWeight: 600,
              fontSize: '1.05rem',
              cursor: 'pointer',
              transition: 'background 0.16s',
              '&:hover': { background: '#cc3737' },
            }}
          >
            삭제하기
          </button>
        </div>
      </ReusableModal>
    </>
  );
};

export default PatientManagementPage;

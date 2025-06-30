import styled from 'styled-components';
import { useEffect, useState } from 'react';
import useLoginStore from '~/features/user/stores/LoginStore';
import {
  acceptGuardianInvite,
  getGuardianPatients,
  deleteGuardianPatient,
  type PatientSummary,
} from '~/features/guardian/api/guardianAPI';
import ReusableModal from '~/features/patient/components/ReusableModal';
import { Title, Wrapper, ButtonContainer, media } from '~/components/styled/MyPage.styles';
import {
  CancelModalButton,
  Card,
  ConfirmText,
  DeleteButton,
  DeleteModalButton,
  Input,
  InviteButton,
  ModalButtonContainer,
  ModalContentWrapper,
  ModalTitle,
  PatientInfo,
  PatientManagementContentBody,
  PatientName,
  SubmitButton,
} from '~/features/guardian/pages/PatientManagement.styles';

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
        // Optionally, alert the user or show a more friendly message
        alert('환자 목록을 불러오는 데 실패했습니다.');
      }
    };
    fetchData();
  }, [fetchMyInfo]);

  const maskRRN = (rrn: string) =>
    rrn ? rrn.substring(0, 6) + '-' + rrn.substring(7, 8) + '******' : '';

  const handleInviteAccept = async () => {
    if (!inviteCode.trim()) {
      // Use .trim() to check for empty or whitespace-only input
      alert('초대 코드를 입력하세요!');
      return;
    }
    try {
      await acceptGuardianInvite(inviteCode);
      alert('보호자 수락 성공!');
      setInviteModalOpen(false);
      setInviteCode(''); // Clear the input after success
      const updated = await getGuardianPatients();
      setPatients(updated);
    } catch (error) {
      console.error('초대 수락 실패', error);
      alert('초대 코드가 잘못되었거나 이미 사용되었습니다.'); // More specific error message
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedPatientId == null) return; // Should not happen if modal is opened correctly
    try {
      await deleteGuardianPatient(selectedPatientId);
      setPatients((prev) => prev.filter((p) => p.patientId !== selectedPatientId));
      alert('환자 연결이 해제되었습니다.'); // Success message
    } catch (error) {
      console.error('삭제 실패', error);
      alert('환자 연결 해제에 실패했습니다.'); // Failure message
    } finally {
      setDeleteModalOpen(false);
      setSelectedPatientId(null); // Reset selected patient ID
    }
  };

  return (
    <Wrapper>
      <Title>{media.mobileSmall && <>🧑‍💼</>}환자 관리</Title>
      <ButtonContainer>
        <InviteButton onClick={() => setInviteModalOpen(true)}>초대 코드 입력</InviteButton>
      </ButtonContainer>
      <PatientManagementContentBody>
        {patients.length > 0 ? ( // Display message if no patients are linked
          patients.map((patient) => (
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
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>
            연결된 환자가 없습니다. 초대 코드를 입력하여 환자를 추가하세요.
          </p>
        )}
      </PatientManagementContentBody>
      {/* 초대코드 입력 모달 */}
      <ReusableModal open={inviteModalOpen} onClose={() => setInviteModalOpen(false)}>
        <ModalContentWrapper>
          <ModalTitle>초대 코드 입력</ModalTitle>
          <Input
            type="text"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            placeholder="초대 코드를 입력하세요"
          />
          <SubmitButton onClick={handleInviteAccept}>수락하기</SubmitButton>
        </ModalContentWrapper>
      </ReusableModal>
      {/* 삭제 확인 모달 */}
      <ReusableModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        hideCloseButton // Keep the close button hidden as per original logic
      >
        <ConfirmText>정말 이 환자 연결을 해제하시겠습니까?</ConfirmText>
        <ModalButtonContainer>
          <CancelModalButton onClick={() => setDeleteModalOpen(false)}>취소</CancelModalButton>
          <DeleteModalButton onClick={handleConfirmDelete}>삭제하기</DeleteModalButton>
        </ModalButtonContainer>
      </ReusableModal>
    </Wrapper>
  );
};

export default PatientManagementPage;

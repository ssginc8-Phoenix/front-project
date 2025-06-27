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

// Define media queries for responsive design
const media = {
  laptopL: `@media (max-width: 1600px)`,
  laptop: `@media (max-width: 1024px)`,
  tablet: `@media (max-width: 768px)`,
  mobile: `@media (max-width: 480px)`,
  mobileSmall: `@media (max-width: 360px)`, // Target for 360x740
};

const MainSection = styled.div`
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  min-width: 0;
  margin-left: 48px;

  ${media.laptop} {
    margin-left: 0; // Remove fixed margin on smaller laptops/tablets
  }

  ${media.tablet} {
    padding: 1.5rem;
  }

  ${media.mobile} {
    padding: 1rem;
  }

  ${media.mobileSmall} {
    padding: 0.8rem;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap; // Allow wrapping on smaller screens

  ${media.mobile} {
    margin-bottom: 1.5rem;
    flex-direction: column; // Stack items on mobile
    align-items: flex-start;
    gap: 0.8rem; // Gap when stacked
  }
`;

const Title = styled.h2`
  font-size: 2.2rem;
  font-weight: 700;
  color: #00499e;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  ${media.tablet} {
    font-size: 1.8rem;
  }

  ${media.mobile} {
    font-size: 1.5rem;
  }

  ${media.mobileSmall} {
    font-size: 1.3rem;
  }
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
  transition: background 0.2s ease; // Smooth transition for hover
  &:hover {
    background: #003a7a;
  }

  ${media.tablet} {
    padding: 8px 15px;
    font-size: 0.9rem;
  }

  ${media.mobile} {
    width: 100%; // Full width button on mobile
    padding: 10px;
    font-size: 0.95rem;
    margin-top: 0.5rem; // Add a small gap if stacked
  }
`;

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  ${media.mobile} {
    gap: 0.8rem;
  }
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

  ${media.tablet} {
    padding: 16px;
  }

  ${media.mobile} {
    padding: 14px;
    flex-direction: column; // Stack content on mobile
    align-items: flex-start;
    gap: 0.5rem;
  }
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
  transition: color 0.2s ease; // Smooth transition for hover
  &:hover {
    color: #ff4646;
  }

  ${media.mobile} {
    font-size: 1.1rem;
    top: 10px;
    right: 10px;
  }
`;

const PatientName = styled.div`
  font-size: 1.25rem;
  font-weight: 600;

  ${media.tablet} {
    font-size: 1.15rem;
  }

  ${media.mobile} {
    font-size: 1.05rem;
  }
`;

const PatientInfo = styled.div`
  font-size: 1rem;
  color: #555;

  ${media.tablet} {
    font-size: 0.9rem;
  }

  ${media.mobile} {
    font-size: 0.85rem;
  }
`;

const ModalContentWrapper = styled.div`
  padding: 20px;
  text-align: center; // Center text inside the modal

  ${media.mobile} {
    padding: 15px;
  }
`;

const ModalTitle = styled.h2`
  margin-bottom: 20px;
  font-size: 1.5rem;
  color: #333;

  ${media.mobile} {
    font-size: 1.3rem;
    margin-bottom: 15px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  font-size: 1.05rem;
  border-radius: 8px;
  border: 1.5px solid #ddd;
  box-sizing: border-box; // Ensure padding doesn't increase total width

  ${media.mobile} {
    padding: 10px;
    font-size: 0.95rem;
    margin-bottom: 15px;
  }
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
  transition: background 0.2s ease;
  &:hover {
    background: #003a7a;
  }

  ${media.mobile} {
    padding: 10px;
    font-size: 0.95rem;
  }
`;

const ConfirmText = styled.div`
  font-size: 1.13rem;
  font-weight: 600;
  margin-bottom: 24px;
  color: #333;

  ${media.tablet} {
    font-size: 1.05rem;
    margin-bottom: 20px;
  }

  ${media.mobile} {
    font-size: 0.95rem;
    margin-bottom: 18px;
  }
`;

const ModalButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 18px;

  ${media.mobile} {
    flex-direction: column; // Stack buttons on very small screens
    gap: 10px;
  }
`;

const ModalActionButton = styled.button`
  border-radius: 16px;
  border: none;
  padding: 10px 24px;
  font-weight: 500;
  font-size: 1.05rem;
  cursor: pointer;
  transition:
    background 0.16s ease,
    color 0.16s ease;
  min-width: 100px; // Ensure buttons have a minimum width

  ${media.tablet} {
    padding: 9px 20px;
    font-size: 1rem;
    min-width: 90px;
  }

  ${media.mobile} {
    padding: 8px 16px;
    font-size: 0.95rem;
    width: 100%; // Full width for stacked buttons
    min-width: unset;
  }
`;

const CancelModalButton = styled(ModalActionButton)`
  background: #f3f3f3;
  color: #555;
  &:hover {
    background: #e0e0e0;
  }
`;

const DeleteModalButton = styled(ModalActionButton)`
  background: #ff4646;
  color: #fff;
  font-weight: 600;
  &:hover {
    background: #cc3737;
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
    <>
      <MainSection>
        <TitleWrapper>
          <Title>🧑‍💼️ 환자 관리</Title>
          <InviteButton onClick={() => setInviteModalOpen(true)}>초대 코드 입력</InviteButton>
        </TitleWrapper>

        <ListWrapper>
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
        </ListWrapper>
      </MainSection>

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
    </>
  );
};

export default PatientManagementPage;

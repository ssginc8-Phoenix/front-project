// src/components/DocumentRequestForm.tsx
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useCreateRequest } from '~/features/documents/hooks/useDocumentRequests';
import useLoginStore from '~/features/user/stores/LoginStore';
import type { DocumentResponseDTO } from '~/features/documents/types/insurance';
import { showErrorAlert } from '~/components/common/alert';

const StyledButton = styled.button`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #2980b9;
  color: #fff;
  font-size: 1rem;
  margin-top: 2rem;
  font-weight: 600;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(41, 128, 185, 0.4);
  transition:
    background-color 0.2s,
    transform 0.1s;

  &:hover {
    background-color: #1c5983;
  }
  &:active {
    transform: scale(0.98);
  }
  &:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

interface Props {
  onSuccess: (dto: DocumentResponseDTO) => void;
  hospitalId: number | null;
  appointmentId: number;
  /** `MEDICAL_REPORT`, `LAB_RESULT`, `PRESCRIPTION`, `CLAIM_FORM`, `OTHER` */
  documentType: string;
}

const DocumentRequestForm: React.FC<Props> = ({
  onSuccess,
  hospitalId,
  appointmentId,
  documentType,
}) => {
  const { user } = useLoginStore(); // 로그인한 유저
  const createRequest = useCreateRequest(); // mutation 훅
  const loading = createRequest.status === 'pending';

  /** 모든 필수 값이 채워졌는지 */
  const isReady = !!user?.userId && hospitalId !== null && !!appointmentId && !!documentType;

  /** 실제 요청 보내기 */
  const handleRequest = useCallback(async () => {
    if (!isReady) {
      showErrorAlert('필수 정보 누락', '병원·진료·서류 종류를 모두 선택해주세요.');
      return;
    }

    createRequest.mutate(
      {
        requesterId: user!.userId,
        hospitalId: hospitalId!,
        appointmentId,
        type: documentType, // ✅ 백엔드 필드명에 맞춤
      },
      {
        onSuccess,
        onError: async (err) => {
          console.error(err);
          await showErrorAlert('요청 실패', '서류 요청에 실패했습니다.');
        },
      },
    );
  }, [isReady, createRequest, user, hospitalId, appointmentId, documentType, onSuccess]);

  return (
    <StyledButton onClick={handleRequest} disabled={loading || !isReady} type="button">
      {loading ? '요청 중…' : '서류 요청하기'}
    </StyledButton>
  );
};

export default DocumentRequestForm;

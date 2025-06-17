import React, { useState } from 'react';
import styled from 'styled-components';

interface Props {
  reviewId: number;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export const ReportModal: React.FC<Props> = ({ onClose, onConfirm }) => {
  const [reason, setReason] = useState('');

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Title>
          🚩 <strong>리뷰를 신고하시겠습니까?</strong>
        </Title>
        <Textarea
          placeholder="신고 사유를 입력해주세요 (예: 욕설, 허위 정보 등)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <Actions>
          <CancelBtn onClick={onClose}>취소</CancelBtn>
          <ConfirmBtn
            onClick={() => {
              if (!reason.trim()) {
                alert('신고 사유를 입력해주세요.');
                return;
              }
              onConfirm(reason);
            }}
          >
            신고하기
          </ConfirmBtn>
        </Actions>
      </ModalContainer>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  position: relative;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #1f2937;
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 120px;
  resize: none;
  padding: 0.75rem;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background-color: #f9fafb;
  margin-bottom: 1.5rem;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

const CancelBtn = styled.button`
  background: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1.2rem;
  font-weight: 500;
  cursor: pointer;
`;

const ConfirmBtn = styled.button`
  background: #ba1a1a;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1.2rem;
  font-weight: 500;
  cursor: pointer;
`;

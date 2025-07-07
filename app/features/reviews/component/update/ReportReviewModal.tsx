import React, { useState } from 'react';
import styled from 'styled-components';
import { reportReview } from '~/features/reviews/api/reviewAPI';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Dialog = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  width: 360px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
`;

interface Props {
  reviewId: number;
  isOpen: boolean;
  onClose: () => void;
  onReported: () => void;
}

export default function ReportReviewModal({ reviewId, isOpen, onClose, onReported }: Props) {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      await reportReview(reviewId);
      onReported();
      onClose();
      alert('신고가 접수되었습니다.');
    } catch {
      alert('신고 중 오류가 발생했습니다.');
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Dialog onClick={(e) => e.stopPropagation()}>
        <h2>리뷰 신고</h2>
        <textarea
          placeholder="신고 사유를 입력해주세요."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          style={{ width: '100%', margin: '12px 0' }}
        />
        <div style={{ textAlign: 'right' }}>
          <button onClick={onClose} style={{ marginRight: 8 }}>
            취소
          </button>
          <button onClick={handleSubmit} disabled={!reason.trim()}>
            신고 제출
          </button>
        </div>
      </Dialog>
    </Overlay>
  );
}

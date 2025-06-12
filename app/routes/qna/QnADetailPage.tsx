import React from 'react';
import { useParams, useNavigate } from 'react-router';
import QaChatModal from '~/features/qna/component/QaChatModal';

export default function QnADetailPage() {
  const { qnaId } = useParams<{ qnaId: string }>();
  const navigate = useNavigate();
  const id = Number(qnaId);

  if (Number.isNaN(id)) {
    navigate('/qna', { replace: true });
    return null;
  }

  return (
    <QaChatModal qnaId={id} onClose={() => navigate('/qna', { replace: true })} showInput={false} />
  );
}

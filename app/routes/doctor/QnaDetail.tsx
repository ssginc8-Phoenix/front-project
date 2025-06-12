import { useParams, useNavigate } from 'react-router';
import QaChatModal from '~/features/qna/component/QaChatModal';

export default function QnaDetail() {
  const { qnaId } = useParams<{ qnaId: string }>();
  const navigate = useNavigate();
  const id = Number(qnaId);

  if (Number.isNaN(id)) {
    navigate('/doctor/qna', { replace: true });
    return null;
  }

  return (
    <QaChatModal
      qnaId={id}
      onClose={() => navigate('/doctor/qna', { replace: true })}
      showInput={true}
    />
  );
}

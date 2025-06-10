import React, { useState, useEffect } from 'react';
import type { QaPostCreateRequest, QaPostResponse } from '~/features/qna/types/qna';

interface Props {
  initial?: QaPostResponse;
  onSubmit: (data: QaPostCreateRequest | { content: string }) => void;
  loading: boolean;
}

export default function QnAForm({ initial, onSubmit, loading }: Props) {
  const [appointmentId, setAppointmentId] = useState(initial?.appointmentId ?? 0);
  const [content, setContent] = useState(initial?.content ?? '');

  useEffect(() => {
    if (initial) {
      setAppointmentId(initial.appointmentId);
      setContent(initial.content);
    }
  }, [initial]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (initial) onSubmit({ content });
        else onSubmit({ appointmentId, content });
      }}
      className="space-y-4"
    >
      {!initial && (
        <input
          type="number"
          placeholder="예약 ID"
          value={appointmentId}
          onChange={(e) => setAppointmentId(+e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      )}
      <textarea
        placeholder="질문을 작성하세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 border rounded h-32"
        required
      />
      <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">
        {loading ? '저장 중…' : initial ? '수정 완료' : '작성 완료'}
      </button>
    </form>
  );
}

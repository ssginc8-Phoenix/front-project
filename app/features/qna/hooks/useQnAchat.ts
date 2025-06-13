import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getQnADetail } from '~/features/qna/api/qnaAPI';
import {
  getCommentsByPost,
  createComment as apiCreateComment,
} from '~/features/qna/api/commentAPI';
import type { QaPostResponse } from '~/types/qna';
import type { CommentRequest, CommentResponse } from '~/types/comment';

export function useQnAchat(qnaId: number) {
  const qc = useQueryClient();
  const [draft, setDraft] = useState('');

  // 1) 질문 상세 조회
  const detailQuery = useQuery<QaPostResponse, Error>({
    queryKey: ['qnaDetail', qnaId],
    queryFn: () => getQnADetail(qnaId),
    staleTime: 1000 * 60 * 5,
  });

  // 2) 답변 목록 조회
  const commentsQuery = useQuery<CommentResponse[], Error>({
    queryKey: ['qnaComments', qnaId],
    queryFn: async () => {
      const res = await getCommentsByPost(qnaId);
      return res.data;
    },
    staleTime: 1000 * 60 * 2,
  });

  // 3) 답변 등록
  const createMutation = useMutation<CommentResponse, Error, CommentRequest>({
    mutationFn: (payload) => apiCreateComment(qnaId, payload).then((res) => res.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['qnaComments', qnaId] });
      setDraft('');
    },
  });

  // 4) 제출 핸들러
  const submit = () => {
    if (!draft.trim()) return;
    createMutation.mutate({ content: draft });
  };

  return {
    // 질문
    detail: detailQuery.data,
    isDetailLoading: detailQuery.isLoading,
    isDetailError: detailQuery.isError,

    // 댓글
    comments: commentsQuery.data,
    isCommentsLoading: commentsQuery.isLoading,
    isCommentsError: commentsQuery.isError,

    // 입력 폼
    draft,
    setDraft,

    // 등록
    submit,
    isSubmitting: createMutation,
  };
}

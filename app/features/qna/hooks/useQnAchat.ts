import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getQnADetail, updateQaPostStatus } from '~/features/qna/api/qnaAPI';
import {
  getCommentsByPost,
  createComment,
  updateComment,
  deleteComment,
} from '~/features/qna/api/commentAPI';
import type { QaPostResponse } from '~/types/qna';
import type { CommentRequest, CommentResponse } from '~/types/comment';

export function useQnAchat(qnaId: number, onClose?: () => void) {
  const qc = useQueryClient();
  const [draft, setDraft] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // 질문 상세
  const detailQuery = useQuery<QaPostResponse, Error>({
    queryKey: ['qnaDetail', qnaId],
    queryFn: () => getQnADetail(qnaId),
    enabled: !!qnaId,
    staleTime: 5 * 60 * 1000,
  });

  // 댓글 목록
  const commentsQuery = useQuery<CommentResponse[], Error>({
    queryKey: ['qnaComments', qnaId],
    queryFn: () => getCommentsByPost(qnaId),
    enabled: !!qnaId,
    staleTime: 2 * 60 * 1000,
  });

  // 댓글 등록
  const createMut = useMutation<CommentResponse, Error, CommentRequest>({
    mutationFn: (payload) => createComment(qnaId, payload),
  });

  // 댓글 수정
  const updateMut = useMutation<
    CommentResponse,
    Error,
    { commentId: number; payload: CommentRequest }
  >({
    mutationFn: async ({ commentId, payload }) => {
      const result = await updateComment(commentId, payload);
      return result.data;
    },
    onSuccess: () => {
      commentsQuery.refetch();
    },
  });

  // 댓글 삭제
  const deleteMut = useMutation<void, Error, number>({
    mutationFn: async (commentId) => {
      const result = await deleteComment(commentId);
      return result.data;
    },
    onSuccess: () => {
      commentsQuery.refetch();
    },
  });

  // 상태 변경
  const statusMut = useMutation({
    mutationFn: () => updateQaPostStatus(qnaId, 'COMPLETED'),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['doctorQnAs'] });
      qc.invalidateQueries({ queryKey: ['myQnAs'] });
      qc.invalidateQueries({ queryKey: ['qnaComments'] });
      setDraft('');
      setHasSubmitted(true);
      if (onClose) onClose();
    },
  });

  const submit = async () => {
    if (!draft.trim()) return;
    const detail = detailQuery.data;

    try {
      await createMut.mutateAsync({ content: draft });

      // 상태가 PENDING일 경우에만 업데이트
      if (detail?.status === 'PENDING') {
        await statusMut.mutateAsync();
      }

      await commentsQuery.refetch();
      setDraft('');
    } catch (err) {
      console.error('답변 등록 실패:', err);
    }
  };

  const update = async (commentId: number, content: string) => {
    try {
      await updateMut.mutateAsync({ commentId, payload: { content } });
    } catch (err) {
      console.error('답변 수정 실패:', err);
    }
  };

  const remove = async (commentId: number) => {
    try {
      await deleteMut.mutateAsync(commentId);
    } catch (err) {
      console.error('답변 삭제 실패:', err);
    }
  };

  const isSubmitting = createMut.isPending || statusMut.isPending;

  return {
    detail: detailQuery.data,
    isDetailLoading: detailQuery.isLoading,
    isDetailError: detailQuery.isError,

    comments: commentsQuery.data,
    isCommentsLoading: commentsQuery.isLoading,
    isCommentsError: commentsQuery.isError,

    draft,
    setDraft,
    submit,
    update,
    remove,
    isSubmitting,
    hasSubmitted,
    refetchComments: commentsQuery.refetch,
  };
}

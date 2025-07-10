import axios from 'axios';
import type { ActionResult } from '~/features/reviews/types/common';
import type { CommentRequest, CommentResponse } from '~/types/comment';

const host = 'http://localhost:8080/api/v1/qnas';

/**
 * 댓글 목록 조회
 */
export const getCommentsByPost = async (qnaId: number): Promise<CommentResponse[]> => {
  const res = await axios.get<CommentResponse[]>(`${host}/${qnaId}/comments`, {
    withCredentials: true,
  });
  return res.data;
};

/**
 * 댓글 생성
 */
export const createComment = async (
  qnaId: number,
  body: CommentRequest,
): Promise<CommentResponse> => {
  const res = await axios.post<{
    success: boolean;
    data: CommentResponse;
  }>(`${host}/${qnaId}/comments`, body, {
    withCredentials: true,
  });
  return res.data.data;
};

export async function updateComment(
  commentId: number,
  formData: CommentRequest,
): Promise<ActionResult<CommentResponse>> {
  const res = await axios.patch<ActionResult<CommentResponse>>(
    `${host}/comments/${commentId}`,
    formData,
    { withCredentials: true },
  );
  return res.data;
}

export async function deleteComment(commentId: number): Promise<ActionResult<void>> {
  const res = await axios.delete<ActionResult<void>>(`${host}/comments/${commentId}`, {
    withCredentials: true,
  });
  return res.data;
}

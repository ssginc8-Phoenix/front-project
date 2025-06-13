import axios from 'axios';
import type { ActionResult } from '~/features/reviews/types/common';
import type { CommentRequest, CommentResponse } from '~/types/comment';

const host = 'http://localhost:8080/api/v1/qnas';

/** 의사 답변 생성 */
export async function createComment(
  qnaId: number,
  formData: CommentRequest,
): Promise<ActionResult<CommentResponse>> {
  const res = await axios.post<ActionResult<CommentResponse>>(
    `${host}/${qnaId}/comments`,
    formData,
    { withCredentials: true },
  );
  return res.data;
}

/** 의사 답변 목록 조회 */
export async function getCommentsByPost(qnaId: number): Promise<ActionResult<CommentResponse[]>> {
  const res = await axios.get<ActionResult<CommentResponse[]>>(`${host}/${qnaId}/comments`, {
    withCredentials: true,
  });
  return res.data;
}

/** 의사 답변 수정 */
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

/** 의사 답변 삭제 */
export async function deleteComment(commentId: number): Promise<ActionResult<void>> {
  const res = await axios.delete<ActionResult<void>>(`${host}/comments/${commentId}`, {
    withCredentials: true,
  });
  return res.data;
}

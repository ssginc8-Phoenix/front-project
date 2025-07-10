import axios from 'axios';
import type { ActionResult } from '~/features/reviews/types/common';
import type { QaPostResponse } from '~/types/qna';
import type { Page } from '~/types/page';

const host = 'http://localhost:8080/api/v1/qnas';

// Q&A 삭제
export async function deleteQaPost(qnaId: number): Promise<ActionResult<void>> {
  const res = await axios.delete<ActionResult<void>>(`${host}/${qnaId}`, {
    withCredentials: true,
  });
  return res.data;
}

/**
 * 의사용: 상태별 질문 목록 조회 (페이징)
 */
export const getDoctorQnAs = async (
  status: 'PENDING' | 'COMPLETED',
  page: number,
  size: number,
): Promise<Page<QaPostResponse>> => {
  const res = await axios.get<Page<QaPostResponse>>(`${host}/doctor/posts`, {
    params: { status, page, size },
    withCredentials: true,
  });

  return res.data;
};

/**
 * Q&A 단건 조회
 */
export const getQnADetail = async (qnaId: number): Promise<QaPostResponse> => {
  const res = await axios.get<QaPostResponse>(`${host}/${qnaId}`, {
    withCredentials: true,
  });
  return res.data;
};

/**
 * Q&A 상태 변경 (PENDING ↔ COMPLETED)
 */
export const updateQaPostStatus = async (
  qnaId: number,
  status: 'PENDING' | 'COMPLETED',
): Promise<QaPostResponse> => {
  const res = await axios.patch<QaPostResponse>(
    `${host}/${qnaId}/status`,
    { status },
    { withCredentials: true },
  );
  return res.data;
};

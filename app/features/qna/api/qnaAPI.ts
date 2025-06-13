import axios from 'axios';
import type { ActionResult } from '~/features/reviews/types/common';
import type { QaPostResponse } from '~/types/qna';

const host = 'http://localhost:8080/api/v1/qnas';

// Q&A 삭제
export async function deleteQaPost(qnaId: number): Promise<ActionResult<void>> {
  const res = await axios.delete<ActionResult<void>>(`${host}/${qnaId}`, { withCredentials: true });
  return res.data;
}

// 단건 Q&A 조회
export async function getQnADetail(qnaId: number): Promise<QaPostResponse> {
  const { data } = await axios.get<QaPostResponse>(`${host}/${qnaId}`, { withCredentials: true });
  return data;
}

// 의사 Q&A 대기 목록 조회
export async function getDoctorQnAs(): Promise<ActionResult<QaPostResponse[]>> {
  return axios
    .get<ActionResult<QaPostResponse[]>>(host, { withCredentials: true })
    .then((res) => res.data);
}

import axios from 'axios';

import type { ActionResult } from '~/features/reviews/types/common';
import type {
  QaPostCreateRequest,
  QaPostResponse,
  QaPostUpdateRequest,
} from '~/features/qna/types/qna';

const host = 'http://localhost:8080/api/v1/qnas';

// Q&A 작성
export async function createQaPost(
  formData: QaPostCreateRequest,
): Promise<ActionResult<QaPostResponse>> {
  const res = await axios.post(`${host}`, formData, {
    withCredentials: true,
  });
  return res.data;
}

// Q&A 수정
export async function updateQaPost(
  qnaId: number,
  formData: QaPostUpdateRequest,
): Promise<ActionResult<QaPostResponse>> {
  const res = await axios.patch(`${host}/${qnaId}`, formData, {
    withCredentials: true,
  });
  return res.data;
}

// Q&A 삭제
export async function deleteQaPost(qnaId: number): Promise<ActionResult<void>> {
  const res = await axios.delete(`${host}/${qnaId}`, {
    withCredentials: true,
  });
  return res.data;
}

// 내가 작성한 Q&A 리스트 조회
export async function getMyQnAs(userId: number): Promise<ActionResult<QaPostResponse[]>> {
  const url = `${host}/user/${userId}/posts`;
  const res = await axios.get(url, {
    withCredentials: true,
  });
  return res.data;
}

// Q&A 상세 조회
export async function getQnADetail(qnaId: number): Promise<ActionResult<QaPostResponse>> {
  const res = await axios.get(`${host}/${qnaId}`, {
    withCredentials: true,
  });
  return res.data;
}

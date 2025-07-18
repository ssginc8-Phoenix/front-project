import axios from 'axios';
import type { ActionResult } from '~/features/reviews/types/common';

import type {
  ReviewCreateRequest,
  ReviewResponse,
  Page,
  ReviewMyListResponse,
  ReviewUpdateRequest,
  ReviewAllListResponse,
  HospitalReviewResponse,
  ReviewSummaryResponse,
} from '~/features/reviews/types/review';

const host = 'http://localhost:8080/api/v1/reviews';

// 리뷰 작성
export async function addReview(formData: ReviewCreateRequest): Promise<ActionResult<number>> {
  const res = await axios.post(`${host}`, formData, {
    withCredentials: true,
  });
  return res.data;
}

// 리뷰 수정
export async function editReview(
  reviewId: number,
  formData: ReviewUpdateRequest,
): Promise<ActionResult<ReviewResponse>> {
  const res = await axios.patch(`${host}/${reviewId}`, formData, {
    withCredentials: true,
  });
  return res.data;
}

// 리뷰 삭제
export async function deleteReview(reviewId: number): Promise<ActionResult<void>> {
  const res = await axios.delete(`${host}/${reviewId}`, {
    withCredentials: true,
  });
  return res.data;
}

// 나의 리뷰 페이징 조회
export async function getMyReviews(
  page: number,
  size: number,
): Promise<Page<ReviewMyListResponse>> {
  const url = 'http://localhost:8080/api/v1/users/me/reviews';
  const res = await axios.get<Page<ReviewMyListResponse>>(url, {
    params: { page, size },
    withCredentials: true,
  });
  return res.data;
}

// 관리자 전체 리뷰 조회
export async function getAllReviews(
  page: number,
  size: number,
): Promise<Page<ReviewAllListResponse>> {
  const url = 'http://localhost:8080/api/v1/admin/reviews';
  const res = await axios.get(`${url}?page=${page}&size=${size}`, {
    withCredentials: true,
  });
  return res.data;
}

// 병원별 리뷰 페이징 조회
export async function getHospitalReviews(
  hospitalId: number,
  page: number,
  size: number,
): Promise<Page<HospitalReviewResponse>> {
  const url = `http://localhost:8080/api/v1/hospitals/${hospitalId}/reviews`;
  const res = await axios.get(`${url}?page=${page}&size=${size}`, {
    withCredentials: true,
  });
  return res.data;
}

// 리뷰 신고 기능
export async function reportReview(reviewId: number, reason: string): Promise<void> {
  await axios.post(`http://localhost:8080/api/v1/reviews/${reviewId}/report`, null, {
    params: { reason },
    withCredentials: true,
  });
}

// 병원 리뷰 AI 요약
export async function getReviewSummary(hospitalId: number): Promise<ReviewSummaryResponse> {
  const url = `http://localhost:8080/api/v1/hospitals/${hospitalId}/reviews/summary`;
  const res = await axios.get<ReviewSummaryResponse>(url, {
    withCredentials: true,
  });
  return res.data;
}

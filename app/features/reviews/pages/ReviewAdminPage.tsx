import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import Pagination from '~/components/common/Pagination';
import { getAllReviews } from '~/features/reviews/api/reviewAPI';
import type {
  HospitalReviewResponse,
  Page,
  ReviewAllListResponse,
} from '~/features/reviews/types/review';
import { HospitalReviewCard } from '~/features/reviews/component/common/HospitalReviewCard';

export default function ReviewAdminPage() {
  const [page, setPage] = useState(0);
  const [data, setData] = useState<Page<ReviewAllListResponse> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getAllReviews(page, 10)
      .then((res) => setData(res))
      .catch(() => setError('리뷰 불러오는 중 오류가 발생했습니다.'))
      .finally(() => setLoading(false));
  }, [page]);

  if (loading) return <div>로딩 중…</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  const reviews = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <PageWrapper>
      <Header>
        <Title>전체 리뷰 목록</Title>
      </Header>
      <Divider />

      {reviews.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#6b7280' }}>등록된 리뷰가 없습니다.</p>
      ) : (
        reviews.map((r) => (
          <ReviewItem key={r.reviewId}>
            <HospitalReviewCard review={r} onReport={() => {}} />
          </ReviewItem>
        ))
      )}

      {totalPages > 1 && (
        <PaginationWrapper>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </PaginationWrapper>
      )}
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #00499e;
  margin: 0;
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background-color: #e5e7eb;
  margin: 1rem 0;
`;

const ReviewItem = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

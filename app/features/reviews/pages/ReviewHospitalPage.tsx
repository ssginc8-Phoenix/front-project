import React, { useState } from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';

import Pagination from '~/components/common/Pagination';
import { useHospitalReviews } from '~/features/reviews/hooks/useHospitalReviews';
import type { HospitalReviewResponse } from '~/features/reviews/types/review';
import { reportReview } from '~/features/reviews/api/reviewAPI';
import { HospitalReviewCard } from '~/features/reviews/component/common/HospitalReviewCard';

export default function ReviewHospitalPage() {
  const { hospitalId } = useParams<{ hospitalId: string }>();
  const [page, setPage] = useState(0);

  const { reviews, pagination, loading, error } = useHospitalReviews(Number(hospitalId), page);

  const handleReport = async (reviewId: number) => {
    try {
      await reportReview(reviewId);
      setPage(0);
    } catch {
      alert('신고 중 오류가 발생했습니다.');
    }
  };

  if (loading) return <div>로딩 중…</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <PageWrapper>
      <Header>
        <Title>📍 전체 리뷰 조회</Title>
      </Header>
      <Divider />

      {reviews.map((r: HospitalReviewResponse) => (
        <div key={r.reviewId} style={{ position: 'relative' }}>
          <HospitalReviewCard review={r} onReport={() => handleReport(r.reviewId)} />
        </div>
      ))}

      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={setPage}
        />
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

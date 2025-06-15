import React, { useState } from 'react';
import { useParams } from 'react-router';
import styled from 'styled-components';

import Pagination from '~/components/common/Pagination';
import { useHospitalReviews } from '~/features/reviews/hooks/useHospitalReviews';
import type { HospitalReviewResponse } from '~/features/reviews/types/review';
import { reportReview } from '~/features/reviews/api/reviewAPI';
import { HospitalReviewCard } from '~/features/reviews/component/common/HospitalReviewCard';
import { ReportModal } from '~/features/reviews/component/common/ReportModal';

export default function ReviewHospitalPage() {
  const { hospitalId } = useParams<{ hospitalId: string }>();
  const [page, setPage] = useState(0);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { reviews, pagination, loading, error } = useHospitalReviews(Number(hospitalId), page, 5);

  const handleReport = (reviewId: number) => {
    setSelectedReviewId(reviewId);
    setIsModalOpen(true);
  };

  const handleConfirmReport = async (reason: string) => {
    if (selectedReviewId === null) return;
    try {
      await reportReview(selectedReviewId, reason);
      alert('신고가 완료되었습니다.');
      setIsModalOpen(false);
      setPage(0); // 새로고침
    } catch {
      alert('신고 처리 중 오류가 발생했습니다.');
    }
  };

  if (loading) return <div>로딩 중…</div>;
  if (error) return <ErrorText>{error}</ErrorText>;

  return (
    <PageWrapper>
      <Header>
        <Title>📋 병원 리뷰 목록</Title>
      </Header>
      <Divider />

      {reviews.length === 0 ? (
        <EmptyMessage>아직 등록된 리뷰가 없습니다.</EmptyMessage>
      ) : (
        reviews.map((r: HospitalReviewResponse) => (
          <CardWrapper key={r.reviewId}>
            <HospitalReviewCard review={r} onReport={handleReport} />
          </CardWrapper>
        ))
      )}

      {pagination.totalPages > 1 && (
        <PaginationWrapper>
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        </PaginationWrapper>
      )}

      {isModalOpen && selectedReviewId !== null && (
        <ReportModal
          reviewId={selectedReviewId}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmReport}
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

const EmptyMessage = styled.p`
  text-align: center;
  color: #6b7280;
  margin-top: 2rem;
`;

const ErrorText = styled.div`
  color: red;
  text-align: center;
`;

const CardWrapper = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

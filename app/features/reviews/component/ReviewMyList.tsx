import React from 'react';
import type { ReviewMyListResponse } from '~/features/reviews/types/review';
import { ReviewCard } from './common/ReviewCard';
import { Pagination } from './common/Pagination';

interface ReviewMyListComponentProps {
  reviews: ReviewMyListResponse[];
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  onPageChange: (newPage: number) => void;
  onDeleteReview: (id: number) => void;
  onEditReview: (review: ReviewMyListResponse) => void;
}

export function ReviewMyListComponent({
  reviews,
  currentPage,
  totalPages,
  loading,
  error,
  onPageChange,
  onDeleteReview,
  onEditReview,
}: ReviewMyListComponentProps) {
  if (loading) {
    return <div className="p-4 text-center">로딩 중...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500 text-center">{error}</div>;
  }

  if (reviews.length === 0) {
    return <div className="text-center text-gray-500">작성한 리뷰가 없습니다.</div>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewCard
          key={review.reviewId}
          review={review}
          onEdit={() => onEditReview(review)}
          onDelete={() => onDeleteReview(review.reviewId)}
        />
      ))}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(newPage: number) => onPageChange(newPage)}
        />
      )}
    </div>
  );
}

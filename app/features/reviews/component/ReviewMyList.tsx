import React from 'react';
import type { ReviewMyListResponse } from '~/features/reviews/types/review';
import { ReviewCard } from '~/features/reviews/component/common/ReviewCard';
import Pagination from '~/components/common/Pagination';
import styled from 'styled-components';

interface ReviewMyListProps {
  reviews: ReviewMyListResponse[];
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  onEditReview: (review: ReviewMyListResponse) => void;
  onDeleteReview: (review: ReviewMyListResponse) => void;
  onDetailReview: (review: ReviewMyListResponse) => void;
}

export function ReviewMyListComponent({
  reviews,
  currentPage,
  totalPages,
  onPageChange,
  onEditReview,
  onDeleteReview,
  onDetailReview,
}: ReviewMyListProps) {
  return (
    <ListContainer>
      {reviews.map((review) => (
        <ReviewCard
          key={review.reviewId}
          review={review}
          onClick={() => onDetailReview(review)}
          onEdit={() => onEditReview(review)}
          onDelete={() => onDeleteReview(review)}
        />
      ))}

      <PaginationWrapper>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      </PaginationWrapper>
    </ListContainer>
  );
}

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
`;

import { useAsync } from '~/hooks/useAsync';
import * as reviewAPI from '~/features/reviews/api/reviewAPI';
import type { Page, ReviewMyListResponse } from '~/features/reviews/types/review';

export function useReviewList(page: number, size: number = 10, refreshTrigger?: number) {
  const { data, loading, error } = useAsync<Page<ReviewMyListResponse>>(
    () => reviewAPI.getMyReviews(page, size),
    [page, size, refreshTrigger],
  );

  return {
    reviews: data?.content ?? [],
    totalPages: data?.totalPages ?? 0,
    loading,
    error,
  };
}

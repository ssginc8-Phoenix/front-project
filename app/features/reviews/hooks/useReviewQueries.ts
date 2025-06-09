import { useQuery } from '@tanstack/react-query';
import { getAllReviews } from '~/features/reviews/api/reviewAPI';
import type { Page, ReviewAllListResponse } from '~/features/reviews/types/review';
import type { ActionResult } from '~/features/reviews/types/common';

export const useAdminReviews = (page: number) =>
  useQuery<ActionResult<Page<ReviewAllListResponse>>, Error>({
    queryKey: ['adminReviews', page],
    queryFn: () => getAllReviews(page, 10),
    staleTime: 5_000,
  });

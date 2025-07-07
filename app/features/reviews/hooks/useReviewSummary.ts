import { useQuery } from '@tanstack/react-query';
import { getReviewSummary } from '~/features/reviews/api/reviewAPI';

export const useReviewSummary = (hospitalId: number) =>
  useQuery({
    queryKey: ['reviewSummary', hospitalId],
    queryFn: () => getReviewSummary(hospitalId),
    staleTime: 1000 * 60 * 5,
  });

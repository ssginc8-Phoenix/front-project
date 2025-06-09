import { useAsync } from '../../../../hooks/useAsync';

import { getReview } from '../../api/hospitalAPI';
import { useCallback } from 'react';
import type { Review } from '../../types/review';

export const useReviews = (hospitalId: number) => {
  const fetchReviews = useCallback(() => getReview(hospitalId), [hospitalId]);
  const { data, loading, error } = useAsync<Review[]>(fetchReviews, [fetchReviews]);

  return { data, loading, error };
};

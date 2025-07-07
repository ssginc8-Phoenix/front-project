import { getReview } from '../../api/hospitalAPI';
import { useCallback } from 'react';
import type { Review } from '../../types/review';
import { useHospitalAsync } from '~/features/hospitals/hooks/useHospitalAsync';

export const useReviews = (hospitalId: number) => {
  const fetchReviews = useCallback(() => getReview(hospitalId), [hospitalId]);
  const { data, loading, error } = useHospitalAsync<Review[]>(fetchReviews, [fetchReviews]);

  return { data, loading, error };
};

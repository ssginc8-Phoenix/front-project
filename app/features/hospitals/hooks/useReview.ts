// features/hospitals/hooks/useHospital.ts

import type { Hospital } from '../types/hospital';
import { useAsync } from '../../../hooks/useAsync';
import { getReview } from '../api/getHospitals';

export const useReview = (hospitalId: number) => {
  const { data, loading, error } = useAsync<Hospital>(() => getReview(hospitalId), [hospitalId]);
  return { data, loading, error };
};

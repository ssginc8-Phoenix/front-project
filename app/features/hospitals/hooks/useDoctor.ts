import { useAsync } from '../../../hooks/useAsync';
import { getDoctor } from '../api/hospitalAPI';
import type { PagedDoctorResponse } from '../types/doctor';
import { useCallback } from 'react';

export const useDoctor = (hospitalId: number) => {
  const fetchDoctor = useCallback(() => getDoctor(hospitalId), [hospitalId]);

  const { data, loading, error } = useAsync<PagedDoctorResponse>(fetchDoctor, [fetchDoctor]);

  return { data, loading, error };
};

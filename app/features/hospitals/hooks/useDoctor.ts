import { getDoctor } from '../api/hospitalAPI';
import type { PagedDoctorResponse } from '../types/doctor';
import { useCallback } from 'react';
import { useHospitalAsync } from '~/features/hospitals/hooks/useHospitalAsync';

export const useDoctor = (hospitalId: number) => {
  const fetchDoctor = useCallback(() => getDoctor(hospitalId), [hospitalId]);

  const { data, loading, error } = useHospitalAsync<Doctor[]>(fetchDoctor, [fetchDoctor]);

  return { data, loading, error };
};

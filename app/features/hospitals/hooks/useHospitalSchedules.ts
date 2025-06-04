// features/hospitals/hooks/useHospital.ts

import type { Hospital } from '../types/hospital';
import { useAsync } from '../../../hooks/useAsync';
import { getHospitalSchedules } from '../api/getHospitals';

export const useHospitalSchedules = (hospitalId: number) => {
  const { data, loading, error } = useAsync<Hospital>(
    () => getHospitalSchedules(hospitalId),
    [hospitalId],
  );
  return { data, loading, error };
};

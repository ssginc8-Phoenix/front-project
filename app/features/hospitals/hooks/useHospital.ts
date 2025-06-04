// features/hospitals/hooks/useHospital.ts

import type { Hospital, HospitalPage } from '../types/hospital';
import { getHospital, getHospitals } from '../api/getHospitals';
import { useAsync } from '../../../hooks/useAsync';

export const useHospital = (hospitalId: number) => {
  const { data, loading, error } = useAsync<Hospital>(() => getHospital(hospitalId), [hospitalId]);
  return { data, loading, error };
};

export const useHospitals = () => {
  const { data, loading, error } = useAsync<HospitalPage>(() => getHospitals(), []);
  return { hospitals: data?.content ?? null, isLoading: loading, error };
};

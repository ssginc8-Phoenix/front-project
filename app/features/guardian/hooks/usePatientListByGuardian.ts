import { useAsync } from '~/hooks/useAsync';
import { getPatientListByGuardian } from '~/features/guardian/api/guardianAPI';
import type { Patient } from '~/features/patient/types/patient';

export const usePatientListByGuardian = () => {
  const { data, loading, error } = useAsync<Patient[]>(getPatientListByGuardian, []);

  return { data: data ?? [], loading, error };
};

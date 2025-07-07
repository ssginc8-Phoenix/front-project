import { useAsync } from '~/hooks/useAsync';
import { getGuardianPatients } from '~/features/guardian/api/guardianAPI';
import type { Patient } from '~/types/patient';

export const usePatientListByGuardian = () => {
  const { data, loading, error } = useAsync<Patient[]>(getGuardianPatients, []);

  return { data: data ?? [], loading, error };
};

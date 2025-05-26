import type { Patient } from '~/features/patient/types/Patient';
import { getPatientList } from '~/features/patient/api/patientAPI';
import { useAsync } from '~/hooks/useAsync';

export const usePatientList = () => {
  const { data, loading, error } = useAsync<Patient[]>(getPatientList, []);

  return { data: data ?? [], loading, error };
};

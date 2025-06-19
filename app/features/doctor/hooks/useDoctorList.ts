import { useAsync } from '~/hooks/useAsync';
import { getDoctorList } from '~/features/doctor/api/doctorAPI';
import type { Doctor } from '~/types/doctor';

export const useDoctorList = (hospitalId: number) => {
  const { data, loading, error } = useAsync<Doctor[]>(
    () => getDoctorList(hospitalId),
    [hospitalId],
  );
  return { data: data ?? [], loading, error };
};

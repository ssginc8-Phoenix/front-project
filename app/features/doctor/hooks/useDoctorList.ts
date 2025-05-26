import type { Doctor } from '~/features/doctor/types/Doctor';
import { useAsync } from '~/hooks/useAsync';
import { getDoctorList } from '~/features/doctor/api/doctorAPI';

export const useDoctorList = (hospitalId: number) => {
  const { data, loading, error } = useAsync<Doctor[]>(
    () => getDoctorList(hospitalId),
    [hospitalId], // hospitalId가 바뀌면 다시 요청
  );
  return { data: data ?? [], loading, error };
};

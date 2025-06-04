import { useAsync } from '~/hooks/useAsync';
import { getDoctorList } from '~/features/doctor/api/doctorAPI';
import type { Doctor } from '~/types/doctor';

export const useDoctorList = (hospitalId: number) => {
  const { data, loading, error } = useAsync<Doctor[]>(
    () => getDoctorList(hospitalId),
    [hospitalId], // hospitalId가 바뀌면 다시 요청
  );
  return { data: data ?? [], loading, error };
};

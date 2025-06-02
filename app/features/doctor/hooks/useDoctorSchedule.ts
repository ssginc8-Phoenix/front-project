import { useAsync } from '~/hooks/useAsync';
import { getDoctorSchedules } from '~/features/doctor/api/doctorAPI';
import type { DoctorSchedule } from '~/types/doctor';

export const useDoctorSchedule = (doctorId: number) => {
  const { data, loading, error } = useAsync<DoctorSchedule[]>(
    () => getDoctorSchedules(doctorId),
    [doctorId], // doctorId가 바뀌면 다시 요청
  );
  return { data: data ?? [], loading, error };
};

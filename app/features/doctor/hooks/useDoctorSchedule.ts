import { getDoctorSchedules } from '~/features/doctor/api/doctorAPI';
import type { DoctorSchedule } from '~/types/doctor';
import { useQuery } from '@tanstack/react-query';

export const useDoctorSchedule = (doctorId: number | null) => {
  return useQuery<DoctorSchedule[]>({
    queryKey: ['doctorSchedules', doctorId],
    queryFn: () => getDoctorSchedules(doctorId as number),
    enabled: doctorId !== null,
    staleTime: 1000 * 60 * 5,
    select: (data) => data ?? [],
  });
};

import { getDoctorSchedules } from '~/features/doctor/api/doctorAPI';
import type { DoctorSchedule } from '~/types/doctor';
import { useQuery } from '@tanstack/react-query';

interface DoctorScheduleHookResult {
  workingDays: number[]; // 의사가 근무하는 요일 숫자들의 배열
}

export const useDoctorSchedule = (doctorId: number | null) => {
  return useQuery<DoctorSchedule[], Error, DoctorScheduleHookResult>({
    queryKey: ['doctorSchedules', doctorId],
    queryFn: () => getDoctorSchedules(doctorId as number),
    enabled: doctorId !== null,
    staleTime: 1000 * 60 * 5,
    select: (data) => {
      const workingDays: number[] = [];

      // 요일 문자열을 dayjs 요일 숫자로 매핑하는 맵
      const dayOfWeekMap: { [key: string]: number } = {
        SUNDAY: 0,
        MONDAY: 1,
        TUESDAY: 2,
        WEDNESDAY: 3,
        THURSDAY: 4,
        FRIDAY: 5,
        SATURDAY: 6,
      };

      data?.forEach((schedule) => {
        const dayjsDayOfWeek = dayOfWeekMap[schedule.dayOfWeek];
        if (dayjsDayOfWeek != undefined) {
          workingDays.push(dayjsDayOfWeek);
        }
      });

      return { workingDays };
    },
  });
};

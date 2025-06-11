import { useQuery } from '@tanstack/react-query';
import type { CalendarRequest, DoctorCalendarResponse } from '~/features/doctor/types/calendar';
import { getDoctorCalendar } from '~/features/doctor/api/doctorAPI';

export const useDoctorCalendar = (params: CalendarRequest) => {
  return useQuery<DoctorCalendarResponse>({
    queryKey: ['doctorCalendar', params],
    queryFn: () => getDoctorCalendar(params),
    enabled: !!params.startDate && !!params.endDate, // 날짜 둘 다 있어야 fetch
    staleTime: 1000 * 60 * 5, // 5분간 캐싱
  });
};

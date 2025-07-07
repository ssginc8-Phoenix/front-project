import { getAppointment } from '~/features/appointment/api/appointmentAPI';
import type { Appointment } from '~/types/appointment';
import { useQuery } from '@tanstack/react-query';

export const useAppointmentDetail = (appointmentId: number) => {
  return useQuery<Appointment>({
    queryKey: ['appointmentDetail', appointmentId],
    queryFn: () => getAppointment(appointmentId),
    enabled: !!appointmentId,
  });
};

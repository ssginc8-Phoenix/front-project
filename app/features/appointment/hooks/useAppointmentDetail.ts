import { useAsync } from '~/hooks/useAsync';
import { getAppointment } from '~/features/appointment/api/appointmentAPI';
import type { Appointment } from '~/types/appointment';

export const useAppointmentDetail = (appointmentId: number) => {
  const { data, loading, error } = useAsync<Appointment>(
    () => getAppointment(appointmentId),
    [appointmentId],
  );

  return { data, loading, error };
};

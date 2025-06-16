import { useAsync } from '~/hooks/useAsync';
import type { TimeSlot } from '~/types/appointment';
import { getAvailableTimeSlots } from '~/features/appointment/api/appointmentAPI';

export const useTimeSlots = (
  doctorId: number | null,
  patientId: number | null,
  date: string | null,
) => {
  const shouldFetch = !!doctorId && !!patientId && !!date;

  const { data, loading, error } = useAsync<TimeSlot[]>(
    () => (shouldFetch ? getAvailableTimeSlots(doctorId!, patientId!, date!) : Promise.resolve([])),
    [doctorId, date],
  );

  return {
    list: data ?? [],
    loading,
    error,
  };
};

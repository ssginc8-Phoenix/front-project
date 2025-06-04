import { useAsync } from '~/hooks/useAsync';
import type { TimeSlot } from '~/types/appointment';
import { getAvailableTimeSlots } from '~/features/appointment/api/appointmentAPI';

export const useTimeSlots = (doctorId: number | null, date: string | null) => {
  const shouldFetch = !!doctorId && !!date;

  const { data, loading, error } = useAsync<TimeSlot[]>(
    () => (shouldFetch ? getAvailableTimeSlots(doctorId!, date!) : Promise.resolve([])),
    [doctorId, date],
  );

  return {
    list: data ?? [],
    loading,
    error,
  };
};

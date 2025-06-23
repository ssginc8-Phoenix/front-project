import { useAsync } from '~/hooks/useAsync';
import type { TimeSlot } from '~/types/appointment';
import { getAvailableTimeSlots } from '~/features/appointment/api/appointmentAPI';
import { useQuery } from '@tanstack/react-query';

interface UseTimeSlotsOptions {
  enabled?: boolean;
}

export const useTimeSlots = (
  doctorId: number | null,
  patientId: number | null,
  date: string | null,
  options: UseTimeSlotsOptions,
) => {
  const queryKey = ['availableTimeSlots', doctorId, patientId, date];

  const { data, isLoading, isError, error, isFetching } = useQuery<TimeSlot[], Error>({
    queryKey: queryKey,
    queryFn: () => getAvailableTimeSlots(doctorId!, patientId!, date!),
    enabled: !!doctorId && !!patientId && !!date && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 5,
  });

  return {
    list: data ?? [],
    loading: isLoading || isFetching,
    error: isError ? error?.message : null,
  };
};

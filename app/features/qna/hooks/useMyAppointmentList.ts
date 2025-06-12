import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { Page } from '~/types/page';
import type { AppointmentList } from '~/types/appointment';

export function useMyAppointmentList(page: number, size: number) {
  return useQuery<Page<AppointmentList>, Error>({
    queryKey: ['myAppointmentList', page, size] as const,
    queryFn: async () => {
      const { data } = await axios.get<Page<AppointmentList>>('/api/v1/users/me/appointments', {
        params: { page, size },
        withCredentials: true,
      });
      return data;
    },
    enabled: true,
  });
}

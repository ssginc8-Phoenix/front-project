import { useAsync } from '~/hooks/useAsync';
import { getAppointmentList } from '~/features/appointment/api/appointmentAPI';
import type { AppointmentListPage } from '~/types/appointment';

export const useAppointmentList = (page: number, size: number = 5) => {
  const { data, loading, error } = useAsync<AppointmentListPage>(
    () => getAppointmentList(page, size),
    [page, size],
  );

  return {
    list: data?.content ?? [],
    pagination: {
      totalPages: data?.totalPages ?? 0,
      currentPage: data?.number ?? 0,
    },
    loading,
    error,
  };
};

export const useAppointmentDashboard = (
  page: number = 0,
  size: number = 10,
  date?: string,
  refreshTrigger?: boolean,
) => {
  const { data, loading, error } = useAsync<AppointmentListPage>(
    () => getAppointmentList(page, size, date),
    [page, size, date, refreshTrigger],
  );

  return {
    list: data?.content ?? [],
    pagination: {
      totalPages: data?.totalPages ?? 0,
      currentPage: data?.number ?? 0,
    },
    loading,
    error,
  };
};

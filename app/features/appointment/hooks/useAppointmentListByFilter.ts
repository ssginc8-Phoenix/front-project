import { useQuery } from '@tanstack/react-query';
import {
  getActiveAppointmentList,
  getInactiveAppointmentList,
} from '~/features/appointment/api/appointmentAPI';
import type { AppointmentListPage } from '~/types/appointment';

/**
 * 활성 예약 목록을 가져오는 React Query 커스텀 훅
 */
export const useAppointmentListByFilter = (
  filterType: 'active' | 'inactive',
  page: number = 0,
  size: number = 10,
  date?: string,
  refreshTrigger?: boolean,
) => {
  // filterType에 따라 호출할 API 함수를 선택
  const queryFn = filterType === 'active' ? getActiveAppointmentList : getInactiveAppointmentList;

  // queryKey에 filterType과 refreshTrigger를 포함시켜 변경 시 쿼리 재실행 및 캐시 분리
  const queryKey = [`${filterType}Appointments`, page, size, date, refreshTrigger];

  const { data, isLoading, error, isRefetching, refetch } = useQuery<AppointmentListPage, Error>({
    queryKey: queryKey,
    queryFn: () => queryFn(page, size, date),
    placeholderData: (previousData: AppointmentListPage | undefined) => previousData,
    enabled: true,
  });

  return {
    list: data?.content ?? [],
    pagination: {
      totalPages: data?.totalPages ?? 0,
      currentPage: data?.number ?? 0,
    },
    loading: isLoading,
    error: error instanceof Error ? error.message : null,
    isRefetching,
    refetch,
  };
};

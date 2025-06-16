import { useQuery } from '@tanstack/react-query';
import { getDoctorQnAs } from '~/features/qna/api/qnaAPI';
import type { QaPostResponse } from '~/types/qna';
import type { Page } from '~/types/page';

export function useDoctorQnAs(status: 'PENDING' | 'COMPLETED', page: number, size: number) {
  return useQuery<Page<QaPostResponse>, Error>({
    queryKey: ['doctorQnAs', status, page, size],
    queryFn: () => getDoctorQnAs(status, page, size),
    staleTime: 5 * 60 * 1000,
  });
}

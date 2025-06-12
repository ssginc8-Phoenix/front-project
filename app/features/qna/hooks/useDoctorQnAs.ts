import { useQuery } from '@tanstack/react-query';
import { getDoctorQnAs } from '~/features/qna/api/qnaAPI';
import type { QaPostResponse } from '~/types/qna';

export function useDoctorQnAs() {
  return useQuery<QaPostResponse[], Error>({
    queryKey: ['doctorQnAs'],
    queryFn: () => getDoctorQnAs().then((r) => r.data),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}

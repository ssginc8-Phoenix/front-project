import { useCallback } from 'react';
import type { HospitalPage } from '../types/hospital';
import { useHospitalAsync } from '~/features/hospitals/hooks/useHospitalAsync';

const emptyPage: HospitalPage = {
  content: [],
  totalPages: 0,
  totalElements: 0,
  number: 0,
  size: 0,
  first: true,
  last: true,
};

export const useGlobalHospitalSearch = (
  query: string,
  page: number,
  size: number = 10,
  searchTrigger: number = 0,
  enabled: boolean = true, // ✅ 추가
) => {
  const fetchHospitals = useCallback(async (): Promise<HospitalPage> => {
    if (!enabled) {
      // ✅ 조건에 맞지 않으면 빈 결과 반환
      return emptyPage;
    }

    const params = new URLSearchParams({
      query,
      page: page.toString(),
      size: size.toString(),
    });

    const response = await fetch(`/api/v1/hospitals/search?${params.toString()}`);
    if (!response.ok) throw new Error('전체 병원 검색 실패');

    return response.json();
  }, [query, page, size, searchTrigger, enabled]);

  return useHospitalAsync<HospitalPage>(fetchHospitals, [fetchHospitals]);
};

import { useAsync } from '../../../hooks/useAsync';
import { useCallback } from 'react';
import type { HospitalPage } from '../types/hospital';

export const useGlobalHospitalSearch = (query: string, page: number, size: number = 10) => {
  const fetchHospitals = useCallback(async (): Promise<HospitalPage> => {
    const params = new URLSearchParams({
      query,
      page: page.toString(),
      size: size.toString(),
    });
    const response = await fetch(`/api/v1/hospitals/search?${params.toString()}`);
    if (!response.ok) throw new Error('전체 병원 검색 실패');
    return response.json();
  }, [query, page, size]); // useCallback으로 감싸서 의존성 관리

  return useAsync<HospitalPage>(fetchHospitals);
};

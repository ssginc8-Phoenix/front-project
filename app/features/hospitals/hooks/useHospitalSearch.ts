import { useCallback, useEffect } from 'react';

import type { Hospital } from '../types/hospital';
import { useHospitalAsync } from '~/features/hospitals/hooks/useHospitalAsync';

interface HospitalPage {
  content: Hospital[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export const useHospitalSearch = (
  latitude: number | null,
  longitude: number | null,
  searchQuery: string,
  sortBy: string,
  radius: number = 5,
  isNearbyMode: boolean,
) => {
  const fetchHospitals = useCallback(async (): Promise<HospitalPage> => {
    if (latitude === null || longitude === null) {
      return {
        content: [],
        totalPages: 0,
        totalElements: 0,
        number: 0,
        size: 0,
        first: true,
        last: true,
      };
    }

    console.log('📍[내 주변 검색] API 요청 시작:', {
      latitude,
      longitude,
      radius,
      searchQuery,
      sortBy,
    });

    const params = new URLSearchParams({
      lat: latitude.toString(),
      lng: longitude.toString(),
      radius: radius.toString(),
      query: searchQuery, // 백에서 쿼리 처리하는 경우
    });

    const response = await fetch(`/api/v1/hospitals?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`병원 검색 실패: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('📍[내 주변 검색] API 응답 수신:', data);
    return data;
  }, [latitude, longitude, searchQuery, sortBy, radius]);

  const { data, loading, error, execute } = useHospitalAsync<HospitalPage>(fetchHospitals);

  useEffect(() => {
    if (isNearbyMode && latitude !== null && longitude !== null) {
      execute();
    }
  }, [execute, latitude, longitude, searchQuery, sortBy, radius, isNearbyMode]);

  return { data, loading, error, refetch: execute };
};

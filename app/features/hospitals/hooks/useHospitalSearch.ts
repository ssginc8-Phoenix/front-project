import { useCallback } from 'react';
import { useAsync } from '../../../hooks/useAsync';
import type { Hospital } from '../types/hospital'; // useAsync 훅 임포트

// 이 HospitalPage와 Hospital 타입은 실제 HospitalSearchPage에서 사용하는 것과 동일해야 합니다.

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
  specialization: string,
  sortBy: string,
  radius: number = 500,
) => {
  // ✅ API 호출 함수를 useCallback으로 감싸고, 모든 의존성을 명시
  // 이 함수는 latitude, longitude, searchQuery, specialization, sortBy 중 하나라도 변할 때만 재생성됩니다.
  const fetchHospitals = useCallback(async (): Promise<HospitalPage> => {
    if (latitude === null || longitude === null) {
      // 위치 정보가 없을 때는 API 호출을 건너뛸 수 있습니다.
      // 또는 기본 위치로 검색을 수행하도록 로직을 추가할 수 있습니다.
      // 여기서는 빈 페이지를 반환하도록 가정합니다.
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

    console.log('병원 검색 API 요청 시작:', {
      latitude,
      longitude,
      searchQuery,
      specialization,
      sortBy,
    }); // 이 로그가 반복되는지 확인
    const params = new URLSearchParams({
      lat: latitude.toString(),
      lng: longitude.toString(),
      radius: radius.toString(),
      query: searchQuery,
      sortBy: sortBy,
      // page, size 등 필요한 다른 파라미터 추가
    });
    console.log(searchQuery);
    // TODO: 실제 백엔드 API 엔드포인트로 변경하세요.
    const response = await fetch(`/api/v1/hospitals/search?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`병원 검색 실패: ${response.statusText}`);
    }
    const data = await response.json();
    console.log('병원 검색 API 응답 수신:', data); // 응답 확인
    console.log('응답 상태:', response.status);
    console.log('응답 OK 여부:', response.ok);
    console.log('응답 전체:', response);

    return data;
  }, [latitude, longitude, searchQuery, sortBy]); // ✅ 모든 검색 파라미터를 의존성으로 명시

  // useAsync 훅에 메모이제이션된 fetchHospitals 함수를 전달
  // useAsync 훅 내부의 useEffect는 이제 fetchHospitals가 변경될 때만 실행됩니다.
  const { data, loading, error, execute } = useAsync<HospitalPage>(fetchHospitals);

  return { data, loading, error, refetch: execute };
};

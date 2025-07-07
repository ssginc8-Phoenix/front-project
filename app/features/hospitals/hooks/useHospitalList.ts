import { useCallback } from 'react';
import type { Hospital, HospitalPage } from '../types/hospital';
import { useHospitalAsync } from '~/features/hospitals/hooks/useHospitalAsync';

export const useHospitalList = (
  latitude: number | null,
  longitude: number | null,
  searchQuery: string,
  specialization: string,
  sortBy: string,
  pageNumber: number = 0,
  pageSize: number = 20,
) => {
  const fetchHospitals = useCallback(async (): Promise<HospitalPage> => {
    const response = await fetch('/api/v1/admin/hospitals');
    if (!response.ok) {
      throw new Error(`전체 병원 목록 불러오기 실패: ${response.statusText}`);
    }
    const allHospitals: Hospital[] = await response.json();

    let filteredHospitals = allHospitals;

    if (searchQuery) {
      filteredHospitals = filteredHospitals.filter((h) =>
        h.hospitalName.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (specialization) {
      filteredHospitals = filteredHospitals.filter((h) =>
        h.specialization.toLowerCase().includes(specialization.toLowerCase()),
      );
    }

    if (latitude !== null && longitude !== null) {
      const toRad = (deg: number) => (deg * Math.PI) / 180;
      const R = 6371e3;

      filteredHospitals = filteredHospitals.map((h) => {
        const lat1 = toRad(latitude);
        const lon1 = toRad(longitude);
        const lat2 = toRad(h.latitude);
        const lon2 = toRad(h.longitude);

        const dLat = lat2 - lat1;
        const dLon = lon2 - lon1;

        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = R * c;
        return { ...h, distance };
      });

      if (sortBy === 'distance') {
        filteredHospitals = filteredHospitals.sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
      }
    }

    if (sortBy === 'rating') {
      filteredHospitals = filteredHospitals.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    }

    if (sortBy === 'reviewCount') {
      filteredHospitals = filteredHospitals.sort(
        (a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0),
      );
    }

    // 페이징 처리
    const pagedHospitals = filteredHospitals.slice(
      pageNumber * pageSize,
      (pageNumber + 1) * pageSize,
    );

    return {
      content: pagedHospitals,
      totalPages: Math.ceil(filteredHospitals.length / pageSize),
      totalElements: filteredHospitals.length,
      number: pageNumber,
      size: pageSize,
      first: pageNumber === 0,
      last: (pageNumber + 1) * pageSize >= filteredHospitals.length,
    };
  }, [latitude, longitude, searchQuery, specialization, sortBy, pageNumber, pageSize]);

  const { data, loading, error } = useHospitalAsync(fetchHospitals, [
    latitude,
    longitude,
    searchQuery,
    specialization,
    sortBy,
    pageNumber,
    pageSize,
  ]);

  return { data, loading, error };
};

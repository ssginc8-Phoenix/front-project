// src/pages/HospitalSearchPage.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { fetchHospitals } from '~/features/hospitals/api/hospitalAPI';
import { useHospitalSearch } from '~/features/hospitals/hooks/useHospitalSearch';
import { useGlobalHospitalSearch } from '~/features/hospitals/hooks/useGlobalHospitalSearch';
import AroundMap from '~/features/hospitals/components/hospitalSearch/map/AroundMap';
import { useCurrentLocation } from '~/features/hospitals/hooks/useCurrentLocation';
import type { Hospital } from '~/features/hospitals/types/hospital';
import { useHospitalSearchStore } from '~/features/hospitals/state/hospitalSearchStore';
import HospitalList from '~/features/hospitals/components/hospitalSearch/hospitalList/HospitalList';
import HospitalDetailPanel from '~/features/hospitals/components/hospitalSearch/hospitalList/HospitalDetailPanel';
import SearchMenu from '~/features/hospitals/components/hospitalSearch/searchMenu/SearchMenu';
import PatientSelector from '~/features/hospitals/components/hospitalSearch/hospitalList/PatientSelector';

const MapContainer = styled.div`
  position: relative;
  height: 90vh;
  overflow-x: hidden;
`;

const FullMap = styled(AroundMap)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const SidePanel = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  bottom: 16px;
  width: 400px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ToggleGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
`;

const ToggleButton = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 0.5rem 1rem;
  background: ${({ active }) => (active ? '#00499e' : '#eee')};
  color: ${({ active }) => (active ? '#fff' : '#333')};
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;
const SidePanelWrapper = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  bottom: 16px;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  z-index: 1000;
`;

const ListWithSelectorRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0 1rem;
`;

const PAGE_SIZE = 10;
const RADIUS_KM = 5;
type SortBy = 'NAME' | 'DISTANCE' | 'REVIEW_COUNT';
const HospitalSearchPage: React.FC = () => {
  const { currentLocation } = useCurrentLocation();
  const { searchQuery, sortBy, setSearchQuery, setSortBy } = useHospitalSearchStore();

  const [searchLocation, setSearchLocation] = useState<{ lat: number; lng: number } | null>(null);

  const [page, setPage] = useState<number>(0);
  const [mode, setMode] = useState<'global' | 'nearby'>('global');
  const [radius, setRadius] = useState<number>(RADIUS_KM);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [patientMarker, setPatientMarker] = useState<{ lat: number; lng: number } | null>(null);

  // 1) 훅 호출: query, page, size, trigger, enabled
  const globalRes = useGlobalHospitalSearch(
    searchQuery,
    page,
    PAGE_SIZE,
    `${searchQuery}|${sortBy}|${page}`, // string trigger
    mode === 'global',
  );

  const nearbyRes = useHospitalSearch(
    searchLocation?.lat ?? currentLocation?.latitude ?? 0,
    searchLocation?.lng ?? currentLocation?.longitude ?? 0,
    searchQuery,
    sortBy,
    radius,
    `${searchQuery}|${sortBy}|${page}|${radius}|${searchLocation?.lat}|${searchLocation?.lng}`,
    mode === 'nearby',
  );

  // 2) 수동 검색 상태
  const [searchResults, setSearchResults] = useState<Hospital[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 3) map center 초기화
  const initialCenter = useMemo(
    () =>
      currentLocation
        ? { lat: currentLocation.latitude, lng: currentLocation.longitude }
        : { lat: 35.159545, lng: 129.075633 },
    [currentLocation],
  );
  const [mapCenter, setMapCenter] = useState(initialCenter);

  useEffect(() => {
    // 모드 변경 시 페이지, 수동 결과 초기화
    setPage(0);
    setSearchResults(null);
  }, [mode]);

  useEffect(() => {
    if (currentLocation) {
      setMapCenter({ lat: currentLocation.latitude, lng: currentLocation.longitude });
    }
  }, [currentLocation]);

  // 4) 수동 검색 함수 (글로벌 모드용 fetchHospitals)
  const doFetch = useCallback(
    async (q: string, s: SortBy, p: number) => {
      setLoading(true);
      setError(null);
      try {
        const lat = searchLocation?.lat ?? currentLocation?.latitude;
        const lng = searchLocation?.lng ?? currentLocation?.longitude;

        console.log('🔍 검색 위치:', { lat, lng }); // ✅ 로그 추가

        const params = {
          query: q,
          sortBy: s,
          latitude: lat,
          longitude: lng,
          page: p,
          size: PAGE_SIZE,
        };

        const resp = await fetchHospitals(params);
        setSearchResults(resp.content);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    },
    [currentLocation, searchLocation],
  );

  // 5) 검색 메뉴 제출 핸들러
  const handleSearch = useCallback(
    (q: string, s: SortBy, r: number) => {
      setSearchQuery(q);
      setSortBy(s);
      setRadius(r);
      setSelectedId(null);
      // page는 0으로 리셋 후 검색
      setPage(0);
      doFetch(q, s, 0);
    },
    [doFetch, setSearchQuery, setSortBy],
  );

  // 6) 페이지 변경 핸들러
  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
      if (searchResults !== null) {
        // 수동 검색 결과가 있으면 다시 fetch
        doFetch(searchQuery, sortBy as SortBy, newPage);
      }
    },
    [searchResults, searchQuery, sortBy, doFetch],
  );

  // 7) 최종 렌더링할 목록 결정
  const hospitals =
    searchResults !== null
      ? searchResults
      : mode === 'global'
        ? (globalRes.data?.content ?? [])
        : (nearbyRes.data?.content ?? []);

  const isLoading = loading || (mode === 'global' ? globalRes.loading : nearbyRes.loading);

  // 8) 마커/리스트 선택 핸들러
  const selectHospital = useCallback((h: Hospital) => {
    setSelectedId(h.hospitalId);
    setMapCenter({ lat: h.latitude, lng: h.longitude });
  }, []);

  const onMarkerClick = useCallback(
    (id: number) => {
      const h = hospitals.find((h) => h.hospitalId === id);
      if (h) selectHospital(h);
    },
    [hospitals, selectHospital],
  );
  const errMsgStr: string | null =
    error ?? (mode === 'global' ? globalRes.error : nearbyRes.error) ?? null;
  // HospitalList 에 넘길 Error 객체
  const errObj: Error | null = errMsgStr ? new Error(errMsgStr) : null;

  return (
    <MapContainer>
      <FullMap
        hospitals={hospitals}
        center={mapCenter}
        currentLocation={currentLocation}
        onMarkerClick={onMarkerClick}
        patientMarker={patientMarker}
      />

      <SidePanelWrapper>
        <SidePanel>
          <PatientSelector
            onLocate={(coords) => {
              setMapCenter(coords); // 지도 중심 이동
              setPatientMarker(coords); // 마커 위치 저장
              setSearchLocation(coords); // ✅ 내 주변 기준 위치 변경
            }}
          />
          <ToggleGroup>
            <ToggleButton active={mode === 'global'} onClick={() => setMode('global')}>
              전체 검색
            </ToggleButton>
            <ToggleButton active={mode === 'nearby'} onClick={() => setMode('nearby')}>
              내 주변
            </ToggleButton>
          </ToggleGroup>

          <SearchMenu
            initialQuery={searchQuery}
            initialSortBy={sortBy as SortBy}
            initialRadius={radius}
            onSearch={handleSearch}
          />

          {selectedId == null ? (
            <ListWithSelectorRow>
              <HospitalList
                hospitals={hospitals}
                loading={isLoading}
                error={errObj}
                currentPage={page}
                onPageChange={handlePageChange}
                onHospitalSelect={(id) => {
                  const h = hospitals.find((x) => x.hospitalId === id);
                  if (h) selectHospital(h);
                }}
                baseLocation={
                  patientMarker
                    ? patientMarker
                    : currentLocation
                      ? { lat: currentLocation.latitude, lng: currentLocation.longitude }
                      : undefined
                }
                selectedHospitalId={undefined}
              />
            </ListWithSelectorRow>
          ) : (
            <HospitalDetailPanel hospitalId={selectedId} onClose={() => setSelectedId(null)} />
          )}
        </SidePanel>
      </SidePanelWrapper>
    </MapContainer>
  );
};

export default HospitalSearchPage;

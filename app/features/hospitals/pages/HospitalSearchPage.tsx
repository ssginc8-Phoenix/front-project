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
import { media } from '~/features/hospitals/components/common/breakpoints';
import { ChevronUp, ChevronDown } from 'lucide-react';

const PAGE_SIZE = 10;
const RADIUS_KM = 5;
type SortBy = 'NAME' | 'DISTANCE' | 'REVIEW_COUNT';

/** 데스크탑/태블릿용 사이드 패널 래퍼 */
const SidePanelWrapper = styled.div`
  position: absolute;
  top: 16px;
  left: 50px;
  right: 10px;
  bottom: 16px;
  display: flex;
  z-index: 1000;
  gap: 1rem;

  ${media('tablet')`
    flex-direction: column;
    left: 50%;
    transform: translateX(-50%);
    width: 90vw;
  `}

  /* 모바일에서는 숨김 */
    ${media('mobile')`
    display: none;
  `}
`;

/** 데스크탑/태블릿용 사이드 패널 */
const SidePanel = styled.div`
  width: 400px;
  height: 100%; /* 화면 높이 100% 채움 */
  display: flex;
  flex-direction: column; /* 내부를 컬럼 flex 로 */
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

  ${media('laptop')`
    width: 300px;
  `}
  ${media('tablet')`
    width: 100%;
    border-radius: 0;
    box-shadow: none;
  `}
`;

/** 사이드패널 안의 스크롤 가능 콘텐츠 영역 */
const ContentWrapper = styled.div`
  flex: 1; /* SidePanel 높이의 남는 공간 모두 차지 */
  overflow-y: auto; /* 스크롤 생성 */
  padding: 1rem; /* 내부 여백 */
`;

/** 전체 화면 지도 컨테이너 */
export const MapContainer = styled.div`
  position: relative;
  height: 100%;
  width: 110%;
  margin-left: calc(-50vw + 50%);
  overflow: hidden;

  ${media('laptopL')`
    width: 100%;
  `}
  ${media('laptop')`
    width: calc(100% - 350px);
    margin-left: initial;
  `}
    ${media('tablet')`
    width: 100%;
    margin: 0;
  `}
`;
const FullMap = styled(AroundMap)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

/** 모바일 전용 하단 슬라이딩 드로어 */
const Drawer = styled.div<{ open: boolean }>`
  display: none;
  ${media('mobile')`
    display: block;
  `}
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 50vh;
  background: #fff;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(${(p) => (p.open ? '0' : 'calc(100% - 40px)')});
  transition: transform 0.3s ease-in-out;
  z-index: 1000;

  ${media('tablet')`
    height: 60vh;
  `}
`;
const Handle = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;
const PanelContent = styled.div`
  height: calc(100% - 40px);
  overflow-y: auto;
  padding: 0 1rem;

  ${media('mobile')`
    padding: 0 0.5rem;
  `}
`;

const ToggleGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem 0;
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

const ListWithSelectorRow = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0 1rem;

  /* 자식(리스트) 컴포넌트를 최대한 넓게 */
  & > * {
    flex: 1;
  }
`;

const HospitalSearchPage: React.FC = () => {
  const { currentLocation } = useCurrentLocation();
  const { searchQuery, sortBy, setSearchQuery, setSortBy } = useHospitalSearchStore();

  const [searchLocation, setSearchLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [mode, setMode] = useState<'global' | 'nearby'>('global');
  const [radius, setRadius] = useState(RADIUS_KM);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [patientMarker, setPatientMarker] = useState<{ lat: number; lng: number } | null>(null);

  // 글로벌 / 내 주변 검색 훅
  const globalRes = useGlobalHospitalSearch(
    searchQuery,
    page,
    PAGE_SIZE,
    `${searchQuery}|${sortBy}|${page}`,
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

  // 수동 검색 상태
  const [searchResults, setSearchResults] = useState<Hospital[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 지도 중심
  const initialCenter = useMemo(
    () =>
      currentLocation
        ? { lat: currentLocation.latitude, lng: currentLocation.longitude }
        : { lat: 35.159545, lng: 129.075633 },
    [currentLocation],
  );
  const [mapCenter, setMapCenter] = useState(initialCenter);

  useEffect(() => {
    setPage(0);
    setSearchResults(null);
  }, [mode]);

  useEffect(() => {
    if (currentLocation) {
      setMapCenter({ lat: currentLocation.latitude, lng: currentLocation.longitude });
    }
  }, [currentLocation]);

  const doFetch = useCallback(
    async (q: string, s: SortBy, p: number) => {
      setLoading(true);
      setError(null);
      try {
        const lat = searchLocation?.lat ?? currentLocation?.latitude;
        const lng = searchLocation?.lng ?? currentLocation?.longitude;
        const resp = await fetchHospitals({
          query: q,
          sortBy: s,
          latitude: lat,
          longitude: lng,
          page: p,
          size: PAGE_SIZE,
        });
        setSearchResults(resp.content);
      } catch (err: any) {
        setError(err.message || '검색 중 오류 발생');
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    },
    [currentLocation, searchLocation],
  );

  const handleSearch = useCallback(
    (q: string, s: SortBy, r: number) => {
      setSearchQuery(q);
      setSortBy(s);
      setRadius(r);
      setSelectedId(null);
      setPage(0);
      doFetch(q, s, 0);
    },
    [doFetch, setSearchQuery, setSortBy],
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
      if (searchResults !== null) {
        doFetch(searchQuery, sortBy as SortBy, newPage);
      }
    },
    [searchResults, searchQuery, sortBy, doFetch],
  );

  // 렌더링할 리스트 결정
  const hospitals =
    searchResults ?? (mode === 'global' ? globalRes.data?.content : nearbyRes.data?.content) ?? [];

  const isLoading = loading || (mode === 'global' ? globalRes.loading : nearbyRes.loading);
  const errMsg = error ?? (mode === 'global' ? globalRes.error : nearbyRes.error);
  const errObj = errMsg ? new Error(errMsg as string) : null;

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

  /** 패널 내용 공통 JSX */
  const panelBody = (
    <>
      <PatientSelector
        onLocate={(coords) => {
          setMapCenter(coords);
          setPatientMarker(coords);
          setSearchLocation(coords);
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
              patientMarker ??
              (currentLocation
                ? { lat: currentLocation.latitude, lng: currentLocation.longitude }
                : undefined)
            }
            selectedHospitalId={selectedId}
          />
        </ListWithSelectorRow>
      ) : (
        <HospitalDetailPanel hospitalId={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </>
  );

  return (
    <MapContainer>
      <FullMap
        hospitals={hospitals}
        center={mapCenter}
        currentLocation={currentLocation}
        onMarkerClick={onMarkerClick}
        patientMarker={patientMarker}
      />

      {/* 데스크탑/태블릿용 사이드 패널 */}
      <SidePanelWrapper>
        <SidePanel>
          <ContentWrapper>{panelBody}</ContentWrapper>
        </SidePanel>
      </SidePanelWrapper>

      {/* 모바일 전용 하단 드로어 */}
      <Drawer open={drawerOpen}>
        <Handle onClick={() => setDrawerOpen((o) => !o)}>
          {drawerOpen ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
        </Handle>
        <PanelContent>{panelBody}</PanelContent>
      </Drawer>
    </MapContainer>
  );
};

export default HospitalSearchPage;

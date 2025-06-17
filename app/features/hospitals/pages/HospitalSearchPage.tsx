import React, { useState, useCallback, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useCurrentLocation } from '../hooks/useCurrentLocation';
import SearchMenu from '../components/hospitalSearch/searchMenu/SearchMenu';
import HospitalList from '../components/hospitalSearch/hospitalList/HospitalList';
import AroundMap from '../components/hospitalSearch/map/AroundMap';
import HospitalDetailPanel from '../components/hospitalSearch/hospitalList/HospitalDetailPanel';
import { useHospitalSearchStore } from '../state/hospitalSearchStore';
import { useHospitalSearch } from '~/features/hospitals/hooks/useHospitalSearch';
import { useGlobalHospitalSearch } from '~/features/hospitals/hooks/useGlobalHospitalSearch';
import type { Hospital } from '../types/hospital';

const MapContainer = styled.div`
  position: relative;
  width: 91vw;
  height: 100vh;
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
  width: 360px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  overflow-x: hidden;
`;

const PAGE_SIZE = 1000;
const RADIUS_KM = 5;

const HospitalSearchPage: React.FC = () => {
  const { currentLocation } = useCurrentLocation();
  const { searchQuery, sortBy, setSearchQuery, setSortBy } = useHospitalSearchStore();

  const [searchMode, setSearchMode] = useState<'nearby' | 'global'>('global');
  const [selectedHospitalIdState, setSelectedHospitalIdState] = useState<number | null>(null);

  const initialCenter = useMemo(
    () =>
      currentLocation
        ? { lat: currentLocation.latitude, lng: currentLocation.longitude }
        : { lat: 35.159545, lng: 129.075633 },
    [currentLocation],
  );

  const [mapCenter, setMapCenter] = useState(initialCenter);

  useEffect(() => {
    if (currentLocation) {
      setMapCenter({ lat: currentLocation.latitude, lng: currentLocation.longitude });
    }
  }, [currentLocation]);

  const nearbySearchResult = useHospitalSearch(
    currentLocation?.latitude ?? null,
    currentLocation?.longitude ?? null,
    searchQuery,
    sortBy,
    RADIUS_KM,
    searchMode === 'nearby', // ✅ 실행 조건은 내부에서 처리
  );

  const globalSearch = useGlobalHospitalSearch(
    searchQuery,
    0,
    PAGE_SIZE,
    0,
    searchMode === 'global',
  );

  const hospitals =
    searchMode === 'nearby'
      ? (nearbySearchResult.data?.content ?? [])
      : (globalSearch.data?.content ?? []);

  const loading = searchMode === 'nearby' ? nearbySearchResult.loading : globalSearch.loading;

  const error =
    searchMode === 'nearby'
      ? (nearbySearchResult.error as Error | null)
      : (globalSearch.error as Error | null);

  const handleHospitalSelect = useCallback((h: Hospital) => {
    setSelectedHospitalIdState(h.hospitalId);
    setMapCenter({ lat: h.latitude, lng: h.longitude });
  }, []);

  const handleMarkerClick = useCallback(
    (id: number) => {
      const h = hospitals.find((x) => x.hospitalId === id);
      if (h) handleHospitalSelect(h);
    },
    [hospitals, handleHospitalSelect],
  );

  return (
    <MapContainer>
      <FullMap
        hospitals={hospitals}
        center={mapCenter}
        currentLocation={currentLocation}
        onMarkerClick={handleMarkerClick}
      />

      <SidePanel>
        <div style={{ padding: '1rem', display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => setSearchMode('global')}
            style={{
              background: searchMode === 'global' ? '#00499e' : '#eee',
              color: searchMode === 'global' ? '#fff' : '#333',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            전체 검색
          </button>
          <button
            onClick={() => {
              setSearchMode('nearby');
              if (currentLocation) {
                setMapCenter({
                  lat: currentLocation.latitude,
                  lng: currentLocation.longitude,
                });
              }
            }}
            style={{
              background: searchMode === 'nearby' ? '#00499e' : '#eee',
              color: searchMode === 'nearby' ? '#fff' : '#333',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            내 주변
          </button>
        </div>

        <SearchMenu
          currentSearchMode={searchMode}
          onSearchModeChange={setSearchMode}
          initialQuery={searchQuery}
          initialSortBy={sortBy}
          onSearch={(q, s) => {
            setSearchQuery(q);
            setSortBy(s);
            setSelectedHospitalIdState(null);
          }}
        />

        {selectedHospitalIdState == null ? (
          <HospitalList
            hospitals={hospitals}
            loading={loading}
            error={error}
            onHospitalSelect={(id) => {
              const h = hospitals.find((x) => x.hospitalId === id);
              if (h) handleHospitalSelect(h);
            }}
            selectedHospitalId={selectedHospitalIdState}
          />
        ) : (
          <HospitalDetailPanel
            hospitalId={selectedHospitalIdState}
            onClose={() => setSelectedHospitalIdState(null)}
          />
        )}

        {/*/>*/}
      </SidePanel>
    </MapContainer>
  );
};

export default HospitalSearchPage;

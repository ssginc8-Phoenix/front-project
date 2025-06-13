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
  width: 100vw;
  height: 100vh;
`;

const FullMap = styled(AroundMap)`
  width: 100%;
  height: 100%;
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
`;

const DetailModalWrapper = styled.div`
  position: absolute;
  top: 100px;
  right: 250px;
  width: 300px;
  max-height: 70vh;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1100;
`;

const PAGE_SIZE = 1000;

const HospitalSearchPage: React.FC = () => {
  const { currentLocation } = useCurrentLocation();
  const { searchQuery, sortBy, selectedHospitalId, setSearchQuery, setSortBy } =
    useHospitalSearchStore();

  const [searchMode, setSearchMode] = useState<'nearby' | 'global'>('nearby');
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
    PAGE_SIZE,
    searchMode === 'nearby',
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
      ? nearbySearchResult.error instanceof Error
        ? nearbySearchResult.error
        : null
      : globalSearch.error instanceof Error
        ? globalSearch.error
        : null;

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
      </SidePanel>

      {selectedHospitalIdState != null && (
        <DetailModalWrapper>
          <HospitalDetailPanel
            hospitalId={selectedHospitalIdState}
            onClose={() => setSelectedHospitalIdState(null)}
          />
        </DetailModalWrapper>
      )}
    </MapContainer>
  );
};

export default HospitalSearchPage;

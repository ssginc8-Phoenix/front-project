import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { useCurrentLocation } from '../hooks/useCurrentLocation';
import AroundMap from '../components/hospitalSearch/map/AroundMap';
import SearchMenu from '../components/hospitalSearch/searchMenu/SearchMenu';
import HospitalList from '../components/hospitalSearch/hospitalList/HospitalList';
import HospitalDetailPanel from '../components/hospitalSearch/hospitalList/HospitalDetailPanel';
import { useHospitalSearchStore } from '../state/hospitalSearchStore';
import { useHospitalSearch } from '../hooks/useHospitalSearch';
import { useGlobalHospitalSearch } from '../hooks/useGlobalHospitalSearch';
import type { Hospital } from '../types/hospital';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f4f7f9;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const MapColumn = styled.div`
  flex: 1;
  height: 1000vh;
`;

const DetailModalWrapper = styled.div`
  position: absolute;
  top: 400px;
  left: 100px;
  width: 300px;
  height: 200px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  padding: 1rem;
  overflow-y: auto;
  z-index: 1000;
  border-radius: 8px;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: #00499e;
  margin-top: 1rem;
  padding: 0 1rem;
`;

const HospitalSearchPage = () => {
  const { currentLocation } = useCurrentLocation();
  const {
    searchQuery,
    selectedSpecialization,
    sortBy,
    selectedHospitalId,
    setSearchQuery,
    setSortBy,
  } = useHospitalSearchStore();

  const [searchMode, setSearchMode] = useState<'nearby' | 'global'>('nearby');
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [page, setPage] = useState(0);
  const size = 10;

  // 위치 기반 검색 (specialization은 빈 문자열 방지)
  const nearbySearch = useHospitalSearch(
    currentLocation?.latitude || null,
    currentLocation?.longitude || null,
    searchQuery,
    selectedSpecialization || '',
    sortBy,
  );

  // 전역 검색 (specialization 인자 제거)
  const globalSearch = useGlobalHospitalSearch(searchQuery, page, size);

  // 검색 모드에 따라 데이터 선택
  const hospitalPage = searchMode === 'nearby' ? nearbySearch.data : globalSearch.data;
  const hospitalSearchLoading =
    searchMode === 'nearby' ? nearbySearch.loading : globalSearch.loading;
  const hospitalSearchError = searchMode === 'nearby' ? nearbySearch.error : globalSearch.error;

  // 안전한 에러 객체 생성
  const errorCandidate: unknown = hospitalSearchError;

  const hospitalSearchErrorObj = errorCandidate
    ? errorCandidate instanceof Error
      ? errorCandidate
      : new Error(String(errorCandidate))
    : null;

  const hospitalList = hospitalPage?.content ?? [];

  const handleHospitalSelect = useCallback(
    (hospitalId: number, lat: number, lng: number) => {
      const selected = hospitalList.find((h) => h.hospitalId === hospitalId);
      if (selected) {
        setSelectedHospital(selected);
        setMapCenter({ lat, lng });
      }
    },
    [hospitalList],
  );

  const handleCloseDetailPanel = () => {
    setSelectedHospital(null);
  };

  const initialCenter = currentLocation
    ? { lat: currentLocation.latitude, lng: currentLocation.longitude }
    : { lat: 35.159545, lng: 129.075633 };

  return (
    <PageContainer>
      <SearchMenu
        onSearchModeChange={setSearchMode}
        currentSearchMode={searchMode}
        initialQuery={searchQuery}
        initialSpecialization={selectedSpecialization}
        initialSortBy={sortBy}
        onSearch={(query: string, sortBy: string) => {
          // 검색어 상태를 업데이트하거나, 검색 실행 시 페이지 초기화 등 처리
          setSearchQuery(query);
          setSortBy(sortBy);
          setPage(0); // 전역 검색 페이지도 초기화
        }}
      />

      <ContentWrapper>
        <MapColumn>
          {searchMode === 'nearby' && (
            <>
              <SectionTitle>주변 병원 지도</SectionTitle>
              <AroundMap
                hospitals={hospitalList}
                center={mapCenter || initialCenter}
                onMarkerClick={handleHospitalSelect}
              />
            </>
          )}

          <HospitalList
            hospitals={hospitalList}
            loading={hospitalSearchLoading}
            error={hospitalSearchErrorObj}
            onHospitalSelect={handleHospitalSelect}
            selectedHospitalId={selectedHospitalId}
          />

          {/* 전역 검색 모드일 때만 페이지네이션 */}
          {searchMode === 'global' && hospitalPage && (
            <div style={{ padding: '1rem' }}>
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                disabled={page === 0}
              >
                이전
              </button>
              <span style={{ margin: '0 1rem' }}>
                {page + 1} / {hospitalPage.totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((prev) =>
                    hospitalPage && page + 1 < hospitalPage.totalPages ? prev + 1 : prev,
                  )
                }
                disabled={!hospitalPage || page + 1 >= hospitalPage.totalPages}
              >
                다음
              </button>
            </div>
          )}
        </MapColumn>

        {selectedHospital && (
          <DetailModalWrapper>
            <HospitalDetailPanel hospital={selectedHospital} onClose={handleCloseDetailPanel} />
          </DetailModalWrapper>
        )}
      </ContentWrapper>
    </PageContainer>
  );
};

export default HospitalSearchPage;

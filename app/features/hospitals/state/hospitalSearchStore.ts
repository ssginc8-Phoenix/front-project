// src/store/hospitalSearchStore.ts
import { create } from 'zustand';

interface HospitalSearchState {
  searchQuery: string;
  selectedSpecialization: string;
  sortBy: string;
  selectedHospitalId: number | null;

  setSearchQuery: (query: string) => void;
  setSelectedSpecialization: (specialization: string) => void;
  setSortBy: (sortBy: string) => void;
  setSelectedHospitalId: (id: number | null) => void;

  resetSearchConditions: () => void; // 검색 조건 초기화 액션 (선택 사항)
}

export const useHospitalSearchStore = create<HospitalSearchState>((set) => ({
  searchQuery: '',
  selectedSpecialization: '',
  sortBy: 'DISTANCE', // 기본 정렬 기준
  selectedHospitalId: null,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedSpecialization: (specialization) => set({ selectedSpecialization: specialization }),
  setSortBy: (sortBy) => set({ sortBy: sortBy }),
  setSelectedHospitalId: (id) => set({ selectedHospitalId: id }),

  resetSearchConditions: () =>
    set({
      searchQuery: '',
      selectedSpecialization: '',
      sortBy: 'DISTANCE',
    }),
}));
